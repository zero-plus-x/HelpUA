import express from 'express';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express();
const port = 8080;


// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/register', (req, res) => {
  const { user_id: userId } = req.body;

  console.log(userId);

  res.json(JSON.stringify(req.body));
});

app.get('/test', async (req, res) => {
  const posts = await prisma.post.findMany()
  console.log(posts)
});

app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});
