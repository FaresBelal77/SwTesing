const mongoose = require('mongoose');

// Track if connection is established for this test file
let isConnected = false;

// Setup test database connection - runs once per test file
beforeAll(async () => {
  // Use test database URL if provided, otherwise use the same MongoDB Atlas with test database
  const mongoUri = process.env.TEST_DB_URL || 
    process.env.DB_URL?.replace(/\/(\w+)(\?|$)/, '/restaurant_test$2') ||
    'mongodb+srv://testing:1234@restaurant.pumi6d7.mongodb.net/restaurant_test?appName=Restaurant';
  
  // Always close any existing connections to ensure clean state
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    // Wait for connection to fully close
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Connect to test database with increased timeout
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    connectTimeoutMS: 30000, // 30 seconds connection timeout
  });
  isConnected = true;
  console.log('Test database connected');
}, 60000); // 60 second timeout for the beforeAll hook

// Clean up after each test - ensures no data leaks between tests
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      const collections = mongoose.connection.collections;
      // Delete all documents from all collections
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    } catch (error) {
      console.error('Error cleaning up collections:', error);
    }
  }
}, 15000); // 15 second timeout for the afterEach hook

// Clean up after all tests in this file - runs once per test file
afterAll(async () => {
  if (isConnected && mongoose.connection.readyState !== 0) {
    try {
      // Clear all collections before closing
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
      // Close the connection for this test file
      await mongoose.connection.close();
      isConnected = false;
      console.log('Test database disconnected');
    } catch (error) {
      console.error('Error closing database connection:', error);
      // Force close if normal close fails
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
    }
  }
}, 30000); // 30 second timeout for the afterAll hook

