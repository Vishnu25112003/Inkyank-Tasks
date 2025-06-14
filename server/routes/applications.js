import express from 'express';
import Joi from 'joi';
import { Application } from '../models/Application.js';
import { sendApplicationEmail } from '../services/emailService.js';

const router = express.Router();

// Validation schema
const applicationSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/).required(),
  dateOfBirth: Joi.date().min('1999-01-01').max('2008-12-31').required(),
  address: Joi.string().trim().max(200).required(),
  city: Joi.string().trim().max(50).required(),
  state: Joi.string().trim().max(50).required(),
  postalCode: Joi.string().pattern(/^[\w\s\-]{3,10}$/).required(),
  country: Joi.string().trim().max(50).required(),
  highSchoolName: Joi.string().trim().max(100).required(),
  gpa: Joi.number().min(0.0).max(4.0).required(),
  testScore: Joi.number().min(400).max(1600).required(),
  intendedMajor: Joi.string().trim().max(100).required(),
  personalStatement: Joi.string().trim().min(50).max(2000).required()
});

// POST: Submit application
router.post('/', async (req, res) => {
  try {
    const { error, value } = applicationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }

    const existingApplication = await Application.findOne({ email: value.email });
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'An application with this email already exists'
      });
    }

    const application = new Application(value);
    await application.save();

    try {
      await sendApplicationEmail(application);
      console.log(`📧 Email sent to ${application.email}`);
    } catch (emailError) {
      console.error('📧 Email sending failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        id: application._id,
        email: application.email,
        submittedAt: application.createdAt
      }
    });
  } catch (error) {
    console.error('Application error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export { router as applicationRoutes };
