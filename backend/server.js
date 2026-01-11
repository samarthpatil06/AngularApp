const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  {
    email: 'admin@gmail.com',
    password: 'admin',
    role: 'SUPERUSER'
  },
  {
    email: 'user1@gmail.com',
    password: 'user1',
    role: 'USER'
  },
  {
    email: 'user2@gmail.com',
    password: 'user2',
    role: 'USER'
  },
  {
    email: 'user3@gmail.com',
    password: 'user3',
    role: 'USER'
  }
];

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({
    email: user.email,
    role: user.role
  });
});

app.post('/api/test',(req,res)=>{
    console.log('demo');
})

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
