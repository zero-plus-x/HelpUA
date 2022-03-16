import { PrismaClient } from '@prisma/client';
import { UILanguage } from '@prisma/client';
import { Answer, Selection, User } from '../bot/shared/types';
import { CategoryTranslations, RoleTranslations, UILanguageLabels } from '../translations';

const prisma = new PrismaClient();

export const getUser = async (telegramUserId: number) => {
  return await prisma.user.findUnique({ where: { telegramUserId } })
}

export const register = async ({ telegramUserId, chatId, uiLanguage}: { telegramUserId: number, chatId: number, uiLanguage: UILanguage }): Promise<User> => {
  const user = await getUser(telegramUserId)
  if (user != null) {
    const updatedUser = await prisma.user.update({
      where: { telegramUserId },
      data: {
        chatId, uiLanguage
      }
    })
    return updatedUser
  }

  const newUser = await prisma.user.create({
    data: { chatId, telegramUserId, uiLanguage }
  });

  return newUser
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
  if (user == null || !selection.category || !selection.role) {
    throw new Error('User not found')
  }

  const offer = await prisma.offer.create({
    data: {
      user: { connect: { id: user.id } },
      category: selection.category,
      role: selection.role,
    }
  })
  return offer
}

// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()
