import express from 'express';

const app = express();
const port = 8080;

app.get('/', (_, res) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});
