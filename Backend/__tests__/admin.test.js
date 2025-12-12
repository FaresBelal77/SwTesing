const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/UserSchema');
const Reservation = require('../models/ReservationSchema');
const MenuItem = require('../models/MenuItemSchema');
const Order = require('../models/OrderSchema');

/**
 * Test Case 8: Admin Reservation Management
 * 
 * Traceability:
 * - Functional Requirement: FR6 - Admins can view, accept, or cancel reservations based on availability
 * - User Story: US4 - "As an admin, I want to manage reservations so that I can optimize table usage"
 * 
 * Test Objective: Verify that admins can view all reservations and update their status
 */
describe('GET /api/reservations/reservations - Admin View All Reservations', () => {
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

    // Create test reservations
    await Reservation.create({
      customer: customer1Id,
      date: '2025-12-25',
      time: '19:30',
      numberOfGuests: 4,
      status: 'pending',
      isActive: true
    });

    await Reservation.create({
      customer: customer2Id,
      date: '2025-12-26',
      time: '20:00',
      numberOfGuests: 2,
      status: 'confirmed',
      isActive: true
    });

    // Wait for database sync
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  test('should return all reservations for admin', async () => {
    const response = await request(app)
      .get('/api/reservations/reservations')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('reservations');
    expect(Array.isArray(response.body.reservations)).toBe(true);
    expect(response.body.reservations.length).toBeGreaterThanOrEqual(2);
    response.body.reservations.forEach(reservation => {
      expect(reservation).toHaveProperty('customer');
      expect(reservation.customer).toHaveProperty('name');
      expect(reservation.customer).toHaveProperty('email');
    });
  });

  test('should filter reservations by status', async () => {
    const response = await request(app)
      .get('/api/reservations/reservations?status=pending')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.reservations.length).toBeGreaterThanOrEqual(1);
    response.body.reservations.forEach(reservation => {
      expect(reservation.status).toBe('pending');
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
      .get('/api/reservations/reservations')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);

    expect(response.body).toHaveProperty('message');
  });

  test('should reject request without authentication', async () => {
    const response = await request(app)
      .get('/api/reservations/reservations')
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });
});

