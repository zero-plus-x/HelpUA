import { PrismaClient } from '@prisma/client';

const findLanguage = (prisma: PrismaClient, language: string) => {
  return prisma.language.findFirst({
    where: {
      language: {
        equals: language,
        mode: 'insensitive'
      }
    },
    select: { id: true }
  });
};

const findOption = (prisma: PrismaClient, option: string) => {
  return prisma.option.findFirst({
    where: {
      option: {
        equals: option,
        mode: 'insensitive'
      }
    },
    select: { id: true }
  });
};

const findHelpType = (prisma: PrismaClient, helpType: string) => {
  return prisma.helpType.findFirst({
    where: {
      helpType: {
        equals: helpType,
        mode: 'insensitive'
      }
    },
    select: { id: true }
  });
};

const getUILanguages = (prisma: PrismaClient) => {
  return prisma.language.findMany({
    where: {
      showInUI: true
    },
    select: {
      id: true,
      language: true
    }
  });
};

const getOptionsByLanguageId = (prisma: PrismaClient, languageId: number) => {
  return prisma.option.findMany({
    where: {
      languageId
    },
    select: {
      id: true,
      label: true
    }
  });
};

const getHelpTypesByLanguageIdAndOptionId = (prisma: PrismaClient, languageId: number, optionId: number) => {
  return prisma.helpType.findMany({
    where: {
      languageId,
      optionId
    },
    select: {
      id: true,
      label: true
    }
  });
};

export {
  findLanguage,
  findOption,
  findHelpType,
  getUILanguages,
  getOptionsByLanguageId,
  getHelpTypesByLanguageIdAndOptionId
};
