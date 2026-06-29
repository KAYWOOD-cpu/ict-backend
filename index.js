const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.json({ message: 'ICT Backend is running' });
  app.get('/registrations', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
// 1. Define the Schema - matches your church form
const UserSchema = new mongoose.Schema({
  name: String,
  email: String, 
  phone: String,
  agree: Boolean, // matches name="agree" from your checkbox
  createdAt: { type: Date, default: Date.now }
});

// 2. Create the Model - THIS is what was missing
const User = mongoose.model('User', UserSchema);
app.post('/register', async (req, res) => {
  const user = new User(req.body); // <-- needs the Model above
  await user.save();
  res.status(201).json(user);
});

app.get('/registrations', async (req, res) => {
  const users = await User.find(); // <-- needs the Model above
  res.json(users);
});
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URL);

// THIS MUST BE ABOVE your app.post('/register')
const UserSchema = new mongoose.Schema({ name: String, email: String, phone: String, agree: Boolean });
const User = mongoose.model('User', UserSchema); // <-- Line 15ish

app.post('/register', ... ) // <-- Line 30ish uses User
});