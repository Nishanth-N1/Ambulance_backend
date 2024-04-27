const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
const db = require('../models/database');

app.post('/register', async (req, res) => {
    try{
    await db.register.create(req.body);
    res.status(200).json({Message : "Successfully inserted"});
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});
app.post('/login', async (req, res) => {
    try{
        const an = req.body.ambulance_no;
        const result=await db.register.findAll({where : {ambulance_no : an}});
        if (result[0].password == req.body.password)
        {
            res.status(200).json({Message : "Login successful" , Data : result});

        }
        else{
            res.status(403).json({Message : "Invalid password"});
        }
        }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


module.exports = app;