describe('PATCH /api/reservations/reservations/:id - Admin Update Reservation Status', () => {
  let adminToken;
  let adminId;
  let customerId;
  let reservation;
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

    // Create test customer
    const customer = await User.create({
      name: 'Test Customer',
      email: `test.customer${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'customer'
    });
    customerId = customer._id.toString();

    // Create test reservation
    reservation = await Reservation.create({
      customer: customerId,
      date: '2025-12-25',
      time: '19:30',
      numberOfGuests: 4,
      status: 'pending',
      isActive: true
    });
  });

  test('should update reservation status to confirmed', async () => {
    const response = await request(app)
      .patch(`/api/reservations/reservations/${reservation._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' })
      .expect(200);

    expect(response.body).toHaveProperty('reservation');
    expect(response.body.reservation.status).toBe('confirmed');
    expect(response.body.reservation.isActive).toBe(true);
  });

  test('should update reservation status to cancelled', async () => {
    const response = await request(app)
      .patch(`/api/reservations/reservations/${reservation._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'cancelled' })
      .expect(200);

    expect(response.body.reservation.status).toBe('cancelled');
    expect(response.body.reservation.isActive).toBe(false);
  });

  test('should reject invalid status', async () => {
    const response = await request(app)
      .patch(`/api/reservations/reservations/${reservation._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'invalid-status' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('should reject update for non-existent reservation', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .patch(`/api/reservations/reservations/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' })
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Reservation not found');
  });

  test('should reject request from non-admin user', async () => {
    // Create customer token
    const customerPayload = {
      id: customerId,
      role: 'customer',
      name: 'Test Customer',
      email: 'test@example.com'
    };
    const customerToken = jwt.sign(customerPayload, secretKey, { expiresIn: "1h" });

    const response = await request(app)
      .patch(`/api/reservations/reservations/${reservation._id}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'confirmed' })
      .expect(403);

    expect(response.body).toHaveProperty('message');
  });
});

/**
 * Test Case 9: Admin Menu Management
 * 
 * Traceability:
 * - Functional Requirement: FR7 - Admins can add, edit, or remove menu items as needed
 * - User Story: US5 - "As an admin, I want to update the menu so that changes are reflected in real-time"
 * 
 * Test Objective: Verify that admins can add, edit, and delete menu items
 */
describe('POST /api/menu/add - Admin Add Menu Item', () => {
  let adminToken;
  let adminId;
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
  });

  test('should add menu item with valid data', async () => {
    const menuItemData = {
      name: 'New Pizza',
      description: 'Delicious new pizza',
      price: 15.99,
      category: 'Main course',
      available: true
    };

    const response = await request(app)
      .post('/api/menu/add')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(menuItemData)
      .expect(201);

    expect(response.body).toHaveProperty('name', 'New Pizza');
    expect(response.body).toHaveProperty('price', 15.99);
    expect(response.body).toHaveProperty('category', 'Main course');
    expect(response.body).toHaveProperty('available', true);
  });

  test('should reject menu item with missing required fields', async () => {
    const menuItemData = {
      description: 'Missing name and price'
    };

    const response = await request(app)
      .post('/api/menu/add')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(menuItemData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('name, price and category are required');
  });

  test('should reject duplicate menu item name', async () => {
    // Create first menu item
    await MenuItem.create({
      name: 'Duplicate Pizza',
      price: 12.50,
      category: 'Main course',
      available: true
    });

    // Try to create duplicate
    const menuItemData = {
      name: 'Duplicate Pizza',
      price: 15.99,
      category: 'Main course',
      available: true
    };

    const response = await request(app)
      .post('/api/menu/add')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(menuItemData)
      .expect(409);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Menu item with this name already exists');
  });

  test('should reject request from non-admin user', async () => {
    // Create customer
    const customer = await User.create({
      name: 'Customer',
      email: `customer${Date.now()}@example.com`,
      password: await bcrypt.hash('Pass123!', 10),
      role: 'customer'
    });

    const customerPayload = {
      id: customer._id.toString(),
      role: 'customer',
      name: customer.name,
      email: customer.email
    };
    const customerToken = jwt.sign(customerPayload, secretKey, { expiresIn: "1h" });

    const menuItemData = {
      name: 'Test Item',
      price: 10.00,
      category: 'Main course'
    };

    const response = await request(app)
      .post('/api/menu/add')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(menuItemData)
      .expect(403);

    expect(response.body).toHaveProperty('message');
  });
});

describe('PUT /api/menu/edit/:id - Admin Edit Menu Item', () => {
  let adminToken;
  let adminId;
  let menuItem;
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

    // Create test menu item
    menuItem = await MenuItem.create({
      name: 'Original Pizza',
      description: 'Original description',
      price: 12.50,
      category: 'Main course',
      available: true
    });
  });

  test('should update menu item price', async () => {
    const response = await request(app)
      .put(`/api/menu/edit/${menuItem._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 15.99 })
      .expect(200);

    expect(response.body).toHaveProperty('price', 15.99);
    expect(response.body).toHaveProperty('name', 'Original Pizza'); // Name unchanged
  });

  test('should update menu item availability', async () => {
    const response = await request(app)
      .put(`/api/menu/edit/${menuItem._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ available: false })
      .expect(200);

    expect(response.body).toHaveProperty('available', false);
  });

  test('should update multiple fields', async () => {
    const response = await request(app)
      .put(`/api/menu/edit/${menuItem._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Pizza',
        price: 18.99,
        description: 'Updated description',
        available: false
      })
      .expect(200);

    expect(response.body).toHaveProperty('name', 'Updated Pizza');
    expect(response.body).toHaveProperty('price', 18.99);
    expect(response.body).toHaveProperty('description', 'Updated description');
    expect(response.body).toHaveProperty('available', false);
  });

  test('should reject update for non-existent menu item', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/menu/edit/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 15.99 })
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Menu item not found');
  });

  test('should reject invalid price type', async () => {
    const response = await request(app)
      .put(`/api/menu/edit/${menuItem._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 'invalid' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Invalid price');
  });
});

describe('DELETE /api/menu/delete/:id - Admin Delete Menu Item', () => {
  let adminToken;
  let adminId;
  let menuItem;
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

    // Create test menu item
    menuItem = await MenuItem.create({
      name: 'Item to Delete',
      price: 10.00,
      category: 'Main course',
      available: true
    });
  });

  test('should delete menu item successfully', async () => {
    const response = await request(app)
      .delete(`/api/menu/delete/${menuItem._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('id');

    // Verify item is deleted
    const deletedItem = await MenuItem.findById(menuItem._id);
    expect(deletedItem).toBeNull();
  });

  test('should reject delete for non-existent menu item', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/menu/delete/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Menu item not found');
  });

  test('should reject delete request from non-admin user', async () => {
    // Create customer
    const customer = await User.create({
      name: 'Customer',
      email: `customer${Date.now()}@example.com`,
      password: await bcrypt.hash('Pass123!', 10),
      role: 'customer'
    });

    const customerPayload = {
      id: customer._id.toString(),
      role: 'customer',
      name: customer.name,
      email: customer.email
    };
    const customerToken = jwt.sign(customerPayload, secretKey, { expiresIn: "1h" });

    const response = await request(app)
      .delete(`/api/menu/delete/${menuItem._id}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);

    expect(response.body).toHaveProperty('message');
  });
});

