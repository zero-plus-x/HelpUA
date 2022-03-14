import express from 'express';
import { PrismaClient } from '@prisma/client';
import { getHelpTypesByLanguageIdAndOptionId, getOptionsByLanguageId, getUILanguages } from './db/helpers';

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
  const { userId, chatId, uiLanguageId, optionId, helpTypeId } = req.body;

  try {
    // @NOTE: Dev only, this removes the user before storing to db, so it's easier to test locally
    // @TODO: Remove later
    await prisma.user.delete({ where: { telegramUserId: userId } });
  } catch (e) {
    console.log('First time user.');
  }

  try {
    if (userId && chatId && uiLanguageId && optionId && helpTypeId) {
      const user = await prisma.user.create({
        data: { chatId, telegramUserId: userId, uiLanguageId, optionId, helpTypeId }
      });

      const response = await prisma.user.findUnique({
        where: { id: user.id },
        include: { uiLanguage: true, option: true, helpType: true }
      });

      res.status(200).json({
        chatId: response?.chatId,
        telegramUserId: response?.telegramUserId,
        uiLanguage: response?.uiLanguage.language,
        option: response?.option.label,
        helpType: response?.helpType.label
      });
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
