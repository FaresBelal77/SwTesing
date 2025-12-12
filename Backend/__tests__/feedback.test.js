const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/UserSchema');
const Feedback = require('../models/FeedbackSchema');

/**
 * Test Case 6: Customer Feedback Submission
 * 
 * Traceability:
 * - Functional Requirement: FR5 - Customers can submit feedback and ratings after their visit
 * - User Story: US3 - "As a customer, I want to submit feedback so that the restaurant can improve its service"
 * 
 * Test Objective: Verify that customers can submit feedback with ratings and comments
 */
describe('POST /api/feedback - Submit Feedback', () => {
  let customerToken;
  let customerId;
  const secretKey = process.env.SECRET_KEY || "1234";

  beforeEach(async () => {
    // Create test customer
    const userData = {
      name: 'Feedback Customer',
      email: `feedback.customer${Date.now()}@example.com`,
      password: 'TestPass123!'
    };
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const customer = await User.create({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: 'customer'
    });
    customerId = customer._id.toString();

    // Create JWT token
    const payload = {
      id: customerId,
      role: 'customer',
      name: customer.name,
      email: customer.email
    };
    customerToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  });

  test('should submit feedback with valid rating and comment', async () => {
    const feedbackData = {
      rating: 5,
      comment: 'Excellent service and food quality!'
    };

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(feedbackData)
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Feedback submitted successfully.');
    expect(response.body).toHaveProperty('feedback');
    expect(response.body.feedback.rating).toBe(5);
    expect(response.body.feedback.comment).toBe('Excellent service and food quality!');
    expect(response.body.feedback.customer.toString()).toBe(customerId);
  });

  test('should submit feedback with rating only (no comment)', async () => {
    const feedbackData = {
      rating: 4
    };

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(feedbackData)
      .expect(201);

    expect(response.body.feedback.rating).toBe(4);
    expect(response.body.feedback.comment).toBeUndefined();
  });

  test('should reject feedback with rating less than 1', async () => {
    const feedbackData = {
      rating: 0,
      comment: 'Test comment'
    };

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(feedbackData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Rating must be between 1 and 5.');
  });

  test('should reject feedback with rating greater than 5', async () => {
    const feedbackData = {
      rating: 6,
      comment: 'Test comment'
    };

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(feedbackData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Rating must be between 1 and 5.');
  });

  test('should reject feedback with non-numeric rating', async () => {
    const feedbackData = {
      rating: 'five',
      comment: 'Test comment'
    };

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(feedbackData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Rating must be a number between 1 and 5.');
  });

  test('should reject feedback without rating', async () => {
    const feedbackData = {
      comment: 'Test comment without rating'
    };

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(feedbackData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('should reject feedback without authentication', async () => {
    const feedbackData = {
      rating: 5,
      comment: 'Test comment'
    };

    const response = await request(app)
      .post('/api/feedback')
      .send(feedbackData)
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });

  test('should accept all valid ratings (1-5)', async () => {
    for (let rating = 1; rating <= 5; rating++) {
      const feedbackData = {
        rating: rating,
        comment: `Test comment for rating ${rating}`
      };

      const response = await request(app)
        .post('/api/feedback')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(feedbackData)
        .expect(201);

      expect(response.body.feedback.rating).toBe(rating);
    }
  });
});

describe('GET /api/feedback/:feedbackId - View Single Feedback', () => {
  let customerToken;
  let customerId;
  let feedback;
  const secretKey = process.env.SECRET_KEY || "1234";

  beforeEach(async () => {
    // Create test customer
    const userData = {
      name: 'View Feedback Customer',
      email: `view.feedback${Date.now()}@example.com`,
      password: 'TestPass123!'
    };
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const customer = await User.create({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: 'customer'
    });
    customerId = customer._id.toString();

    // Create JWT token
    const payload = {
      id: customerId,
      role: 'customer',
      name: customer.name,
      email: customer.email
    };
    customerToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    // Create test feedback
    feedback = await Feedback.create({
      customer: customerId,
      rating: 5,
      comment: 'Great experience!'
    });
  });

  test('should return feedback with customer details', async () => {
    const response = await request(app)
      .get(`/api/feedback/${feedback._id.toString()}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('feedback');
    expect(response.body.feedback.rating).toBe(5);
    expect(response.body.feedback.comment).toBe('Great experience!');
    expect(response.body.feedback.customer).toHaveProperty('name');
    expect(response.body.feedback.customer).toHaveProperty('email');
  });

  test('should reject request for non-existent feedback', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/feedback/${fakeId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Feedback not found.');
  });
});

/**
 * Test Case 7: Admin Feedback Management
 * 
 * Traceability:
 * - Functional Requirement: FR8 - Admins can view and manage customer feedback to improve service
 * - User Story: US6 - "As an admin, I want to view customer feedback so that I can improve overall service quality"
 * 
 * Test Objective: Verify that admins can view all customer feedback
 */
describe('GET /api/feedback - View All Feedbacks (Admin)', () => {
  let adminToken;
  let adminId;
  let customer1Id;
  let customer2Id;
  const secretKey = process.env.SECRET_KEY || "1234";

  beforeEach(async () => {
    // Create admin user
    const adminData = {
      name: 'Admin User',
      email: `admin${Date.now()}@example.com`,
      password: 'AdminPass123!'
    };
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email.toLowerCase(),
      password: hashedPassword,
      role: 'admin'
    });
    adminId = admin._id.toString();

    // Create JWT token for admin
    const payload = {
      id: adminId,
      role: 'admin',
      name: admin.name,
      email: admin.email
    };
    adminToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    // Create test customers
    const customer1 = await User.create({
      name: 'Customer 1',
      email: `customer1${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'customer'
    });
    customer1Id = customer1._id.toString();

    const customer2 = await User.create({
      name: 'Customer 2',
      email: `customer2${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'customer'
    });
    customer2Id = customer2._id.toString();

    // Create test feedback
    await Feedback.create({
      customer: customer1Id,
      rating: 5,
      comment: 'Excellent!'
    });

    await Feedback.create({
      customer: customer2Id,
      rating: 3,
      comment: 'Average experience'
    });

    // Wait for database sync
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  test('should return all feedbacks for admin', async () => {
    const response = await request(app)
      .get('/api/feedback')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('feedback');
    expect(Array.isArray(response.body.feedback)).toBe(true);
    expect(response.body.feedback.length).toBeGreaterThanOrEqual(2);
    response.body.feedback.forEach(fb => {
      expect(fb).toHaveProperty('rating');
      expect(fb).toHaveProperty('customer');
      expect(fb.customer).toHaveProperty('name');
      expect(fb.customer).toHaveProperty('email');
    });
  });

  test('should reject request from non-admin user', async () => {
    // Create customer token
    const customerPayload = {
      id: customer1Id,
      role: 'customer',
      name: 'Customer 1',
      email: 'customer1@example.com'
    };
    const customerToken = jwt.sign(customerPayload, secretKey, { expiresIn: "1h" });

    const response = await request(app)
      .get('/api/feedback')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);

    expect(response.body).toHaveProperty('message');
  });

  test('should reject request without authentication', async () => {
    const response = await request(app)
      .get('/api/feedback')
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });
});

