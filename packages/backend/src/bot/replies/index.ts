import {Offer, Request, UILanguage, User} from "@prisma/client";
import {splitEvery} from "ramda";
import {ExtraReplyMessage} from "telegraf/typings/telegram-types"
import {getCategories, getRoles, getUILanguages} from "../../db";
import {CategoryTranslations} from "../../translations";

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
    text: 'Please select an option',
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
    text: 'What category?', 
    extra: {
      reply_markup: {
        inline_keyboard: splitEvery(3, rows)
      }
    }
  };
}

export const getOfferCreatedReply = (offer: Offer): Reply => {
    return {
      text: 'We will get back to you when we find who you can help'
    }
}

export const getRequestCreatedReply = (request: Request): Reply => {
    return {
      text: 'We will try to find help as soon as possible'
    }
}

export const getNoUserNameErrorReply = (): Reply => {
  return {
    text: 'In order to use this bot you need to have a username. You can add it in the settings.'
  }
}

export const getCandidateMessage = (offer: Offer & { user: User }, request: Request): Reply => {
  const rows = [{ text: 'I want to help', callback_data: `match:${offer.id}:${request.id}` }]

  return {
    text: `Found a candidate with category ${CategoryTranslations[request.category][offer.user.uiLanguage]}`,
    extra: {
      reply_markup: {
        inline_keyboard: [rows]
      }
    }
  }
}
