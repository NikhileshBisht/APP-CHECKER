// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const path = require('path');
const { log } = require('console');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

// Set an interval to update link statuses every 5 seconds
setInterval(async () => {
  try {
    const res = await fetch(`http://localhost:${PORT}/api/update-status`);
    const data = await res.json();
    console.log(data.message);
   console.log("link status updating ");
  } catch (error) {
    console.error('Error updating link statuses:', error);
  }
}, 50000); // 5000 ms = 5 seconds

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
