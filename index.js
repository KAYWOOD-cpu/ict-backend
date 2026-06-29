const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const submissionsFile = process.env.SUBMISSIONS_FILE || path.join(__dirname, '..', 'submissions.json');

app.use(cors());
app.use(express.json());

const readSubmissions = () => {
  if (!fs.existsSync(submissionsFile)) {
    return [];
  }

  try {
    const fileContent = fs.readFileSync(submissionsFile, 'utf8');
    const data = JSON.parse(fileContent);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Unable to read submissions:', error.message);
    return [];
  }
};

const writeSubmissions = (submissions) => {
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2), 'utf8');
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'ICT Backend is running' });
});

app.get('/submissions', (req, res) => {
  res.json(readSubmissions());
});

app.post('/submissions', (req, res) => {
  const { name, email, phone, ministry, role, agree } = req.body || {};

  if (!name || !email || !phone || !ministry || !role || agree === undefined) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const submission = {
    name,
    email,
    phone,
    ministry,
    role,
    agree,
    receivedAt: new Date().toISOString(),
  };

  const submissions = readSubmissions();
  submissions.push(submission);
  writeSubmissions(submissions);

  res.status(201).json(submission);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});