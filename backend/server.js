const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // use service role for server-side operations
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Helper to log supabase responses succinctly
function logSupResponse(op, resp) {
  try {
    const err = resp && resp.error ? resp.error : null;
    const data = resp && resp.data ? resp.data : null;
    console.log(`[Supabase:${op}] error=${err ? (err.message || JSON.stringify(err)) : 'null'} data=${data ? (Array.isArray(data) ? `array(${data.length})` : 'object') : 'null'}`);
    if (err) console.debug(`[Supabase:${op}] full error:`, err);
  } catch (e) {
    console.warn('logSupResponse failed', e);
  }
}

// Simple contract: register -> create user row (password hashed), login -> verify and return JWT, /me -> return user by token

app.post('/api/register', async (req, res) => {
  const { name, email, password, role, institution_name, company_name } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // check existing
  const existingResp = await supabase.from('users').select('*').eq('email', email).limit(1);
  logSupResponse('select_existing_user', existingResp);
  const { data: existing, error: fetchErr } = existingResp;
  if (fetchErr) throw fetchErr;
  if (existing && existing.length > 0) return res.status(409).json({ error: 'User already exists' });

    // Resolve role -> role_id in normalized roles table
    let roleId = null;
    let roleName = role;
    try {
      const { data: roleRow, error: roleErr } = await supabase.from('roles').select('id,name').eq('name', role).limit(1).single();
      if (roleErr) {
        // If roles table might not exist or row not found, try inserting the role name
    const createdRoleResp = await supabase.from('roles').insert([{ name: role }]).select().single();
    logSupResponse('insert_role', createdRoleResp);
    const { data: createdRole, error: createRoleErr } = createdRoleResp;
    if (createRoleErr) throw createRoleErr;
    roleId = createdRole.id;
    roleName = createdRole.name;
      } else {
        roleId = roleRow.id;
        roleName = roleRow.name;
      }
    } catch (rErr) {
      // fallback: try to create role directly
      try {
        const { data: createdRole2, error: createRoleErr2 } = await supabase.from('roles').insert([{ name: role }]).select().single();
        if (createRoleErr2) throw createRoleErr2;
        roleId = createdRole2.id;
        roleName = createdRole2.name;
      } catch (finalRoleErr) {
        throw finalRoleErr;
      }
    }

    // If institution role, create or find institution
    let institutionId = null;
    if (roleName === 'institution' && institution_name) {
      const instResp = await supabase.from('institutions').select('id').eq('name', institution_name).limit(1).single();
      logSupResponse('select_institution', instResp);
      const { data: instRow, error: instErr } = instResp;
      if (instErr) {
        const createdInstResp = await supabase.from('institutions').insert([{ name: institution_name, contact_email: email }]).select().single();
        logSupResponse('insert_institution', createdInstResp);
        const { data: createdInst, error: createInstErr } = createdInstResp;
        if (createInstErr) throw createInstErr;
        institutionId = createdInst.id;
      } else {
        institutionId = instRow.id;
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const insertPayload = {
      name,
      email,
      password: hashed,
      role_id: roleId,
      company_name: company_name || null,
      institution_id: institutionId || null
    };

  const insertResp = await supabase.from('users').insert([insertPayload]).select().single();
  logSupResponse('insert_user', insertResp);
  const { data, error } = insertResp;
  if (error) throw error;

    // build returned user and sign token
    const userPayload = { id: data.id, email: data.email, name: data.name, role: roleName, institution_id: data.institution_id };
    const token = jwt.sign({ id: data.id, email: data.email, role: roleName }, JWT_SECRET, { expiresIn: '7d' });

    // optional: create a session row
    try {
      // request the inserted row back so logs/users can inspect it. If the sessions
      // table doesn't RETURNING by default, using .select().single() will fetch it.
      const sessResp = await supabase.from('sessions').insert([{ user_id: data.id, token, created_at: new Date().toISOString() }]).select().single();
      logSupResponse('insert_session', sessResp);
    } catch (sessErr) {
      console.warn('Session insert failed', sessErr && sessErr.message);
    }

    return res.status(201).json({ token, user: userPayload });
  } catch (err) {
    // Log full error details (some errors from undici have non-enumerable props)
    try {
      console.error('Register error', err && err.message);
      console.debug('Register error full:', err && Object.getOwnPropertyNames ? JSON.stringify(err, Object.getOwnPropertyNames(err)) : err);
    } catch (logErr) {
      console.error('Register error (stringify failed)', err);
    }
    return res.status(500).json({ error: 'Registration failed', detail: err && err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
  // fetch user - use maybeSingle so zero rows does not return a PostgREST coercion error
  const userResp = await supabase.from('users').select('*').eq('email', email).maybeSingle();
  logSupResponse('select_user_by_email', userResp);
  const { data: userRow, error: userErr } = userResp;
  if (userErr) return res.status(500).json({ error: 'Login failed', detail: userErr.message });
  if (!userRow) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, userRow.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // get role name
    let roleName = null;
    try {
  const roleResp = await supabase.from('roles').select('name').eq('id', userRow.role_id).limit(1).single();
  logSupResponse('select_role_by_id', roleResp);
  const { data: roleRow } = roleResp;
  roleName = roleRow ? roleRow.name : null;
    } catch (rErr) {
      roleName = null;
    }

    const payload = { id: userRow.id, email: userRow.email, role: roleName };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // create session row and return the inserted row for logging/diagnostics
    try {
      const sessResp = await supabase.from('sessions').insert([{ user_id: userRow.id, token, created_at: new Date().toISOString() }]).select().single();
      logSupResponse('insert_session_login', sessResp);
    } catch (sessErr) {
      console.warn('Session insert failed', sessErr && sessErr.message);
    }

    return res.json({ token, user: payload });
  } catch (err) {
    try {
      console.error('Login error', err && err.message);
      console.debug('Login error full:', err && Object.getOwnPropertyNames ? JSON.stringify(err, Object.getOwnPropertyNames(err)) : err);
    } catch (logErr) {
      console.error('Login error (stringify failed)', err);
    }
    return res.status(500).json({ error: 'Login failed', detail: err && err.message });
  }
});

// middleware to protect routes
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing auth header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid auth format' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
  const resp = await supabase.from('users').select('id,name,email,role_id,institution_id,company_name,is_verified').eq('id', userId).single();
  logSupResponse('me_select_user', resp);
  const { data, error } = resp;
  if (error) throw error;
  return res.json({ user: data });
  } catch (err) {
    try {
      console.error('Me error', err && err.message, JSON.stringify(err, Object.getOwnPropertyNames(err)));
    } catch (logErr) {
      console.error('Me error (stringify failed)', err);
    }
    return res.status(500).json({ error: 'Failed to fetch user', detail: err && err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on port ${port}`));

// Simple ping endpoint to verify Supabase connectivity from the server
app.get('/api/ping', async (req, res) => {
  try {
    const resp = await supabase.from('roles').select('id').limit(1);
    logSupResponse('ping_select_roles', resp);
    const { error } = resp;
    if (error) return res.status(500).json({ ok: false, detail: error.message || error });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Ping failed', err && err.message);
    return res.status(500).json({ ok: false, detail: err && err.message });
  }
});

// Middleware helper to require role
function requireRole(roleName) {
  return async (req, res, next) => {
    // req.user should have role name
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== roleName) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// Create a certificate (only institution users should call this)
app.post('/api/certificates', authMiddleware, async (req, res) => {

  console.log("the data",req.body);


  const { student_name, student_email, course_name, certificate_type, grade, completion_date, issuer_institution_id } = req.body;
  // simple role check: allow issuer or institution
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  try {
    // insert certificate
    const certResp = await supabase.from('certificates').insert([{
      issuer_user_id: req.user.id,
      issuer_institution_id: issuer_institution_id || null,
      student_name,
      student_email,
      course_name,
      certificate_type,
      grade,
      completion_date: completion_date || null
    }]).select().single();
    logSupResponse('insert_certificate', certResp);
    const { data, error } = certResp;
    if (error) {
      console.error('Insert certificate returned error', error);
      return res.status(500).json({ error: 'Failed to create certificate', detail: error.message || error });
    }
    return res.status(201).json({ certificate: data });
  } catch (err) {
    console.error('Create certificate error', err && err.message);
    console.debug('Create certificate error full:', err);
    return res.status(500).json({ error: 'Failed to create certificate', detail: err && (err.message || JSON.stringify(err)) });
  }
});

// Student requests verification by specifying verifier id (creates verification_requests row)
app.post('/api/certificates/:id/request-verification', authMiddleware, async (req, res) => {
  const certId = req.params.id;
  const { verifier_id, message } = req.body;
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  try {
    // ensure certificate exists and student_email matches or recipient matches
    const { data: cert } = await supabase.from('certificates').select('*').eq('id', certId).single();
    if (!cert) return res.status(404).json({ error: 'Certificate not found' });

    // create request assigned to specific verifier only
    const vrResp = await supabase.from('verification_requests').insert([{
      certificate_id: certId,
      verifier_id,
      student_id: req.user.id,
      message: message || null,
      status: 'pending'
    }]).select().single();
    logSupResponse('insert_verification_request', vrResp);
    const { data, error } = vrResp;
    if (error) {
      console.error('Insert verification_request error', error);
      return res.status(500).json({ error: 'Failed to request verification', detail: error.message || error });
    }
    return res.status(201).json({ request: data });
  } catch (err) {
    console.error('Request verification error', err && err.message);
    console.debug('Request verification error full:', err);
    return res.status(500).json({ error: 'Failed to request verification', detail: err && (err.message || JSON.stringify(err)) });
  }
});

// Verifier: list verification requests assigned to them
app.get('/api/verifier/requests', authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  try {
  const resp = await supabase.from('verification_requests').select('id,certificate_id,student_id,status,message,created_at').eq('verifier_id', req.user.id).order('created_at', { ascending: false });
  logSupResponse('select_verifier_requests', resp);
  const { data, error } = resp;
  if (error) throw error;
  return res.json({ requests: data });
  } catch (err) {
    console.error('List verifier requests error', err && err.message);
    return res.status(500).json({ error: 'Failed to list requests', detail: err && err.message });
  }
});

// Verifier verifies a request: update verification_requests.status, create verifications row and update certificate
app.post('/api/verification_requests/:id/verify', authMiddleware, async (req, res) => {
  const reqId = req.params.id;
  const { result, details } = req.body; // result: boolean
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  try {
    // load request and confirm assigned to this verifier
  const vreqResp = await supabase.from('verification_requests').select('*').eq('id', reqId).single();
  logSupResponse('select_verification_request_by_id', vreqResp);
  const { data: vreq, error: vreqErr } = vreqResp;
  if (vreqErr) return res.status(404).json({ error: 'Verification request not found', detail: vreqErr.message });
    if (vreq.verifier_id !== req.user.id) return res.status(403).json({ error: 'Not authorized to verify this request' });

    // insert verification record
    const verifResp = await supabase.from('verifications').insert([{
      certificate_id: vreq.certificate_id,
      verifier_user_id: req.user.id,
      result: !!result,
      details: details || {}
    }]).select().single();
    logSupResponse('insert_verification', verifResp);
    const { data: verifData, error: verifErr } = verifResp;
    if (verifErr) throw verifErr;

    // update request status
    await supabase.from('verification_requests').update({ status: 'done' }).eq('id', reqId);

    // if verified, update certificate
    if (result) {
      await supabase.from('certificates').update({ is_verified: true, status: 'verified' }).eq('id', vreq.certificate_id);
    } else {
      await supabase.from('certificates').update({ status: 'rejected' }).eq('id', vreq.certificate_id);
    }

    return res.json({ verification: verifData });
  } catch (err) {
    console.error('Verify request error', err && err.message);
    return res.status(500).json({ error: 'Failed to verify', detail: err && err.message });
  }
});

app.post('/api/certificates/:id/status', authMiddleware, async (req, res) => {
  const certId = req.params.id;
  const { status } = req.body;

  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const { data, error } = await supabase
      .from('certificates')
      .update({ status: status, is_verified: status === 'verified' })
      .eq('id', certId);

    if (error) {
      console.error('Error updating certificate status', error);
      return res.status(500).json({ error: 'Failed to update certificate status', detail: error.message || error });
    }

    return res.status(200).json({ certificate: data });
  } catch (err) {
    console.error('Update certificate status error', err && err.message);
    return res.status(500).json({ error: 'Failed to update certificate status', detail: err && (err.message || JSON.stringify(err)) });
  }
});

app.get('/api/users/by-email/:email', async (req, res) => {
  const email = req.params.email;



  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error getting user by email', error);
      return res.status(500).json({ error: 'Failed to get user by email', detail: error.message || error });
    }

    return res.status(200).json({ user: data });
  } catch (err) {
    console.error('Get user by email error', err && err.message);
    return res.status(500).json({ error: 'Failed to get user by email', detail: err && (err.message || JSON.stringify(err)) });
  }
});
