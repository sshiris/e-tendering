import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

// Initialize the app and define the port
const app = express();
const port = 5500;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// MongoDB connection string (ensure you replace with your correct credentials)
const uri = "mongodb+srv://storeDataUser:g1MfHieubCImPSXV@cluster0.noqzo.mongodb.net/e-Tendering?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Failed to connect to MongoDB Atlas', err));

// Define the Tender Schema and Model
const tenderSchema = new mongoose.Schema({
  tender_id: { type: String, required: true, unique: true },
  tender_name: String,
  construction_from: Date,
  construction_to: Date,
  date_of_tender_notice: Date,
  date_of_tender_close: Date,
  date_of_tender_winner: Date,
  bidding_price: Number,
  tender_status: String,
  staff_id: String
}, { collection: 'TENDER' }); // Specify the collection name

const Tender = mongoose.model('Tender', tenderSchema);

// Endpoint to save tender
app.post('/save_tender', (req, res) => {
  const tender = new Tender(req.body); // Create new tender from the request body
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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
