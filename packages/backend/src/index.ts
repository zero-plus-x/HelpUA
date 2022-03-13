import express from 'express';
import { PrismaClient } from '@prisma/client';
import { findHelpType, findLanguage, findOption } from './db/helpers';

const prisma = new PrismaClient();
const port = 3000;

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
  const { userId, chatId, language, option, helpType } = req.body;

  try {
    // @NOTE: These records are provided as strings from the bot.
    // Fetch them from their tables by name for now,
    // until we are able to provide them to the bot and populate with name and id
    const [languageRow, optionRow, helpTypeRow] = await Promise.all([
      findLanguage(prisma, language),
      findOption(prisma, option),
      findHelpType(prisma, helpType)
    ]);

    if (languageRow?.id && optionRow?.id && helpTypeRow?.id) {
      // @NOTE: Dev only, remove the user before storing to db, for easier testing
      // @TODO: Remove later
      await prisma.user.delete({ where: { userId } });

      const user = await prisma.user.create({
        data: {
          userId,
          chatId,
          languageId: languageRow.id,
          optionId: optionRow.id,
          helpTypeId: helpTypeRow.id
        }
      });
      console.log(user);

      res.status(200).send();
    }

    res.status(400).send();
  } catch (e) {
    console.log('Error:', e);
    res.status(500).send();
  }
});

app.get('/ping', (_, res) => {
  res.end('pong');
});

app.listen(port, () => {
  console.log(`>> Backend ready at http://localhost:${port}`);
});

// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()
