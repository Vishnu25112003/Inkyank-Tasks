# College Application Form - MERN Stack with Email Notifications

A beautiful, production-ready college application form built with the MERN stack (MongoDB, Express.js, React, Node.js) and Vite, featuring automatic email notifications.

## Features

- ✨ Beautiful, responsive UI with Tailwind CSS
- 📝 Comprehensive 15-field application form
- ✅ Real-time form validation (frontend & backend)
- 🔒 Secure data handling with MongoDB
- 📧 **Automatic email notifications** to applicants and admins
- 🚀 Fast development with Vite
- 📱 Mobile-first responsive design
- 🎨 Professional animations and transitions
- 💌 Beautiful HTML email templates

## Email Features

- **Student Confirmation Email**: Beautifully formatted confirmation email with application details
- **Admin Notification Email**: Detailed application summary for admissions staff
- **Professional Templates**: HTML email templates with responsive design
- **Application ID**: Unique tracking ID included in emails
- **Error Handling**: Graceful fallback if email service is unavailable

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Gmail account (for email notifications)
- npm or yarn

### Installation

1. **Clone and setup the project:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Configure email settings in `.env`:**
   ```env
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@college.edu
   ```

   **Gmail Setup Instructions:**
   - Enable 2-Factor Authentication on your Gmail account
   - Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Use the App Password (not your regular password) in `EMAIL_PASS`
   - Replace `EMAIL_USER` with your Gmail address
   - Replace `ADMIN_EMAIL` with the admin email to receive notifications

4. **Set up MongoDB connection in `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/college_applications
   ```

5. **Start MongoDB:**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update the `MONGODB_URI` in `.env`

6. **Start the backend server:**
   ```bash
   npm run server:dev
   ```

7. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Email Templates

### Student Confirmation Email
- Professional welcome message
- Complete application summary
- Application ID for tracking
- Next steps information
- Contact details

### Admin Notification Email
- New application alert
- Complete applicant information
- Personal statement included
- Submission timestamp
- Easy-to-read formatting

## Application Fields

The form includes 15 comprehensive fields:

### Personal Information
1. First Name
2. Last Name
3. Email Address
4. Phone Number
5. Date of Birth

### Address Information
6. Street Address
7. City
8. State/Province
9. Postal Code
10. Country

### Academic Information
11. High School Name
12. GPA (0.0 - 4.0)
13. SAT/ACT Score (400-1600)
14. Intended Major
15. Personal Statement (50-2000 characters)

## API Endpoints

- `POST /api/applications` - Submit a new application (triggers email notifications)
- `GET /api/applications` - Get all applications (admin)
- `GET /api/applications/:id` - Get specific application
- `GET /api/health` - Health check

## Technology Stack

### Frontend
- **React 18** with JSX
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Joi** for validation
- **Nodemailer** for email notifications
- **CORS** for cross-origin requests

### Email Service
- **Nodemailer** with Gmail SMTP
- **HTML email templates** with inline CSS
- **Responsive email design**
- **Error handling and fallbacks**

## Production Deployment

### Frontend
```bash
npm run build
```

### Backend
```bash
npm run server
```

### Email Configuration for Production
- Use environment variables for email credentials
- Consider using dedicated email services (SendGrid, Mailgun, etc.)
- Set up proper DNS records for email deliverability
- Configure rate limiting for email sending

## Validation Rules

- Email addresses must be unique
- Age must be between 16-25 years
- GPA must be between 0.0-4.0
- Test scores must be between 400-1600
- Personal statement: 50-2000 characters
- All fields are required and properly validated

## Email Troubleshooting

### Common Issues:
1. **"Invalid login"**: Use App Password, not regular Gmail password
2. **"Less secure app access"**: Enable 2FA and use App Password
3. **Emails not sending**: Check EMAIL_USER and EMAIL_PASS in .env
4. **Admin not receiving emails**: Verify ADMIN_EMAIL is set correctly

### Testing Email:
- Check server logs for email sending status
- Verify email credentials are correct
- Test with a simple email first
- Check spam/junk folders

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including email functionality)
5. Submit a pull request

## License

This project is licensed under the MIT License.