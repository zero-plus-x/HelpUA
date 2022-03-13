import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/register', (req, res) => {
  res.json(req.body);
});

app.get('/test', async (_, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

app.get('/ping', (_, res) => {
  res.end('pong');
});

app.listen(port, () => {
  console.log(`>> Backend ready at http://localhost:${port}`);
});

// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()
