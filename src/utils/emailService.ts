import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Email templates
const EMAIL_TEMPLATES = {
  welcome: {
    student: {
      subject: 'Welcome to E-Certify - Your Academic Credential Platform',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to E-Certify!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your Academic Credential Platform</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello {{name}},</h2>
            
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
              <p style="margin: 5px 0;"><strong>Email:</strong> {{email}}</p>
              <p style="margin: 5px 0;"><strong>Role:</strong> Student</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your account is now active and ready to use. Educational institutions will be able to issue 
              certificates directly to your account, and you'll receive notifications when new credentials are available.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{loginUrl}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
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
        </div>
      `
    },
    institution: {
      subject: 'Welcome to E-Certify - Institution Portal',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to E-Certify!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Institution Portal</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello {{name}},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Welcome to E-Certify! We're excited to have {{institutionName}} join our blockchain-based academic credential platform. 
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
              <p style="margin: 5px 0;"><strong>Institution:</strong> {{institutionName}}</p>
              <p style="margin: 5px 0;"><strong>Contact:</strong> {{email}}</p>
              <p style="margin: 5px 0;"><strong>Role:</strong> Institution</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your institution account is now active. You can start issuing certificates to students immediately. 
              All certificates will be securely stored on the blockchain and automatically sent to students via email.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{loginUrl}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
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
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to E-Certify!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Verifier Portal</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello {{name}},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Welcome to E-Certify! We're excited to have {{companyName}} join our blockchain-based academic credential platform. 
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
              <p style="margin: 5px 0;"><strong>Company:</strong> {{companyName}}</p>
              <p style="margin: 5px 0;"><strong>Contact:</strong> {{email}}</p>
              <p style="margin: 5px 0;"><strong>Role:</strong> Verifier</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your verifier account is now active. You can start verifying certificates immediately. 
              You'll receive notifications when new certificates are available for verification.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{loginUrl}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
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
    }
  },
  
  certificateIssued: {
    subject: 'Your Academic Certificate Has Been Issued - E-Certify',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Certificate Issued!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your academic credential is ready</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Congratulations {{studentName}}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your academic certificate has been successfully issued and is now securely stored on the blockchain. 
            You can access and share this credential anytime.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Certificate Details:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 5px 0;"><strong>Course:</strong> {{courseName}}</p>
                <p style="margin: 5px 0;"><strong>Grade:</strong> {{grade}}</p>
                <p style="margin: 5px 0;"><strong>Institution:</strong> {{institutionName}}</p>
              </div>
              <div>
                <p style="margin: 5px 0;"><strong>Issue Date:</strong> {{issueDate}}</p>
                <p style="margin: 5px 0;"><strong>Completion Date:</strong> {{completionDate}}</p>
                <p style="margin: 5px 0;"><strong>Certificate ID:</strong> {{certificateId}}</p>
              </div>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your certificate is attached to this email in PDF format. You can also access it anytime through your 
            E-Certify dashboard. The certificate is cryptographically secured and can be verified by anyone using 
            the provided QR code or certificate ID.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
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
            {{institutionName}}<br>
            via E-Certify Platform
          </p>
        </div>
      </div>
    `
  },
  
  verificationRequest: {
    subject: 'New Certificate Available for Verification - E-Certify',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Verification Request</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">New certificate available for verification</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello {{verifierName}},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            A new academic certificate has been issued and is now available for verification. 
            Please review the certificate details and verify its authenticity.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Certificate Details:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 5px 0;"><strong>Student:</strong> {{studentName}}</p>
                <p style="margin: 5px 0;"><strong>Course:</strong> {{courseName}}</p>
                <p style="margin: 5px 0;"><strong>Institution:</strong> {{institutionName}}</p>
              </div>
              <div>
                <p style="margin: 5px 0;"><strong>Issue Date:</strong> {{issueDate}}</p>
                <p style="margin: 5px 0;"><strong>Certificate ID:</strong> {{certificateId}}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending Verification</span></p>
              </div>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Please log into your verifier dashboard to review and verify this certificate. 
            The verification process helps maintain the integrity of academic credentials on our platform.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{verifierDashboardUrl}}" style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
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
};

// Email service class
export class EmailService {
  private static instance: EmailService;
  
  private constructor() {}
  
  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send welcome email based on user role
  public async sendWelcomeEmail(user: any): Promise<boolean> {
    try {
      const template = EMAIL_TEMPLATES.welcome[user.role as keyof typeof EMAIL_TEMPLATES.welcome];
      if (!template) {
        console.error('No template found for role:', user.role);
        return false;
      }

      const loginUrl = `${window.location.origin}/login`;
      let body = template.body
        .replace(/{{name}}/g, user.name)
        .replace(/{{email}}/g, user.email)
        .replace(/{{loginUrl}}/g, loginUrl);

      // Add role-specific replacements
      if (user.role === 'institution' && user.institutionName) {
        body = body.replace(/{{institutionName}}/g, user.institutionName);
      }
      if (user.role === 'verifier' && user.companyName) {
        body = body.replace(/{{companyName}}/g, user.companyName);
      }

      // In a real application, you would send this via your email service
      console.log('Sending welcome email to:', user.email);
      console.log('Subject:', template.subject);
      console.log('Body:', body);

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  // Send certificate issued email with PDF attachment
  public async sendCertificateEmail(certificate: any, studentEmail: string): Promise<boolean> {
    try {
      const template = EMAIL_TEMPLATES.certificateIssued;
      
      const dashboardUrl = `${window.location.origin}/dashboard`;
      const body = template.body
        .replace(/{{studentName}}/g, certificate.studentName)
        .replace(/{{courseName}}/g, certificate.courseName)
        .replace(/{{grade}}/g, certificate.grade)
        .replace(/{{institutionName}}/g, certificate.institutionName)
        .replace(/{{issueDate}}/g, new Date(certificate.issueDate).toLocaleDateString())
        .replace(/{{completionDate}}/g, new Date(certificate.completionDate).toLocaleDateString())
        .replace(/{{certificateId}}/g, certificate.id)
        .replace(/{{dashboardUrl}}/g, dashboardUrl);

      // Generate PDF certificate
      const pdfBlob = await this.generateCertificatePDF(certificate);

      console.log('Sending certificate email to:', studentEmail);
      console.log('Subject:', template.subject);
      console.log('Body:', body);
      console.log('PDF generated:', pdfBlob.size, 'bytes');

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      console.error('Error sending certificate email:', error);
      return false;
    }
  }

  // Send verification request email to verifiers
  public async sendVerificationRequestEmail(certificate: any, verifierEmail: string, verifierName: string): Promise<boolean> {
    try {
      const template = EMAIL_TEMPLATES.verificationRequest;
      
      const verifierDashboardUrl = `${window.location.origin}/verifier-dashboard`;
      const body = template.body
        .replace(/{{verifierName}}/g, verifierName)
        .replace(/{{studentName}}/g, certificate.studentName)
        .replace(/{{courseName}}/g, certificate.courseName)
        .replace(/{{institutionName}}/g, certificate.institutionName)
        .replace(/{{issueDate}}/g, new Date(certificate.issueDate).toLocaleDateString())
        .replace(/{{certificateId}}/g, certificate.id)
        .replace(/{{verifierDashboardUrl}}/g, verifierDashboardUrl);

      console.log('Sending verification request email to:', verifierEmail);
      console.log('Subject:', template.subject);
      console.log('Body:', body);

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending verification request email:', error);
      return false;
    }
  }

  // Generate PDF certificate
  private async generateCertificatePDF(certificate: any): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create a temporary div for the certificate
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.width = '800px';
        tempDiv.style.height = '600px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.padding = '40px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        
        tempDiv.innerHTML = `
          <div style="text-align: center; border: 3px solid #667eea; padding: 40px; height: 100%; box-sizing: border-box;">
            <div style="margin-bottom: 40px;">
              <h1 style="color: #667eea; font-size: 36px; margin: 0 0 10px 0;">Certificate of Completion</h1>
              <p style="color: #666; font-size: 18px; margin: 0;">This certifies that</p>
            </div>
            
            <div style="margin-bottom: 40px;">
              <h2 style="color: #333; font-size: 32px; margin: 0 0 20px 0;">${certificate.studentName}</h2>
              <p style="color: #666; font-size: 18px; margin: 0 0 15px 0;">has successfully completed</p>
              <h3 style="color: #333; font-size: 24px; margin: 0 0 15px 0;">${certificate.courseName}</h3>
              <p style="color: #666; font-size: 18px; margin: 0;">with a grade of <strong style="color: #28a745;">${certificate.grade}</strong></p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
              <div style="text-align: center;">
                <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">Issued by</p>
                <p style="color: #333; font-size: 16px; font-weight: bold; margin: 0;">${certificate.institutionName}</p>
              </div>
              
              <div style="text-align: center;">
                <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">Completion Date</p>
                <p style="color: #333; font-size: 16px; font-weight: bold; margin: 0;">${new Date(certificate.completionDate).toLocaleDateString()}</p>
              </div>
              
              <div style="text-align: center;">
                <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">Issue Date</p>
                <p style="color: #333; font-size: 16px; font-weight: bold; margin: 0;">${new Date(certificate.issueDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p style="color: #666; font-size: 12px; margin: 0;">Certificate ID: ${certificate.id}</p>
              <p style="color: #666; font-size: 12px; margin: 0;">Blockchain Hash: ${certificate.blockchainHash}</p>
            </div>
            
            <div style="border-top: 2px solid #667eea; padding-top: 20px;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                This certificate is cryptographically secured on the blockchain and can be verified at any time.
              </p>
            </div>
          </div>
        `;
        
        document.body.appendChild(tempDiv);
        
        // Convert to canvas and then to PDF
        const canvas = await html2canvas(tempDiv, { 
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        
        document.body.removeChild(tempDiv);
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        
        // Convert PDF to blob
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get all verifiers for notification
  public async getVerifiers(): Promise<any[]> {
    try {
      const registeredUsers = localStorage.getItem('registeredUsers');
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers);
        return users.filter((user: any) => user.role === 'verifier');
      }
      return [];
    } catch (error) {
      console.error('Error getting verifiers:', error);
      return [];
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
