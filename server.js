const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.send('hi');
});

app.use('/hi', (req, res) => {
    res.send('hello');
});

app.listen(9000);