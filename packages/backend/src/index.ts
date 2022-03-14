import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  findHelpType,
  findOption,
  getHelpTypesByLanguageIdAndOptionId,
  getOptionsByLanguageId,
  getUILanguages
} from './db/helpers';

const prisma = new PrismaClient();
const port = 3000;

const app = express();
app.use(express.json());

app.get('/ui_languages', async (_, res) => {
  try {
    const uiLanguages = await getUILanguages(prisma);

    res.status(200).json(uiLanguages);
  } catch (e) {
    res.status(500).send();
  }
});

app.get('/languages/:languageId/options', async (req, res) => {
  const languageId = parseInt(req.params.languageId);

  try {
    const options = await getOptionsByLanguageId(prisma, languageId);

    res.status(200).json(options);
  } catch (e) {
    res.status(500).send();
  }
});

app.get('/languages/:languageId/options/:optionId/help_types', async (req, res) => {
  const languageId = parseInt(req.params.languageId);
  const optionId = parseInt(req.params.optionId);

  try {
    const options = await getHelpTypesByLanguageIdAndOptionId(prisma, languageId, optionId);

    res.status(200).json(options);
  } catch (e) {
    res.status(500).send();
  }
});

app.post('/register', async (req, res) => {
  const { userId, chatId, uiLanguageId, option, helpType } = req.body;

  try {
    // @NOTE: Dev only, remove the user before storing to db, for easier testing
    // @TODO: Remove later
    await prisma.user.delete({ where: { telegramUserId: userId } });
  } catch (e) {
    console.log('First time user.');
  }

  try {
    // @NOTE: These records are provided as strings from the bot.
    // Fetch them from their tables by name for now,
    // until we are able to provide them to the bot and populate with name and id
    const [optionRow, helpTypeRow] = await Promise.all([findOption(prisma, option), findHelpType(prisma, helpType)]);

    if (optionRow?.id && helpTypeRow?.id) {
      const user = await prisma.user.create({
        data: {
          chatId,
          telegramUserId: userId,
          uiLanguageId: uiLanguageId,
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
