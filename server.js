import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { tenderRoutes } from './routes/tenderRoutes.js';


const app = express();
const port = 5500;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://storeDataUser:g1MfHieubCImPSXV@cluster0.noqzo.mongodb.net/e-Tendering?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB Atlas', err);
    process.exit(1);
  });

// Routes
app.use('/tenders', tenderRoutes); // Все эндпоинты теперь начинаются с /tenders

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
      console.log(`Маршрут: ${r.route.path}, Метод: ${Object.keys(r.route.methods)[0].toUpperCase()}`);
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
