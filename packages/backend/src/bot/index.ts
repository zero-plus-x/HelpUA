import { splitEvery } from 'ramda'
import { Telegraf } from 'telegraf';
import { HelpUAContext, Selection } from './shared/types';
import { createOffer, getUser, register } from '../db';
import { isCategory, isRole, isUILanguage } from '../translations';
import {getOfferCreatedReply, getSelectCategoryReply, getSelectLanguageReply, getSelectRoleReply} from './replies';

const initialSelection: Selection = {
  uiLanguage: null,
  role: null,
  category: null
};

type WithDefaultSession = {
  selection?: Selection;
  options: Record<string, any>;
}


const getRestartMessage = () => {
  return 'Cannot process response, try /start again';
};

export const initListeners = (bot: Telegraf<HelpUAContext>) => {
  // @TODO add middleware that will catch errors and reply with restart message
  bot.start(async ctx => {
    if (!ctx || !ctx.chat) return;
    ctx.session.selection = { ...initialSelection };

    const { text, extra } = getSelectLanguageReply()
    ctx.reply(text, extra)
  });

  bot.action(/ui-language:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguage = ctx.match[1];

    if (uiLanguage == null || !isUILanguage(uiLanguage)) {
      console.error("Validation failed on ui-language")
      ctx.reply(getRestartMessage())
      return
    }

    ctx.session.selection.uiLanguage = uiLanguage;
    const telegramUserId = ctx.update.callback_query.from.id

    await register({
      telegramUserId,
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
      console.error("Validation failed on role", role)
      ctx.reply(getRestartMessage())
      return;
    }

    ctx.session.selection.role = role;

    const { text, extra } = getSelectCategoryReply(uiLanguage)
    ctx.reply(text, extra);
  });

  bot.action(/help-type:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const category = ctx.match[1];

    if (!category || !ctx.session.selection || !isCategory(category)) {
      console.error("Validation failed on help-type")
      ctx.reply(getRestartMessage())
      return;
    }

    ctx.session.selection.category = category;

    const telegramUserId = ctx.update.callback_query.from.id
    const offer = await createOffer(telegramUserId, ctx.session.selection)

    const { text, extra } = getOfferCreatedReply(offer)
    ctx.reply(text, extra)
  });
};