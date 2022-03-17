import {Offer, Request, UILanguage, User} from "@prisma/client";
import {splitEvery} from "ramda";
import {Markup} from "telegraf";
import {ExtraReplyMessage} from "telegraf/typings/telegram-types"
import {getCategories, getRoles, getUILanguages} from "../../db";
import {BotCategoryQuestion, BotNoUserNameErrorReply, BotOfferCreatedReply, BotOptionQuestion, BotRequestCreatedReply, CategoryTranslations} from "../../translations";

type Reply = {
  text: string,
  extra?: ExtraReplyMessage
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

export const getSelectRoleReply = (uiLanguage: UILanguage): Reply => {
  const roles = getRoles(uiLanguage);
  const rows = roles.map(role => {
    return Markup.button.callback(role.label, `role:${role.key}`)
  });

  return {
    text: BotOptionQuestion[uiLanguage],
    extra: Markup.inlineKeyboard(rows)
  }
}

export const getSelectCategoryReply = (uiLanguage: UILanguage): Reply => {
  const categories = getCategories(uiLanguage);
  const rows = categories.map(category => {
    return Markup.button.callback(category.label, `help-type:${category.key}`)
  });

  return {
    text: BotCategoryQuestion[uiLanguage], 
    extra: Markup.inlineKeyboard(splitEvery(3, rows))
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
