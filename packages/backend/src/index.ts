import express from 'express';
import { PrismaClient, UILanguage, Role, Category } from '@prisma/client';
import { getHelpTypesByLanguageIdAndOptionId, getOptionsByLanguageId, getUILanguages } from './db/helpers';

const prisma = new PrismaClient();
const port = 3000;

const app = express();
app.use(express.json());

const UILanguageLabels = {
    [UILanguage.ENGLISH]: 'English',
    [UILanguage.UKRAINIAN]: 'Украї́нська мо́ва',
    [UILanguage.RUSSIAN]: 'Русский язык',
}

const RoleTranslations = {
  [Role.HELPEE]: {
    [UILanguage.ENGLISH]: 'I want to help',
    [UILanguage.UKRAINIAN]: 'Я можу допомогти',
    [UILanguage.RUSSIAN]: 'Я могу помочь',
  },
  [Role.HELPER]: {
    [UILanguage.ENGLISH]: 'I need help',
    [UILanguage.UKRAINIAN]: 'Мені потрібна допомога',
    [UILanguage.RUSSIAN]: 'Мне нужна помощь',
  }
}

const CategoryTranslations = {
  [Category.URGENT_CARE]: {
    [UILanguage.ENGLISH]: 'Urgent help',
    [UILanguage.UKRAINIAN]: 'Невідкладна допомога',
    [UILanguage.RUSSIAN]: 'Срочная помощь',
  },
  [Category.TRANSPORTATION]: {
    [UILanguage.ENGLISH]: 'Transportation',
    [UILanguage.UKRAINIAN]: 'Перевезення',
    [UILanguage.RUSSIAN]: 'Транспорт',
  },
  [Category.LOCAL_INFORMATION]: {
    [UILanguage.ENGLISH]: 'Local information',
    [UILanguage.UKRAINIAN]: 'Місцева інформація',
    [UILanguage.RUSSIAN]: 'Местная информация',
  },
  [Category.ACCOMODATION]: {
    [UILanguage.ENGLISH]: 'Accommodation',
    [UILanguage.UKRAINIAN]: 'Проживання',
    [UILanguage.RUSSIAN]: 'Жилье',
  },
  [Category.MEDICAL_HELP]: {
    [UILanguage.ENGLISH]: 'Medical help',
    [UILanguage.UKRAINIAN]: 'Медична допомога',
    [UILanguage.RUSSIAN]: 'Медицинская помощь',
  },
}

const isSomeEnum = <T>(e: T) => (token: any): token is T[keyof T] =>  {
    return Object.values(e).includes(token as T[keyof T]);
}
const isUILanguage = isSomeEnum(UILanguage)

app.get('/ui_languages', async (_, res) => {
  const result = Object.entries(UILanguageLabels).map(([key, label]) => {
    return {key, label}
  })
  res.status(200).json(result)
});

app.get('/languages/:uiLanguage/roles', async (req, res) => {
  const uiLanguage = req.params.uiLanguage;

  if (!isUILanguage(uiLanguage)) {
    res.status(400).send(`ui language ${uiLanguage} does not exist`)
    return 
  }

  const result = Object.entries(RoleTranslations).map(([key, labels]) => {
    return {
      key,
      label: labels[uiLanguage]
    }
  })
  res.status(200).json(result)
});

app.get('/languages/:uiLanguage/roles/:role/help_types', async (req, res) => {
  const uiLanguage = req.params.uiLanguage;
  if (!isUILanguage(uiLanguage)) {
    res.status(400).send(`ui language ${uiLanguage} does not exist`)
    return 
  }

  const result = Object.entries(CategoryTranslations).map(([key, labels]) => {
    return {
      key,
      label: labels[uiLanguage]
    }
  })
  res.status(200).json(result)
});

app.post('/register', async (req, res) => {
  const { userId, chatId, uiLanguage } = req.body;

  try {
    // @NOTE: Dev only, this removes the user before storing to db, so it's easier to test locally
    // @TODO: Remove later
    await prisma.user.delete({ where: { telegramUserId: userId } });
  } catch (e) {
    console.log('First time user.');
  }

  try {
    if (userId && chatId && uiLanguage) {
      const user = await prisma.user.create({
        data: { chatId, telegramUserId: userId, uiLanguage }
      });

      const response = await prisma.user.findUnique({
        where: { id: user.id },
      });

      res.status(200).json({
        chatId: response?.chatId,
        telegramUserId: response?.telegramUserId,
        uiLanguage: response?.uiLanguage,
      });
    }

    res.status(400).send();
  } catch (e) {
    console.log('Error:', e);
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`>> Backend ready at http://localhost:${port}`);
});

// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()
