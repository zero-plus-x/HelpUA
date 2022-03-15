import { PrismaClient } from '@prisma/client';
import { UILanguage } from '@prisma/client';
import { Answer, Selection, User } from '../bot/shared/types';
import { CategoryTranslations, RoleTranslations, UILanguageLabels } from '../translations';

const prisma = new PrismaClient();

export const register = async ({ userId, chatId, uiLanguage}: { userId: number, chatId: number, uiLanguage: UILanguage }): Promise<User> => {
  try {
    // @NOTE: Dev only, this removes the user before storing to db, so it's easier to test locally
    // @TODO: Remove later
    await prisma.user.delete({ where: { telegramUserId: userId } });
  } catch (e) {
    console.log('First time user.');
  }

  const user = await prisma.user.create({
    data: { chatId, telegramUserId: userId, uiLanguage }
  });

  return user
};

export const getUILanguages = (): Answer[] => {
  return Object.entries(UILanguageLabels).map(([key, label]) => {
    return {key, label}
  })
};

export const getRoles = (uiLanguage: UILanguage): Answer[] => {
  return Object.entries(RoleTranslations).map(([key, labels]) => {
    return {
      key,
      label: labels[uiLanguage]
    }
  })
};

export const getCategories = (uiLanguage: UILanguage): Answer[] => {
  return Object.entries(CategoryTranslations).map(([key, labels]) => {
    return {
      key,
      label: labels[uiLanguage]
    }
  })
};

export const createOfferOrRequest = (selection: Selection) => {
  console.log(selection)
}

// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()
