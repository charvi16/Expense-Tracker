import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  res.json({ message: 'test' });
});

app.listen(5001, () => {
  console.log('Testing server on 5001');
});
