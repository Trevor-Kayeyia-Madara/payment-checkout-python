const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000; // Set your desired port

// Replace with your Supabase credentials
const SUPABASE_URL = 'https://uexndhmkvkpnmfwxjhzd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleG5kaG1rdmtwbm1md3hqaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwODQ0NzUsImV4cCI6MjAxNTY2MDQ3NX0.7uRYkzhHqwfdbXm28qvHGaDAabKKFFKZYwJ0tmtjJIA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:4000', // replace with your allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  app.use(cors(corsOptions));
  

// Add route to insert data into "Room" table
app.post('/insert-room', async (req, res) => {
  try {
    const data = req.body;

    const roomResponse = await supabase.from('Room').upsert([
      {
        'RoomType': data.room_type || '',
        'NoOfPersons': data.no_of_persons || null,
        'Roomrate': data.room_rate || null,
        'ArrivalDate': data.arrival_date || null,
        'DepartureDate': data.departure_date || null,
        'NightsSpent': data.nights_spent || null,
        'Status': data.status || '',
      }
    ], { returning: 'minimal' });

    if (roomResponse.status === 201) {
      res.json({ message: 'Room data inserted successfully' });
    } else {
      res.json({ message: 'Failed to insert room data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add route to insert data into "Guest" table
app.post('/insert-guest', async (req, res) => {
  try {
    const data = req.body;

    const guestResponse = await supabase.from('Guest').upsert([
      {
        'FirstName': data.first_name || '',
        'Surname': data.surname || '',
        'Email': data.email || '',
        'PhoneNumber': data.phone_number || '',
        'City': data.city || '',
        'Country': data.country || '',
        'ZIP': data.zip || '',
        'RoomType': data.room_type || '',
      }
    ], { returning: 'minimal' });

    if (guestResponse.status === 201) {
      res.json({ message: 'Guest data inserted successfully' });
    } else {
      res.json({ message: 'Failed to insert guest data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.post('/insert-transaction', async (req, res) => {
  try {
    const data = req.body;

    // Assuming you have an array of services in the request body
    const services = data.services || [];

    const transactionsData = services.map((service) => ({
      'TransactionDate': new Date(),
      'GuestFolio': data.guest_folio || null,
      'ItemCode': service.item_code || null,
      'OrderNumber': generateOrderNumber(), // Custom function to generate OrderNumber
      'Amount': service.amount || null,
      'InvoiceNumber': generateInvoiceNumber(), // Custom function to generate InvoiceNumber
    }));

    const transactionsResponse = await supabase.from('Transactions').upsert(
      transactionsData,
      { returning: 'minimal' }
    );

    if (transactionsResponse.status === 201) {
      res.json({ message: 'Transactions data inserted successfully' });
    } else {
      res.json({ message: 'Failed to insert transactions data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Custom function to generate a unique OrderNumber
function generateOrderNumber() {
  // Implement your logic to generate a unique OrderNumber
  // You can use a combination of timestamp, random numbers, or any other method
  return `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Custom function to generate a unique InvoiceNumber
function generateInvoiceNumber() {
  // Implement your logic to generate a unique InvoiceNumber
  // You can use a combination of timestamp, random numbers, or any other method
  return `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
