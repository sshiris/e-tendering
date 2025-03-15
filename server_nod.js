import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/user.js';
import Category from './models/category.js';
import Tender from './models/tender.js';
import Bid from './models/bid.js';

// Инициализация Express
const app = express();
const port = 5500;

// Middleware
app.use(cors()); // Разрешить кросс-доменные запросы
app.use(express.json()); // Парсить данные в формате JSON

// Подключение к MongoDB
const uri = "mongodb+srv://storeDataUser:g1MfHieubCImPSXV@cluster0.noqzo.mongodb.net/e-Tendering?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Failed to connect to MongoDB Atlas', err));

// API маршруты

// Создать пользователя
app.post('/create_user', async (req, res) => {
    try {
        const { name, email, address, user_type, password, categories } = req.body; // categories - массив ID категорий
        const user = new User({ name, email, address, user_type, password, categories });
        await user.save();
        res.json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Error creating user', details: err.message });
    }
});

// Получить всех пользователей
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('categories'); // Populate категориями
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users', details: err.message });
  }
});

// Создать категорию
app.post('/create_category', async (req, res) => {
  try {
    const { category_name } = req.body;
    
    // Проверка, существует ли категория
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = new Category({ category_name });
    await category.save();
    res.json({ message: 'Category created successfully', category });
  } catch (err) {
    res.status(500).json({ error: 'Error creating category', details: err.message });
  }
});

// Получить все категории
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories', details: err.message });
  }
});

// Создать тендер
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
    res.status(500).json({ error: 'Error creating tender', details: err.message });
  }
});

// Получить все тендеры
app.get('/tenders', async (req, res) => {
  try {
    const tenders = await Tender.find().populate('staff_id'); // Populate сотрудниками
    res.json(tenders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tenders', details: err.message });
  }
});

// Создать ставку
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
    res.status(500).json({ error: 'Error creating bid', details: err.message });
  }
});

// Получить все ставки
app.get('/bids', async (req, res) => {
  try {
    const bids = await Bid.find().populate('bidder_id').populate('tender_id'); // Populate ставками и тендерами
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bids', details: err.message });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
