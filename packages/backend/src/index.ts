import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/register', (req, res) => {
  const { user_id: userId } = req.body;

  console.log(userId);

  res.json(JSON.stringify(req.body));
});

app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});
