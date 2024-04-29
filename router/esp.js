const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());


app.post('/check', (req, res) => {
    try {
        console.log("success");
        res.status(200).json({ message: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = app;
