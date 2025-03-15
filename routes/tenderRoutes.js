import express from 'express';
import Tender from '../models/Tender.js'; // Adjust the path as needed

const router = express.Router();

// Route to save a new tender
router.post('/save_tender', async (req, res) => {
  try {
    const tender = new Tender(req.body);
    await tender.save();
    res.json({ message: '✅ Tender saved successfully' });
  } catch (err) {
    res.status(500).json({ error: '❌ Error saving tender', details: err });
  }
});

// Route to fetch all tenders
router.get('/find', async (req, res) => {
  try {
    const tenders = await Tender.find();
    res.json(tenders);
  } catch (err) {
    res.status(500).json({ error: '❌ Error fetching tenders', details: err });
  }
});

export default router;