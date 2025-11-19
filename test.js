const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const authMiddleware = (req, res, next) => {
  console.log("Middleware اجرا شد");
  if (req.headers.authorization !== '12345') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const mainController = {
  home: (req, res) => {
    res.send('It works!');
  },
  about: (req, res) => {
    res.send('This page is about us!');
  }
};

const userController = {
  register: (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email required' });
    }
    const newUser = { id: Date.now(), name, email };
    res.json({ message: 'User registered successfully', user: newUser });
  }
};

app.get('/', mainController.home);
app.get('/about', mainController.about);

app.post('/users/register', authMiddleware, userController.register);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
