import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ILanguages {
  english: {
    id: number;
  };
  ukrainian: {
    id: number;
  };
  russian: {
    id: number;
  };
}

interface IOptions {
  english: {
    needHelp: { id: number };
    provideHelp: { id: number };
  };
  ukrainian: {
    needHelp: { id: number };
    provideHelp: { id: number };
  };
  russian: {
    needHelp: { id: number };
    provideHelp: { id: number };
  };
}

const createLanguages = async () => {
  // Add languages for the UI
  const english = await prisma.language.create({ data: { language: 'English', showInUI: true } });
  const ukrainian = await prisma.language.create({ data: { language: 'Ukrainian', showInUI: true } });
  const russian = await prisma.language.create({ data: { language: 'Russian', showInUI: true } });

  // Add other speaking languages (to be implemented)
  await prisma.language.createMany({
    data: [
      { language: 'Polish', showInUI: false },
      { language: 'Romanian', showInUI: false }
    ]
  });

  return { english, ukrainian, russian };
};

const createOptions = async ({
  english,
  ukrainian,
  russian
}: {
  english: { id: number };
  ukrainian: { id: number };
  russian: { id: number };
}) => {
  const options: IOptions = {
    english: {
      needHelp: await prisma.option.create({
        data: { option: 'need-help', label: 'Need help', languageId: english.id },
        select: { id: true }
      }),
      provideHelp: await prisma.option.create({
        data: { option: 'provide-help', label: 'Provide help', languageId: english.id },
        select: { id: true }
      })
    },
    ukrainian: {
      needHelp: await prisma.option.create({
        data: { option: 'need-help', label: 'Мені потрібна допомога', languageId: ukrainian.id },
        select: { id: true }
      }),
      provideHelp: await prisma.option.create({
        data: { option: 'provide-help', label: 'Я можу допомогти', languageId: ukrainian.id },
        select: { id: true }
      })
    },
    russian: {
      needHelp: await prisma.option.create({
        data: { option: 'need-help', label: 'Мне нужна помощь', languageId: russian.id },
        select: { id: true }
      }),
      provideHelp: await prisma.option.create({
        data: { option: 'provide-help', label: 'Я могу помочь', languageId: russian.id },
        select: { id: true }
      })
    }
  };

  return options;
};

const createHelpTypes = (languages: ILanguages, options: IOptions) => {
  if (
    options.english.needHelp &&
    options.russian.needHelp &&
    options.ukrainian.needHelp &&
    options.english.provideHelp &&
    options.russian.provideHelp &&
    options.ukrainian.provideHelp
  ) {
    return prisma.helpType.createMany({
      data: [
        {
          optionId: options.english.needHelp.id,
          languageId: languages.english.id,
          helpType: 'urgent-care',
          label: 'Urgent help - english'
        },
        {
          optionId: options.ukrainian.needHelp.id,
          languageId: languages.ukrainian.id,
          helpType: 'transportation',
          label: 'Transportation - ukrainian'
        },
        {
          optionId: options.russian.needHelp.id,
          languageId: languages.russian.id,
          helpType: 'transportation',
          label: 'Transportation - russian'
        },
        {
          optionId: options.english.needHelp.id,
          languageId: languages.english.id,
          helpType: 'local-information',
          label: 'Local information - english'
        },
        {
          optionId: options.ukrainian.needHelp.id,
          languageId: languages.ukrainian.id,
          helpType: 'local-information',
          label: 'Local information - ukrainian'
        },
        {
          optionId: options.russian.needHelp.id,
          languageId: languages.russian.id,
          helpType: 'local-information',
          label: 'Local information - russian'
        },
        {
          optionId: options.english.needHelp.id,
          languageId: languages.english.id,
          helpType: 'accommodation',
          label: 'Accommodation - english'
        },
        {
          optionId: options.ukrainian.needHelp.id,
          languageId: languages.ukrainian.id,
          helpType: 'accommodation',
          label: 'Accommodation - ukrainian'
        },
        {
          optionId: options.russian.needHelp.id,
          languageId: languages.russian.id,
          helpType: 'accommodation',
          label: 'Accommodation - russian'
        },
        {
          optionId: options.english.needHelp.id,
          languageId: languages.english.id,
          helpType: 'medical-help',
          label: 'Medical help - english'
        },
        {
          optionId: options.ukrainian.needHelp.id,
          languageId: languages.ukrainian.id,
          helpType: 'medical-help',
          label: 'Medical help - ukrainian'
        },
        {
          optionId: options.russian.needHelp.id,
          languageId: languages.russian.id,
          helpType: 'medical-help',
          label: 'Medical help - russian'
        },
        {
          optionId: options.english.provideHelp.id,
          languageId: languages.english.id,
          helpType: 'accommodate-people',
          label: 'Accommodate people - english'
        },
        {
          optionId: options.ukrainian.provideHelp.id,
          languageId: languages.ukrainian.id,
          helpType: 'accommodate-people',
          label: 'Accommodate people - ukrainian'
        },
        {
          optionId: options.russian.provideHelp.id,
          languageId: languages.russian.id,
          helpType: 'accommodate-people',
          label: 'Accommodate people - russian'
        },
        {
          optionId: options.english.provideHelp.id,
          languageId: languages.english.id,
          helpType: 'transport-people',
          label: 'Transport people - english'
        },
        {
          optionId: options.ukrainian.provideHelp.id,
          languageId: languages.ukrainian.id,
          helpType: 'transport-people',
          label: 'Transport people - ukrainian'
        },
        {
          optionId: options.russian.provideHelp.id,
          languageId: languages.russian.id,
          helpType: 'transport-people',
          label: 'Transport people - russian'
        },
        {
          optionId: options.english.provideHelp.id,
          languageId: languages.english.id,
          helpType: 'provide-local-information',
          label: 'Provide local information - english'
        },
        {
          optionId: options.ukrainian.provideHelp.id,
          languageId: languages.ukrainian.id,
          helpType: 'provide-local-information',
          label: 'Provide local information - ukrainian'
        },
        {
          optionId: options.russian.provideHelp.id,
          languageId: languages.russian.id,
          helpType: 'provide-local-information',
          label: 'Provide local information - russian'
        }
      ]
    });
  } else {
    console.log('Invalid options passed to function');
  }
};

(async function () {
  const languages = await createLanguages();
  const options = await createOptions(languages);
  await createHelpTypes(languages, options);
})();
