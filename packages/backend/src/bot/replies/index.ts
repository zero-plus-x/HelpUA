import {Offer, Role, UILanguage} from "@prisma/client";
import {splitEvery} from "ramda";
import {ExtraReplyMessage} from "telegraf/typings/telegram-types"
import {getCategories, getRoles, getUILanguages} from "../../db";

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
    text: 'What do you need help with?', 
    extra: {
      reply_markup: {
        inline_keyboard: splitEvery(3, rows)
      }
    }
  };
}

export const getOfferCreatedReply = (offer: Offer): Reply => {
  if (offer.role === Role.HELPER) {
    return {
      text: 'We will get back to you when we find who you can help'
    }
  } else {
    return {
      text: 'We will try to find help as soon as possible'
    }
  }
}
