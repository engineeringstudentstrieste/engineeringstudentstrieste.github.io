// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connessione a MongoDB (modifica la stringa con la tua!)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/engineeringstudents', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Test route
app.get('/', (req, res) => {
    res.send('API REST Engineering Students Trieste');
});

// Avvia il server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ascolta su http://localhost:${PORT}`);
});
