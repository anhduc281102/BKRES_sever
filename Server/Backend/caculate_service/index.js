require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const thresholdRouter = require('./control/threshold_router');

const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.MONGO_DB_CONNECTION_STRING

// Middleware
app.use(bodyParser.json());

// Kết nối với cơ sở dữ liệu MongoDB
mongoose.connect(connectionString)
    .then(() => console.log('[+] Frontend service connected to MongoDB.'))
    .catch(err => console.error('[!] Error connection:', err));

// Sử dụng router threshold
app.use(thresholdRouter);

// Server lắng nghe cổng
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
