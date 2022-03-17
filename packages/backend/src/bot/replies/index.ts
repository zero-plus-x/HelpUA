import {Offer, Request, UILanguage, User} from "@prisma/client";
import {splitEvery} from "ramda";
import {ExtraReplyMessage} from "telegraf/typings/telegram-types"
import {getCategories, getRoles, getUILanguages} from "../../db";
import {BotCategoryQuestion, BotNoUserNameErrorReply, BotOfferCreatedReply, BotOptionQuestion, BotRequestCreatedReply, CategoryTranslations} from "../../translations";

type Reply = {
  text: string,
  extra?: ExtraReplyMessage
}

export const getSelectLanguageReply = (): Reply => {
  const uiLanguages = getUILanguages();
  const rows = uiLanguages.map(({ key, label }) => ({
    text: label,
    callback_data: `ui-language:${key}`
  }));

  return {
    text: 'Please select a language',
    extra: {
      reply_markup: {
        inline_keyboard: [rows]
      }
    }
  }
}

export const getSelectRoleReply = (uiLanguage: UILanguage): Reply => {
  const roles = getRoles(uiLanguage);
  const rows = roles.map(role => ({
    text: role.label,
    callback_data: `role:${role.key}`
  }));

  return {
    text: BotOptionQuestion[uiLanguage],
    extra: {
      reply_markup: {
        inline_keyboard: [rows]
      }
    }
  }
}

export const getSelectCategoryReply = (uiLanguage: UILanguage): Reply => {
  const categories = getCategories(uiLanguage);
  const rows = categories.map(category => ({
    text: category.label,
    callback_data: `help-type:${category.key}`
  }));

  return {
    text: BotCategoryQuestion[uiLanguage], 
    extra: {
      reply_markup: {
        inline_keyboard: splitEvery(3, rows)
      }
    }
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
  const rows = [{ text: 'I want to help', callback_data: `match:${offer.id}:${request.id}` }]

  return {
    text: `Found a person you can help with: ${CategoryTranslations[request.category][offer.user.uiLanguage]}`,
    extra: {
      reply_markup: {
        inline_keyboard: [rows]
      }
    }
  }
}
