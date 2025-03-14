import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import tenderRoutes from './routes/tenderRoutes.js'; // Правильный путь



// Инициализация приложения
const app = express();
const port = 5500;

// Middleware
app.use(cors()); // Разрешаем CORS
app.use(express.json()); // Разбираем JSON в запросах

// Подключение к MongoDB Atlas
const uri = "mongodb+srv://storeDataUser:g1MfHieubCImPSXV@cluster0.noqzo.mongodb.net/e-Tendering?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Определение схемы и модели для тендеров
const tenderSchema = new mongoose.Schema({
  tender_id: String,
  tender_name: String,
  construction_from: Date,
  construction_to: Date,
  date_of_tender_notice: Date,
  date_of_tender_close: Date,
  date_of_tender_winner: Date,
  bidding_price: Number,
  tender_status: String,
  staff_id: String
}, { collection: 'TENDER' });

const Tender = mongoose.model('Tender', tenderSchema);

// 📌 Вывод всех маршрутов для отладки
setTimeout(() => {
  console.log('\n📌 Список маршрутов:');
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(`🛠 ${r.route.path} [${Object.keys(r.route.methods).join(', ').toUpperCase()}]`);
    }
  });
  console.log('⚡ Сервер запущен на: http://localhost:' + port);
}, 2000);

// API Маршруты
app.post('/save_tender', async (req, res) => {
  try {
    const tender = new Tender(req.body);
    await tender.save();
    res.json({ message: '✅ Tender saved successfully' });
  } catch (err) {
    res.status(500).json({ error: '❌ Error saving tender', details: err });
  }
});

app.get('/find', async (req, res) => {
  try {
    const tenders = await Tender.find();
    res.json(tenders);
  } catch (err) {
    res.status(500).json({ error: '❌ Error fetching tenders', details: err });
  }
});

// Запуск сервера
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
