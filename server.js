import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import User from './models/user.js';
import Category from './models/category.js';
import Tender from './models/tender.js';
import Bid from './models/bid.js';

// Initialize the app and define the port
const app = express();
const port = 5500;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// MongoDB connection string (ensure you replace with your correct credentials)
const uri = "mongodb+srv://storeDataUser:g1MfHieubCImPSXV@cluster0.noqzo.mongodb.net/e-Tendering?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    // Optionally log stack trace for detailed debugging:
    console.error(err.stack);
    // Decide whether to terminate the process or continue for further debugging
    // process.exit(1); Uncomment if you want the server to stop in production
  });

// Error logging middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Endpoint to save tender
app.post('/save_tender', (req, res) => {
  const tender = new Tender({ ...req.body, tender_id: 'TND-' + Date.now() }); // Generate new tender ID
  tender.save() // Save the tender document to the database
    .then(() => res.json({ message: 'Tender saved successfully' })) // Success response
    .catch((err) => {
      console.error('Error saving tender:', err); // Log the error
      res.status(500).json({ error: 'Error saving tender', details: err });
    }); // Error response
});

// Endpoint to find tenders
app.get('/find', (req, res) => {
  Tender.find() // Find all tenders in the TENDER collection
    .then(tenders => res.json(tenders)) // Return tenders as JSON
    .catch((err) => {
      console.error('Error fetching tenders:', err); // Log the error
      res.status(500).json({ error: 'Error fetching tenders', details: err });
    }); // Error response
});

// Endpoint to create user
app.post('/create_user', async (req, res) => {
  try {
    const { name, address, user_type, password, email, categories } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const user_id = 'USR-' + Date.now(); // Generate a new unique ID for each user
    const user = new User({ user_id, name, address, user_type, password, email, categories });
    await user.save();
    res.json({ message: 'User created successfully', user });
  } catch (err) {
    console.error('Error creating user:', err); // Log the error
    res.status(500).json({ error: 'Error creating user', details: err.message });
  }
});

// Endpoint to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('categories');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err); // Log the error
    res.status(500).json({ error: 'Error fetching users', details: err.message });
  }
});

// Endpoint to get distinct user types
app.get('/user_types', async (req, res) => {
  try {
    const userTypes = await User.distinct('user_type');
    res.json(userTypes);
  } catch (err) {
    console.error('Error fetching user types:', err); // Log the error
    res.status(500).json({ error: 'Error fetching user types', details: err.message });
  }
});

// Endpoint to delete user
app.delete('/delete_user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    await User.findOneAndDelete({ user_id });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err); // Log the error
    res.status(500).json({ error: 'Error deleting user', details: err.message });
  }
});

// Endpoint to delete tender
app.delete('/delete_tender/:tender_id', async (req, res) => {
  try {
    const { tender_id } = req.params;
    await Tender.findOneAndDelete({ tender_id });
    res.json({ message: 'Tender deleted successfully' });
  } catch (err) {
    console.error('Error deleting tender:', err); // Log the error
    res.status(500).json({ error: 'Error deleting tender', details: err.message });
  }
});

// Endpoint to delete bid
app.delete('/delete_bid/:bid_id', async (req, res) => {
  try {
    const { bid_id } = req.params;
    await Bid.findOneAndDelete({ bid_id });
    res.json({ message: 'Bid deleted successfully' });
  } catch (err) {
    console.error('Error deleting bid:', err); // Log the error
    res.status(500).json({ error: 'Error deleting bid', details: err.message });
  }
});

// Endpoint to create bid
app.post('/create_bid', async (req, res) => {
  try {
    const { amount, user_id, tender_id } = req.body;
    const user = await User.findOne({ user_id });
    const tender = await Tender.findOne({ tender_id });
    if (!user || !tender) {
      return res.status(400).json({ error: 'Invalid user or tender ID' });
    }
    const bid_id = 'BID-' + Date.now(); // Generate a new unique ID for each bid
    const bid = new Bid({ 
      bid_id, 
      amount, 
      user: user._id, // Use ObjectId
      tender: tender._id // Use ObjectId
    });
    await bid.save();
    res.json({ message: 'Bid created successfully', bid });
  } catch (err) {
    console.error('Error creating bid:', err); // Log the error
    res.status(500).json({ error: 'Error creating bid', details: err.message });
  }
});

// Endpoint to get all bids
app.get('/bids', async (req, res) => {
  try {
    const bids = await Bid.find().populate('user').populate('tender');
    res.json(bids);
  } catch (err) {
    console.error('Error fetching bids:', err); // Log the error
    res.status(500).json({ error: 'Error fetching bids', details: err.message });
  }
});

// Endpoint to check connection to collections
app.get('/check_connection', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    res.json({ message: 'Connection successful', userCount, categoryCount });
  } catch (err) {
    console.error('Error checking connection:', err); // Log the error
    res.status(500).json({ error: 'Error checking connection', details: err.message });
  }
});

// Endpoint to create collections
app.get('/create_collections', async (req, res) => {
  try {
    await User.createCollection();
    await Category.createCollection();
    await Tender.createCollection();
    await Bid.createCollection();
    res.json({ message: 'Collections created successfully' });
  } catch (err) {
    console.error('Error creating collections:', err); // Log the error
    res.status(500).json({ error: 'Error creating collections', details: err.message });
  }
});

// Endpoint to create a new category
app.post('/create_category', async (req, res) => {
  try {
    const { category_id, category_name } = req.body;
    const category = new Category({ category_id, category_name });
    await category.save();
    res.json({ message: 'Category created successfully', category });
  } catch (err) {
    console.error('Error creating category:', err); // Log the error
    res.status(500).json({ error: 'Error creating category', details: err.message });
  }
});

// Endpoint to get all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().populate('users');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err); // Log the error
    res.status(500).json({ error: 'Error fetching categories', details: err.message });
  }
});

// Endpoint to add a user to a category
app.post('/add_user_to_category', async (req, res) => {
  try {
    const { user_id, category_id } = req.body;
    if (!user_id || !category_id) {
      return res.status(400).json({ error: 'User ID and Category ID are required' });
    }
    const user = await User.findOne({ user_id });
    const category = await Category.findOne({ category_id });
    if (!user || !category) {
      return res.status(400).json({ error: 'Invalid user or category ID' });
    }
    user.categories.push(category._id);
    category.users.push(user._id);
    await user.save();
    await category.save();
    res.json({ message: 'User added to category successfully' });
  } catch (err) {
    console.error('Error adding user to category:', err); // Log the error
    res.status(500).json({ error: 'Error adding user to category', details: err.message });
  }
});

// Endpoint to remove a user from a category
app.post('/remove_user_from_category', async (req, res) => {
  try {
    const { user_id, category_id } = req.body;
    if (!user_id || !category_id) {
      return res.status(400).json({ error: 'User ID and Category ID are required' });
    }
    const user = await User.findOne({ user_id });
    const category = await Category.findOne({ category_id });
    if (!user || !category) {
      return res.status(400).json({ error: 'Invalid user or category ID' });
    }
    user.categories.pull(category._id);
    category.users.pull(user._id);
    await user.save();
    await category.save();
    res.json({ message: 'User removed from category successfully' });
  } catch (err) {
    console.error('Error removing user from category:', err); // Log the error
    res.status(500).json({ error: 'Error removing user from category', details: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
