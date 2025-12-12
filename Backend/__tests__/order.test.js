const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/UserSchema');
const Order = require('../models/OrderSchema');
const MenuItem = require('../models/MenuItemSchema');
const Reservation = require('../models/ReservationSchema');

/**
 * Test Case 5: Customer Food Orders
 * 
 * Traceability:
 * - Functional Requirement: FR4 - Customers can place food orders online before arrival or for dine-in
 * - User Story: Foundation for order management
 * 
 * Test Objective: Verify that customers can create orders, view their orders, and manage order items
 */
describe('POST /api/orders/create - Create Order', () => {
  let customerToken;
  let customerId;
  let menuItem1;
  let menuItem2;
  const secretKey = process.env.SECRET_KEY || "1234";

  beforeEach(async () => {
    // Create test customer
    const userData = {
      name: 'Order Customer',
      email: `order.customer${Date.now()}@example.com`,
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

    // Create test menu items
    menuItem1 = await MenuItem.create({
      name: 'Test Pizza',
      description: 'Test pizza description',
      price: 12.50,
      category: 'Main course',
      available: true
    });

    menuItem2 = await MenuItem.create({
      name: 'Test Salad',
      description: 'Test salad description',
      price: 8.99,
      category: 'Salads',
      available: true
    });

    // Wait for database sync
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  test('should create an order with valid data', async () => {
    const orderData = {
      items: [
        { menuItem: menuItem1._id.toString(), quantity: 2 },
        { menuItem: menuItem2._id.toString(), quantity: 1 }
      ],
      orderType: 'dine-in'
    };

    const response = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(orderData)
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Order created successfully.');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.items).toHaveLength(2);
    expect(response.body.data.orderType).toBe('dine-in');
    expect(response.body.data.status).toBe('pending');
    expect(response.body.data.totalPrice).toBeGreaterThan(0);
  });

  test('should create an order with reservation link', async () => {
    // Create a reservation first
    const reservation = await Reservation.create({
      customer: customerId,
      date: '2025-12-25',
      time: '19:30',
      numberOfGuests: 4,
      isActive: true
    });

    const orderData = {
      items: [
        { menuItem: menuItem1._id.toString(), quantity: 1 }
      ],
      orderType: 'dine-in',
      reservationId: reservation._id.toString()
    };

    const response = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(orderData)
      .expect(201);

    expect(response.body.data.reservation).toBeDefined();
  });

  test('should reject order with empty items array', async () => {
    const orderData = {
      items: [],
      orderType: 'dine-in'
    };

    const response = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(orderData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Order items cannot be empty.');
  });

  test('should reject order with invalid menu item', async () => {
    const orderData = {
      items: [
        { menuItem: new mongoose.Types.ObjectId().toString(), quantity: 1 }
      ],
      orderType: 'dine-in'
    };

    const response = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(orderData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('should reject order with invalid quantity', async () => {
    const orderData = {
      items: [
        { menuItem: menuItem1._id.toString(), quantity: 0 }
      ],
      orderType: 'dine-in'
    };

    const response = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(orderData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('should reject order without authentication', async () => {
    const orderData = {
      items: [
        { menuItem: menuItem1._id.toString(), quantity: 1 }
      ],
      orderType: 'dine-in'
    };

    const response = await request(app)
      .post('/api/orders/create')
      .send(orderData)
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });

  test('should reject order with non-existent reservation', async () => {
    const orderData = {
      items: [
        { menuItem: menuItem1._id.toString(), quantity: 1 }
      ],
      orderType: 'dine-in',
      reservationId: new mongoose.Types.ObjectId().toString()
    };

    const response = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(orderData)
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Reservation not found.');
  });
});

describe('GET /api/orders/user - View Own Orders', () => {
  let customerToken;
  let customerId;
  let menuItem1;
  const secretKey = process.env.SECRET_KEY || "1234";

  beforeEach(async () => {
    // Create test customer
    const userData = {
      name: 'View Orders Customer',
      email: `view.orders${Date.now()}@example.com`,
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

    // Create test menu item
    menuItem1 = await MenuItem.create({
      name: 'Test Item',
      price: 10.00,
      category: 'Main course',
      available: true
    });
  });

  test('should return empty array when customer has no orders', async () => {
    const response = await request(app)
      .get('/api/orders/user')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(0);
  });

  test('should return customer\'s own orders', async () => {
    // Create test orders
    await Order.create({
      customer: customerId,
      items: [{ menuItem: menuItem1._id, quantity: 1 }],
      totalPrice: 10.00,
      orderType: 'dine-in',
      status: 'pending'
    });

    await Order.create({
      customer: customerId,
      items: [{ menuItem: menuItem1._id, quantity: 2 }],
      totalPrice: 20.00,
      orderType: 'pre-order',
      status: 'completed'
    });

    // Wait for database sync
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await request(app)
      .get('/api/orders/user')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data.length).toBe(2);
    response.body.data.forEach(order => {
      expect(order.customer.toString()).toBe(customerId);
    });
  });

  test('should reject request without authentication', async () => {
    const response = await request(app)
      .get('/api/orders/user')
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });
});

describe('POST /api/orders/:id/items - Add Item to Order', () => {
  let customerToken;
  let customerId;
  let order;
  let menuItem1;
  let menuItem2;
  const secretKey = process.env.SECRET_KEY || "1234";

  beforeEach(async () => {
    // Create test customer
    const userData = {
      name: 'Modify Order Customer',
      email: `modify.order${Date.now()}@example.com`,
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

    // Create test menu items
    menuItem1 = await MenuItem.create({
      name: 'Item 1',
      price: 10.00,
      category: 'Main course',
      available: true
    });

    menuItem2 = await MenuItem.create({
      name: 'Item 2',
      price: 15.00,
      category: 'Main course',
      available: true
    });

    // Create test order
    order = await Order.create({
      customer: customerId,
      items: [{ menuItem: menuItem1._id, quantity: 1 }],
      totalPrice: 10.00,
      orderType: 'dine-in'
    });
  });

  test('should add new item to order', async () => {
    const response = await request(app)
      .post(`/api/orders/${order._id}/items`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        menuItemId: menuItem2._id.toString(),
        quantity: 2
      })
      .expect(200);

    expect(response.body.data.items).toHaveLength(2);
    expect(response.body.data.totalPrice).toBe(40.00); // 10 + (15 * 2)
  });

  test('should increase quantity of existing item', async () => {
    const response = await request(app)
      .post(`/api/orders/${order._id}/items`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        menuItemId: menuItem1._id.toString(),
        quantity: 1
      })
      .expect(200);

    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].quantity).toBe(2);
    expect(response.body.data.totalPrice).toBe(20.00);
  });

  test('should reject adding item without menuItemId', async () => {
    const response = await request(app)
      .post(`/api/orders/${order._id}/items`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        quantity: 1
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('menuItemId is required.');
  });

  test('should reject adding item with invalid quantity', async () => {
    const response = await request(app)
      .post(`/api/orders/${order._id}/items`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        menuItemId: menuItem2._id.toString(),
        quantity: 0
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });
});

describe('DELETE /api/orders/:id/items - Remove Item from Order', () => {
  let customerToken;
  let customerId;
  let order;
  let menuItem1;
  let menuItem2;
  const secretKey = process.env.SECRET_KEY || "1234";

  beforeEach(async () => {
    // Create test customer
    const userData = {
      name: 'Remove Item Customer',
      email: `remove.item${Date.now()}@example.com`,
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

    // Create test menu items
    menuItem1 = await MenuItem.create({
      name: 'Item 1',
      price: 10.00,
      category: 'Main course',
      available: true
    });

    menuItem2 = await MenuItem.create({
      name: 'Item 2',
      price: 15.00,
      category: 'Main course',
      available: true
    });

    // Create test order with multiple items
    order = await Order.create({
      customer: customerId,
      items: [
        { menuItem: menuItem1._id, quantity: 1 },
        { menuItem: menuItem2._id, quantity: 2 }
      ],
      totalPrice: 40.00,
      orderType: 'dine-in'
    });
  });

  test('should remove item from order', async () => {
    const response = await request(app)
      .delete(`/api/orders/${order._id}/items`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        menuItemId: menuItem2._id.toString()
      })
      .expect(200);

    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.totalPrice).toBe(10.00);
  });

  test('should reject removing non-existent item', async () => {
    const response = await request(app)
      .delete(`/api/orders/${order._id}/items`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        menuItemId: new mongoose.Types.ObjectId().toString()
      })
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Menu item does not exist in this order.');
  });
});

describe('DELETE /api/orders/:id - Delete Order', () => {
  let customerToken;
  let customerId;
  let order;
  let menuItem1;
  const secretKey = process.env.SECRET_KEY || "1234";

  beforeEach(async () => {
    // Create test customer
    const userData = {
      name: 'Delete Order Customer',
      email: `delete.order${Date.now()}@example.com`,
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

    // Create test menu item
    menuItem1 = await MenuItem.create({
      name: 'Test Item',
      price: 10.00,
      category: 'Main course',
      available: true
    });

    // Create test order
    order = await Order.create({
      customer: customerId,
      items: [{ menuItem: menuItem1._id, quantity: 1 }],
      totalPrice: 10.00,
      orderType: 'dine-in'
    });
  });

  test('should delete order successfully', async () => {
    const response = await request(app)
      .delete(`/api/orders/${order._id}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Order deleted successfully.');

    // Verify order is deleted
    const deletedOrder = await Order.findById(order._id);
    expect(deletedOrder).toBeNull();
  });

  test('should reject deleting non-existent order', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/orders/${fakeId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Order not found.');
  });
});

