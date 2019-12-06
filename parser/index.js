const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/*', (req, res) => {
  res.send('Handle All Routes');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
