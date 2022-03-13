import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createLanguages = () => {
  return prisma.language.createMany({
    data: [{ language: 'English' }, { language: 'Ukrainian' }, { language: 'Russian' }]
  });
};

const createOptions = async () => {
  const needHelp = await prisma.option.create({
    data: { option: 'need-help' }
  });

  const provideHelp = await prisma.option.create({
    data: { option: 'provide-help' }
  });

  return { needHelp, provideHelp };
};

const createHelpTypes = ({ needHelp, provideHelp }: { needHelp: any; provideHelp: any }) => {
  return prisma.helpType.createMany({
    data: [
      { optionId: needHelp.id, helpType: 'urgent-care' },
      { optionId: needHelp.id, helpType: 'transportation' },
      { optionId: needHelp.id, helpType: 'local-information' },
      { optionId: needHelp.id, helpType: 'accommodation' },
      { optionId: provideHelp.id, helpType: 'medical-help' },
      { optionId: provideHelp.id, helpType: 'accommodate-people' },
      { optionId: provideHelp.id, helpType: 'transport-people' },
      { optionId: provideHelp.id, helpType: 'provide-local-information' }
    ]
  });
};

(async function () {
  await createLanguages();
  const options = await createOptions();
  await createHelpTypes(options);
})();
