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
});