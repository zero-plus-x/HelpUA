import { PrismaClient, User } from '@prisma/client';
import { UILanguage } from '@prisma/client';
import { Answer, Selection } from '../bot/shared/types';
import { CategoryTranslations, RoleTranslations, UILanguageLabels } from '../translations';

export const prisma = new PrismaClient();

export const getUser = async (telegramUserId: number) => {
  return await prisma.user.findUnique({ where: { telegramUserId } })
}

export const register = async ({ telegramUserId, chatId, uiLanguage, telegramUsername}: Omit<User, 'id'>): Promise<User> => {
  const user = await prisma.user.upsert({
    where: { telegramUserId },
    update: { chatId, uiLanguage, telegramUsername },
    create: { chatId, telegramUserId, uiLanguage, telegramUsername },
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

export const createOffer = async (telegramUserId: number, selection: Selection) => {
  const user = await getUser(telegramUserId)
  if (user == null || !selection.category) {
    throw new Error('User not found')
  }

  const offer = await prisma.offer.create({
    data: {
      user: { connect: { id: user.id } },
      category: selection.category,
    }
  })

  return offer
}

export const createRequest = async (telegramUserId: number, selection: Selection) => {
  const user = await getUser(telegramUserId)
  if (user == null || !selection.category) {
    throw new Error('User not found')
  }

  const offer = await prisma.request.create({
    data: {
      user: { connect: { id: user.id } },
      category: selection.category,
    }
  })

  return offer
} 

// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()
