import { Telegraf } from 'telegraf';
import { HelpUAContext, Selection } from './shared/types';
import { createMatch, createOffer, createRequest, register } from '../db';
import { isCategory, isRole, isUILanguage } from '../translations';
import { getNoUserNameErrorReply, getOfferCreatedReply, getRequestCreatedReply, getSelectCategoryReply, getSelectLanguageReply, getSelectRoleReply } from './replies';
import {Role} from '../types';
import {ValidationError} from '../error';

const initialSelection: Selection = {
  uiLanguage: null,
  role: null,
  category: null
};

const getRestartMessage = () => {
  return 'Cannot process response, try /start again';
};

export const initListeners = (bot: Telegraf<HelpUAContext>) => {
  bot.catch(async (err, ctx) => {
    if (err instanceof ValidationError) {
      console.error(err)
      ctx.reply(getRestartMessage())
      return
    }

    throw err
  })

  bot.start(async ctx => {
    if (!ctx || !ctx.chat) return;
    if (!ctx.update.message.from.username) {
      const { text, extra } = getNoUserNameErrorReply();
      ctx.reply(text, extra)
      return
    }
    ctx.session.selection = { ...initialSelection };

    const { text, extra } = getSelectLanguageReply()
    ctx.reply(text, extra)
  });

  bot.action(/ui-language:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;
    const telegramUsername = ctx.update.callback_query.from.username
    if (!telegramUsername) {
      const { text, extra } = getNoUserNameErrorReply();
      ctx.reply(text, extra)
      return
    }

    const uiLanguage = ctx.match[1];

    if (uiLanguage == null || !isUILanguage(uiLanguage)) {
      throw new ValidationError("Validation failed on ui-language")
    }

    ctx.session.selection.uiLanguage = uiLanguage;
    const telegramUserId = ctx.update.callback_query.from.id

    await register({
      telegramUserId,
      telegramUsername,
      uiLanguage,
      chatId: ctx.chat.id
    });

    const { text, extra } = getSelectRoleReply(uiLanguage)
    ctx.reply(text, extra);
  });

  bot.action(/role:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguage = ctx.session.selection.uiLanguage;
    const role = ctx.match[1];

    if (!role || uiLanguage == null || !ctx.session.selection || !isUILanguage(uiLanguage) || !isRole(role)) {
      throw new ValidationError(`Validation failed on role ${role}`)
    }

    ctx.session.selection.role = role;

    const { text, extra } = getSelectCategoryReply(uiLanguage)
    ctx.reply(text, extra);
  });

  bot.action(/help-type:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const category = ctx.match[1];

    if (!category || !ctx.session.selection || !isCategory(category)) {
      throw new ValidationError("Validation failed on help-type")
    }

    ctx.session.selection.category = category;

    const telegramUserId = ctx.update.callback_query.from.id
    if (ctx.session.selection.role === Role.HELPER) {
      const offer = await createOffer(telegramUserId, ctx.session.selection)

      const { text, extra } = getOfferCreatedReply(offer)
      ctx.reply(text, extra)
    } else {
      const request = await createRequest(telegramUserId, ctx.session.selection)

      const { text, extra } = getRequestCreatedReply(request)
      ctx.reply(text, extra)
    }
  });


  bot.action(/match:(.*):(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const offerId = parseInt(ctx.match[1], 10);
    const requestId = parseInt(ctx.match[2], 10);
    const telegramUserId = ctx.update.callback_query.from.id

    if (!offerId || !requestId) {
      throw new ValidationError("Validation failed on match")
    }


    const { requestUser, offerUser } = await createMatch(offerId, requestId, telegramUserId)
    ctx.telegram.sendMessage(requestUser.chatId, `We found someone who wants to help you, message them on: @${offerUser.telegramUsername}`)
  });
};
