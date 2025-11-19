const express = require('express');
const app = express();
const port = 3000;

// Route اصلی
app.get('/', (req, res) => {
  res.send('it work!');
});

// Route تستی
app.get('/about', (req, res) => {
  res.send('this page is about us!');
});

// راه اندازی سرور
app.listen(port, () => {
  console.log(` http://localhost:${port}`);
});