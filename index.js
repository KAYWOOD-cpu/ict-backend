const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  agree: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function start() {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/ict-backend');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'ICT Backend is running' });
});

app.post('/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

app.get('/registrations', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
