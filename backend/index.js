const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const twilio = require('twilio');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/train_pulse';
console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.warn('\n==================================================================');
    console.warn('WARNING: Could not connect to MongoDB.');
    console.warn('The server will continue running using a mock in-memory database.');
    console.warn('Reason:', err.message);
    console.warn('==================================================================\n');
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Twilio SMS API endpoint
app.post('/api/send-sms', async (req, res) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ success: false, error: 'Phone number and message are required' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  // Check if Twilio credentials are provided
  if (accountSid && authToken && twilioNumber) {
    try {
      const client = twilio(accountSid, authToken);
      const twilioResponse = await client.messages.create({
        body: message,
        from: twilioNumber,
        to: phoneNumber
      });
      console.log(`[SMS Sent via Twilio] To: ${phoneNumber}, SID: ${twilioResponse.sid}`);
      return res.json({ success: true, sid: twilioResponse.sid });
    } catch (error) {
      console.error('[Twilio Error] Failed to send SMS:', error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    // Fallback/Demo mode
    console.log('\n==================================================================');
    console.log(`[DEMO MODE - SMS LOG]`);
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    console.log('==================================================================\n');
    
    return res.json({ 
      success: true, 
      demoMode: true, 
      message: 'SMS logged to console (Twilio credentials not configured)' 
    });
  }
});

// Simple routing structure for other controllers/models
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
