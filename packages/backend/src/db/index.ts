import { PrismaClient, User } from '@prisma/client';
import { UILanguage } from '@prisma/client';
import { Answer, Selection } from '../bot/shared/types';
import {ValidationError} from '../error';
import { CategoryTranslations, RoleTranslations, UILanguageLabels } from '../translations';
import {Candidates} from "../types"

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
    throw new ValidationError('User not found')
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
    throw new ValidationError('User not found')
  }

  const offer = await prisma.request.create({
    data: {
      user: { connect: { id: user.id } },
      category: selection.category,
    },
  })

  return offer
} 

export const findRequestCandidates = async (): Promise<Candidates> => {
  const result: Candidates = []
  const requests = await prisma.request.findMany({
    where: {
      matchedOfferId: null // @TODO check if this works
    },
    orderBy: {
      dateCreated: 'asc',
    },
  })
  for (let request of requests) {
    const debounceDate = new Date()
    debounceDate.setMinutes(debounceDate.getMinutes() - 5)

    const offers = await prisma.offer.findMany({
      take: 1, // @TODO increase this value
      where: {
        OR: [{
          lastCandidateFound: {
            lte: debounceDate
          }
        }, {
          lastCandidateFound: null
        }],
        AND: [{
          category: request.category,
        }],
        NOT: [{
          candidateRequests: {
            some: {
              id: request.id
            }
          }
        }]
      },
      include: {
        user: true
      }
    })
    for (let offer of offers) {
      await prisma.offer.update({
        where: {
          id: offer.id
        },
        data: {
          candidateRequests: {
            connect: [{ id: request.id }]
          },
          lastCandidateFound: new Date(),
        },
      })
    }
    if (offers.length > 0) {
      result.push({ request, offers })
    }
  }
  return result
}

export const createMatch = async (offerId: number, requestId: number, telegramUserId: number): Promise<{requestUser: User, offerUser: User}> => {
  const offer = await prisma.request.findUnique({
    where: {id: offerId},
    include: { user: true }
  })
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { candidateOffers: true, user: true }
  })
  if (request == null || offer == null) {
    throw new ValidationError('Validation error: request or offer does not exist')
  }
  if (offer.user.telegramUserId !== telegramUserId) {
    throw new ValidationError('Validation error: user id does not match')
  }
  if (!request.candidateOffers.some(offer => offer.id === offerId)) {
    throw new ValidationError('Validation error: offer is not a candidate')
  }
  if (request.matchedOfferId != null) {
    throw new ValidationError('Validation error: offer already matched')
  }

  await prisma.request.update({
    where: {
      id: requestId,
    },
    data: {
      matchedOfferId: offerId
    },
    include: {
      user: true
    }
  })

  return {
    requestUser: request.user,
    offerUser: offer.user
  }
}

// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()
