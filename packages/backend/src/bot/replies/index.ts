import {Offer, Request, User} from "@prisma/client";
import {Markup} from "telegraf";
import {ExtraReplyMessage} from "telegraf/typings/telegram-types"
import {getCategories, getRoles, getUILanguages} from "../../db";
import {BotCategoryQuestion, BotNoUserNameErrorReply, BotOfferCreatedReply, BotRequestCreatedReply, CategoryTranslations} from "../../translations";
import {UILanguage} from "../../types";

type Reply = {
  text: string,
  extra?: ExtraReplyMessage
}

export const getStartReply = (uiLanguage: UILanguage): Reply => {
  const roles = getRoles(uiLanguage);
  const rows = [
    [Markup.button.callback('Change language', 'change-language')],
    roles.map(role => {
      return Markup.button.callback(role.label, `role:${role.key}`)
    }),
  ]

  return {
    text: 'Hello, this bot is created to help Ukrainian refugees',
    extra: Markup.inlineKeyboard(rows)
  }
}

export const getSelectLanguageReply = (): Reply => {
  const uiLanguages = getUILanguages();
  const rows = uiLanguages.map(({ key, label }) => {
    return Markup.button.callback(label, `ui-language:${key}`)
  });

  return {
    text: 'Please select a language',
    extra: Markup.inlineKeyboard(rows)
  }
}

export const getSelectCategoryReply = (uiLanguage: UILanguage): Reply => {
  const categories = getCategories(uiLanguage);
  const rows = categories.map(category => {
    return Markup.button.callback(category.label, category.key)
  });

  return {
    text: BotCategoryQuestion[uiLanguage], 
    extra: Markup.inlineKeyboard(rows)
  };
}

export const getOfferCreatedReply = (uiLanguage: UILanguage): Reply => {
    return {
      text: BotOfferCreatedReply[uiLanguage]
    }
}

export const getRequestCreatedReply = (uiLanguage: UILanguage): Reply => {
    return {
      text: BotRequestCreatedReply[uiLanguage]
    }
}

export const getNoUserNameErrorReply = (uiLanguage: UILanguage): Reply => {
    return {
      text: BotNoUserNameErrorReply[uiLanguage]
    }
}

export const getCandidateMessage = (offer: Offer & { user: User }, request: Request): Reply => {
  const rows = [Markup.button.callback('I want to help', `match:${offer.id}:${request.id}`)]

  return {
    text: `Found a person you can help with: ${CategoryTranslations[request.category][offer.user.uiLanguage]}`,
    extra: Markup.inlineKeyboard(rows)
  }
}
