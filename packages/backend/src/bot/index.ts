import { splitEvery } from 'ramda'
import { Telegraf } from 'telegraf';
import { HelpUAContext, Selection } from './shared/types';
import { createOfferOrRequest, getCategories, getRoles, getUILanguages, register } from '../db';
import { isCategory, isRole, isUILanguage } from '../translations';

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

const withInitialSession = ({ selection, options }: WithDefaultSession): Selection => {
  const selectionToReturn = typeof selection === 'object' ? selection : initialSelection
  return { ...selectionToReturn, ...options };
};

export const initListeners = (bot: Telegraf<HelpUAContext>) => {
  // @TODO add middleware that will catch errors and reply with restart message
  bot.start(ctx => {
    if (!ctx || !ctx.chat) return;

    ctx.session.selection = { ...initialSelection };
    const uiLanguages = getUILanguages();
    const rows = uiLanguages.map(({ key, label }) => ({
      text: label,
      callback_data: `ui-language:${key}`
    }));

    ctx.reply('Please select a language', {
      reply_markup: {
        inline_keyboard: [rows]
      }
    });
  });

  bot.action(/ui-language:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguage = ctx.match[1];

    if (uiLanguage == null || !isUILanguage(uiLanguage)) {
      console.error("Validation failed on ui-language")
      ctx.reply(getRestartMessage())
      return
    }

    ctx.session.selection = withInitialSession({ selection: ctx.session.selection, options: { uiLanguage } });
    const userId = ctx.update.callback_query.from.id

    await register({
      userId,
      uiLanguage,
      chatId: ctx.chat.id
    });

    const roles = getRoles(uiLanguage);
    const rows = roles.map(role => ({
      text: role.label,
      callback_data: `role:${role.key}`
    }));
    ctx.reply('Please select an option', {
      reply_markup: {
        inline_keyboard: [rows]
      }
    });
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
    const categories = getCategories(uiLanguage);
    const rows = categories.map(category => ({
      text: category.label,
      callback_data: `help-type:${category.key}`
    }));

    ctx.reply('What do you need help with?', {
      reply_markup: {
        inline_keyboard: splitEvery(3, rows)
      }
    });
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
    createOfferOrRequest(ctx.session.selection)
  });
};
