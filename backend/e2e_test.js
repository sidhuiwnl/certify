;(async()=>{
  const API = 'http://localhost:4000';
  try{
    const regBody = { name:'Test E2E', email:'inst_e2e2@example.com', password:'demo123', role:'institution', institution_name:'Test E2E' };
    const regResp = await fetch(`${API}/api/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(regBody)});
    console.log('REG status', regResp.status);
    const regJson = await regResp.text(); console.log('REG body', regJson);

    const loginBody = { email:'inst_e2e2@example.com', password:'demo123' };
    const loginResp = await fetch(`${API}/api/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(loginBody)});
    console.log('LOGIN status', loginResp.status);
    const loginJson = await loginResp.json(); console.log('LOGIN body', loginJson);
    if (!loginJson || !loginJson.token) return;

    const token = loginJson.token;
    const postBody = { student_name:'E2E Student', student_email:'e2e_student2@example.com', course_name:'E2E Course', certificate_type:'degree', grade:'A', completion_date:null, issuer_institution_id: null };
    const postResp = await fetch(`${API}/api/certificates`, { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token}, body:JSON.stringify(postBody)});
    console.log('POST status', postResp.status);
    const postJson = await postResp.text(); console.log('POST body', postJson);
  } catch (e) {
    console.error('E2E error', e);
  }
})();
