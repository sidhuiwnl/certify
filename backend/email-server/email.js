import dotenv from "dotenv";

dotenv.config();

const STUDENT_DASHBOARD = process.env.STUDENT_DASHBOARD_URL;
const INSTITUTION = process.env.INSTITUTION;
const VERIFICATION = process.env.VERIFICATION;

export const templates = {
    student: {
        subject : "Welcome to E-Certify - Your Academic Credential Platform",
        body : (name,email) => ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to E-Certify!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your Academic Credential Platform</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${name},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Welcome to E-Certify! We're excited to have you join our blockchain-based academic credential platform. 
              As a student, you'll be able to:
            </p>
            
            <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              <li>Receive and store your academic certificates securely on the blockchain</li>
              <li>Share your credentials easily with employers and institutions</li>
              <li>Track the verification status of your certificates</li>
              <li>Access your credentials anytime, anywhere</li>
            </ul>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 10px;">Your Account Details:</h3>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Role:</strong> Student</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your account is now active and ready to use. Educational institutions will be able to issue 
              certificates directly to your account, and you'll receive notifications when new credentials are available.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${STUDENT_DASHBOARD}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Access Your Dashboard
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Best regards,<br>
              The E-Certify Team
            </p>
          </div>
        </div>`
    },
    institution: {
        subject: 'Welcome to E-Certify - Institution Portal',
        body: (name,email) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to E-Certify!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Institution Portal</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${name},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Welcome to E-Certify! We're excited to have Test join our blockchain-based academic credential platform. 
              As an educational institution, you'll be able to:
            </p>
            
            <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              <li>Issue digital certificates to students with blockchain security</li>
              <li>Track all issued certificates and their verification status</li>
              <li>Generate comprehensive analytics and reports</li>
              <li>Ensure tamper-proof credential issuance</li>
            </ul>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 10px;">Your Institution Details:</h3>
<!--              <p style="margin: 5px 0;"><strong>Institution:</strong> {{institutionName}}</p>-->
              <p style="margin: 5px 0;"><strong>Contact:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Role:</strong> Institution</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your institution account is now active. You can start issuing certificates to students immediately. 
              All certificates will be securely stored on the blockchain and automatically sent to students via email.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${INSTITUTION}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Access Institution Dashboard
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you need any assistance with certificate issuance or have questions about the platform, 
              our support team is here to help.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Best regards,<br>
              The E-Certify Team
            </p>
          </div>
        </div>
      `
    },
    verifier: {
        subject: 'Welcome to E-Certify - Verifier Portal',
        body: (name,email) =>  `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to E-Certify!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Verifier Portal</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${name},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Welcome to E-Certify! We're excited to have Tech join our blockchain-based academic credential platform. 
              As a verifier, you'll be able to:
            </p>
            
            <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              <li>Verify academic certificates instantly using blockchain technology</li>
              <li>Access comprehensive verification tools and analytics</li>
              <li>Receive notifications for new certificates requiring verification</li>
              <li>Ensure the authenticity of academic credentials</li>
            </ul>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 10px;">Your Verifier Details:</h3>
<!--              <p style="margin: 5px 0;"><strong>Company:</strong> {{companyName}}</p>-->
              <p style="margin: 5px 0;"><strong>Contact:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Role:</strong> Verifier</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your verifier account is now active. You can start verifying certificates immediately. 
              You'll receive notifications when new certificates are available for verification.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${VERIFICATION}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Access Verifier Dashboard
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you need any assistance with the verification process or have questions about the platform, 
              our support team is here to help.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Best regards,<br>
              The E-Certify Team
            </p>
          </div>
        </div>
      `
    },
    certificateTemplate : {
        subject: 'Your Academic Certificate Has Been Issued - E-Certify',
        body: (studentName,courseName,grade,institutionName,issueDate,completionDate,certificateId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Certificate Issued!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your academic credential is ready</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Congratulations ${studentName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your academic certificate has been successfully issued and is now securely stored on the blockchain. 
            You can access and share this credential anytime.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Certificate Details:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 5px 0;"><strong>Course:</strong> ${courseName}</p>
                <p style="margin: 5px 0;"><strong>Grade:</strong> ${grade}</p>
                <p style="margin: 5px 0;"><strong>Institution:</strong> ${institutionName}</p>
              </div>
              <div>
                <p style="margin: 5px 0;"><strong>Issue Date:</strong> ${issueDate}</p>
                <p style="margin: 5px 0;"><strong>Completion Date:</strong> ${completionDate}</p>
                <p style="margin: 5px 0;"><strong>Certificate ID:</strong> ${certificateId}</p>
              </div>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your certificate is attached to this email in PDF format. You can also access it anytime through your 
            E-Certify dashboard. The certificate is cryptographically secured and can be verified by anyone using 
            the provided QR code or certificate ID.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${STUDENT_DASHBOARD}" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View in Dashboard
            </a>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #155724; margin: 0; font-size: 14px;">
              <strong>Security Note:</strong> This certificate is stored on the blockchain and cannot be tampered with. 
              The attached PDF is for your convenience and can be shared with employers or other institutions.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            ${institutionName}<br>
            via E-Certify Platform
          </p>
        </div>
      </div>
      `
    },
    verificationRequest: {
        subject: 'New Certificate Available for Verification - E-Certify',
        body: (verifierName,studentName,courseName,institutionName,issueDate,certificateId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Verification Request</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">New certificate available for verification</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${verifierName},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            A new academic certificate has been issued and is now available for verification. 
            Please review the certificate details and verify its authenticity.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Certificate Details:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 5px 0;"><strong>Student:</strong> ${studentName}</p>
                <p style="margin: 5px 0;"><strong>Course:</strong> ${courseName}</p>
                <p style="margin: 5px 0;"><strong>Institution:</strong> ${institutionName}</p>
              </div>
              <div>
                <p style="margin: 5px 0;"><strong>Issue Date:</strong> ${issueDate}</p>
                <p style="margin: 5px 0;"><strong>Certificate ID:</strong> ${certificateId}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending Verification</span></p>
              </div>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Please log into your verifier dashboard to review and verify this certificate. 
            The verification process helps maintain the integrity of academic credentials on our platform.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${VERIFICATION}" style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Verify Certificate
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Note:</strong> This verification request is automatically generated when new certificates are issued. 
              Please verify the certificate within 48 hours to maintain platform efficiency.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The E-Certify Team
          </p>
        </div>
      </div>
    `
    }
}

