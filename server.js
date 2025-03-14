import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/user.js';
import Category from './models/category.js';
import Tender from './models/tender.js';
import Bid from './models/bid.js';

// Initialize Express
const app = express();
const port = 5500;

// Middleware
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON data

// Connect to MongoDB
const uri = "mongodb+srv://storeDataUser:g1MfHieubCImPSXV@cluster0.noqzo.mongodb.net/e-Tendering?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Failed to connect to MongoDB Atlas', err));

// API routes

// Route to create a user
app.post('/create_user', async (req, res) => {
    try {
        const { name, email, categories } = req.body; // categories - array of category IDs
        const user = new User({ name, email, categories });
        await user.save();
        res.json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Error creating user', details: err });
    }
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('categories'); // Populate user categories
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users', details: err });
  }
});

// Route to create a category
app.post('/create_category', async (req, res) => {
  try {
    const { category_name } = req.body;
    const category = new Category({ category_name });
    await category.save();
    res.json({ message: 'Category created successfully', category });
  } catch (err) {
    res.status(500).json({ error: 'Error creating category', details: err });
  }
});

// Route to get all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories', details: err });
  }
});

// Route to create a tender
app.post('/create_tender', async (req, res) => {
  try {
    const { tender_name, staff_id, construction_from, construction_to, date_of_tender_notice, 
      date_of_tender_close, date_of_tender_winner, bidding_price, tender_status } = req.body;
    const tender = new Tender({
      tender_name, 
      staff_id, 
      construction_from, 
      construction_to, 
      date_of_tender_notice,
      date_of_tender_close, 
      date_of_tender_winner, 
      bidding_price, 
      tender_status
    });
    await tender.save();
    res.json({ message: 'Tender created successfully', tender });
  } catch (err) {
    res.status(500).json({ error: 'Error creating tender', details: err });
  }
});

// Route to get all tenders
app.get('/tenders', async (req, res) => {
  try {
    const tenders = await Tender.find().populate('staff_id');
    res.json(tenders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tenders', details: err });
  }
});

// Route to create a bid
app.post('/create_bid', async (req, res) => {
  try {
    const { bidder_id, tender_id, bidding_price, is_winner } = req.body;
    const bid = new Bid({
      bidder_id, 
      tender_id, 
      bidding_price, 
      is_winner
    });
    await bid.save();
    res.json({ message: 'Bid created successfully', bid });
  } catch (err) {
    res.status(500).json({ error: 'Error creating bid', details: err });
  }
});

// Route to get all bids
app.get('/bids', async (req, res) => {
  try {
    const bids = await Bid.find().populate('bidder_id').populate('tender_id');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bids', details: err });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});