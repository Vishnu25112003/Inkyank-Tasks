import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not configured. Email notifications will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail', // Can be changed to other services
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate student email template
const generateStudentEmailTemplate = (application) => {
  return {
    subject: '🎓 College Application Received - Confirmation',
    html: `<!DOCTYPE html>
<html><head><style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #3B82F6, #6366F1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
  .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
  .info-section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3B82F6; }
  .footer { text-align: center; margin-top: 30px; color: #666; }
  .highlight { color: #3B82F6; font-weight: bold; }
</style></head><body>
  <div class="container">
    <div class="header">
      <h1>🎓 Application Received!</h1>
      <p>Thank you for applying to our college</p>
    </div>
    <div class="content">
      <h2>Dear ${application.firstName} ${application.lastName},</h2>
      <p>We have successfully received your college application. Here are the details we have on file:</p>
      <div class="info-section">
        <h3>📋 Application Summary</h3>
        <p><strong>Application ID:</strong> <span class="highlight">${application._id}</span></p>
        <p><strong>Submitted:</strong> ${new Date(application.createdAt).toLocaleString()}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phoneNumber}</p>
        <p><strong>Intended Major:</strong> ${application.intendedMajor}</p>
        <p><strong>GPA:</strong> ${application.gpa}</p>
        <p><strong>Test Score:</strong> ${application.testScore}</p>
      </div>
      <div class="info-section">
        <h3>📍 Address Information</h3>
        <p>${application.address}<br>${application.city}, ${application.state} ${application.postalCode}<br>${application.country}</p>
      </div>
      <div class="info-section">
        <h3>🎯 Next Steps</h3>
        <ul>
          <li>Our admissions team will review your application within 2-3 weeks</li>
          <li>You will receive an email notification about your application status</li>
          <li>If you have any questions, please contact our admissions office</li>
          <li>Keep this email for your records</li>
        </ul>
      </div>
      <p><strong>Important:</strong> Please save your Application ID (<span class="highlight">${application._id}</span>) for future reference.</p>
      <div class="footer">
        <p>Best regards,<br><strong>Admissions Office</strong><br>College Application Portal<br>📧 admissions@college.edu | 📞 (555) 123-4567</p>
      </div>
    </div>
  </div>
</body></html>`
  };
};

// Generate admin email template
const generateAdminEmailTemplate = (application) => {
  return {
    subject: `🆕 New College Application - ${application.firstName} ${application.lastName}`,
    html: `<!DOCTYPE html>
<html><head><style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 700px; margin: 0 auto; padding: 20px; }
  .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
  .section { background: white; padding: 20px; margin: 15px 0; border-radius: 6px; border: 1px solid #e5e7eb; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
  .field { margin-bottom: 10px; }
  .label { font-weight: bold; color: #374151; }
  .value { color: #6b7280; }
</style></head><body>
  <div class="container">
    <div class="header">
      <h1>🆕 New Application Received</h1>
      <p>Application ID: ${application._id}</p>
    </div>
    <div class="content">
      <div class="section">
        <h3>👤 Personal Information</h3>
        <div class="grid">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${application.firstName} ${application.lastName}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${application.email}</div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${application.phoneNumber}</div>
          </div>
          <div class="field">
            <div class="label">Date of Birth:</div>
            <div class="value">${new Date(application.dateOfBirth).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <h3>📍 Address</h3>
        <div class="value">
          ${application.address}<br>${application.city}, ${application.state} ${application.postalCode}<br>${application.country}
        </div>
      </div>
      <div class="section">
        <h3>🎓 Academic Information</h3>
        <div class="grid">
          <div class="field"><div class="label">High School:</div><div class="value">${application.highSchoolName}</div></div>
          <div class="field"><div class="label">GPA:</div><div class="value">${application.gpa}</div></div>
          <div class="field"><div class="label">Test Score:</div><div class="value">${application.testScore}</div></div>
          <div class="field"><div class="label">Intended Major:</div><div class="value">${application.intendedMajor}</div></div>
        </div>
      </div>
      <div class="section">
        <h3>📝 Personal Statement</h3>
        <div class="value" style="white-space: pre-wrap; background: #f3f4f6; padding: 15px; border-radius: 4px;">
          ${application.personalStatement}
        </div>
      </div>
      <div class="section">
        <h3>📅 Submission Details</h3>
        <div class="field"><div class="label">Submitted:</div><div class="value">${new Date(application.createdAt).toLocaleString()}</div></div>
      </div>
    </div>
  </div>
</body></html>`
  };
};

// Send emails
export const sendApplicationEmail = async (application) => {
  const transporter = createTransporter();
  if (!transporter) throw new Error('Email service not configured');

  try {
    // Student confirmation email
    const studentEmail = generateStudentEmailTemplate(application);
    await transporter.sendMail({
      from: `"College Admissions" <${process.env.EMAIL_USER}>`,
      to: application.email,
      subject: studentEmail.subject,
      html: studentEmail.html,
    });

    // Admin notification email
    if (process.env.ADMIN_EMAIL) {
      const adminEmail = generateAdminEmailTemplate(application);
      await transporter.sendMail({
        from: `"College Application System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: adminEmail.subject,
        html: adminEmail.html,
      });
    }

    return { success: true, message: 'Emails sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};
