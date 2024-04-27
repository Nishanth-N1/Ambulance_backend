const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
const db = require('../models/database');

app.post('/register', async (req, res) => {
    try{

    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = app;