/**
 * Test Case 10: Admin Order Management
 * 
 * Traceability:
 * - Functional Requirement: FR4 (Admin aspect) - Admins can view and manage all orders
 * 
 * Test Objective: Verify that admins can view all orders and update order status
 */
describe('GET /api/orders/all - Admin View All Orders', () => {
  let adminToken;
  let adminId;
  let customerId;
  let menuItem;
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

    // Create test customer
    const customer = await User.create({
      name: 'Test Customer',
      email: `customer${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'customer'
    });
    customerId = customer._id.toString();

    // Create test menu item
    menuItem = await MenuItem.create({
      name: 'Test Item',
      price: 10.00,
      category: 'Main course',
      available: true
    });

    // Create test orders
    await Order.create({
      customer: customerId,
      items: [{ menuItem: menuItem._id, quantity: 1 }],
      totalPrice: 10.00,
      orderType: 'dine-in',
      status: 'pending'
    });

    await Order.create({
      customer: customerId,
      items: [{ menuItem: menuItem._id, quantity: 2 }],
      totalPrice: 20.00,
      orderType: 'pre-order',
      status: 'completed'
    });

    // Wait for database sync
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  test('should return all orders for admin', async () => {
    const response = await request(app)
      .get('/api/orders/all')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    response.body.data.forEach(order => {
      expect(order).toHaveProperty('customer');
      expect(order.customer).toHaveProperty('name');
      expect(order.customer).toHaveProperty('email');
    });
  });

  test('should filter orders by status', async () => {
    const response = await request(app)
      .get('/api/orders/all?status=pending')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    response.body.data.forEach(order => {
      expect(order.status).toBe('pending');
    });
  });

  test('should filter orders by orderType', async () => {
    const response = await request(app)
      .get('/api/orders/all?orderType=pre-order')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    response.body.data.forEach(order => {
      expect(order.orderType).toBe('pre-order');
    });
  });

  test('should reject request from non-admin user', async () => {
    // Create customer token
    const customerPayload = {
      id: customerId,
      role: 'customer',
      name: 'Test Customer',
      email: 'customer@example.com'
    };
    const customerToken = jwt.sign(customerPayload, secretKey, { expiresIn: "1h" });

    const response = await request(app)
      .get('/api/orders/all')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(403);

    expect(response.body).toHaveProperty('message');
  });
});

describe('PATCH /api/orders/update/:id - Admin Update Order Status', () => {
  let adminToken;
  let adminId;
  let customerId;
  let order;
  let menuItem;
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

    // Create test customer
    const customer = await User.create({
      name: 'Test Customer',
      email: `customer${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'customer'
    });
    customerId = customer._id.toString();

    // Create test menu item
    menuItem = await MenuItem.create({
      name: 'Test Item',
      price: 10.00,
      category: 'Main course',
      available: true
    });

    // Create test order
    order = await Order.create({
      customer: customerId,
      items: [{ menuItem: menuItem._id, quantity: 1 }],
      totalPrice: 10.00,
      orderType: 'dine-in',
      status: 'pending'
    });
  });

  test('should update order status to preparing', async () => {
    const response = await request(app)
      .patch(`/api/orders/update/${order._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'preparing' })
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data.status).toBe('preparing');
  });

  test('should update order status to completed', async () => {
    const response = await request(app)
      .patch(`/api/orders/update/${order._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'completed' })
      .expect(200);

    expect(response.body.data.status).toBe('completed');
  });

  test('should update order status to cancelled', async () => {
    const response = await request(app)
      .patch(`/api/orders/update/${order._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'cancelled' })
      .expect(200);

    expect(response.body.data.status).toBe('cancelled');
  });

  test('should reject invalid status', async () => {
    const response = await request(app)
      .patch(`/api/orders/update/${order._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'invalid-status' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Status must be one of');
  });

  test('should reject update for non-existent order', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .patch(`/api/orders/update/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'completed' })
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Order not found.');
  });

  test('should reject request from non-admin user', async () => {
    // Create customer token
    const customerPayload = {
      id: customerId,
      role: 'customer',
      name: 'Test Customer',
      email: 'customer@example.com'
    };
    const customerToken = jwt.sign(customerPayload, secretKey, { expiresIn: "1h" });

    const response = await request(app)
      .patch(`/api/orders/update/${order._id}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'completed' })
      .expect(403);

    expect(response.body).toHaveProperty('message');
  });
});
