import { Telegraf } from 'telegraf';
import { HelpUAContext, Selection } from '../shared/types';
import { askForCategory, askForRole, askToRestart } from '../questions';
import { register } from '../db';
import {isUILanguage} from '../../translations';

const initialSelection: Selection = {
  uiLanguage: null,
  role: null,
  category: null
};

type WithDefaultSession = {
  selection?: Selection;
  options: Record<string, any>;
}

const withInitialSession = ({ selection, options }: WithDefaultSession): Selection => {
  const selectionToReturn = typeof selection === 'object' ? selection : initialSelection
  return { ...selectionToReturn, ...options };
};

const initAnswerListeners = (bot: Telegraf<HelpUAContext>) => {
  bot.action(/ui-language:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguage = ctx.match[1];

    if (uiLanguage != null && isUILanguage(uiLanguage)) {
      ctx.session.selection = withInitialSession({ selection: ctx.session.selection, options: { uiLanguage } });
      const userId = ctx.update.callback_query.from.id

      await register({
        userId,
        uiLanguage,
        chatId: ctx.chat.id
      });

      askForRole(bot, ctx.chat.id, uiLanguage);
    } else {
      askToRestart(ctx);
    }
  });

  bot.action(/role:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguage = ctx.session.selection.uiLanguage;
    const role = ctx.match[1];

    if (role && uiLanguage != null && ctx.session.selection && isUILanguage(uiLanguage)) {
      ctx.session.selection.role = role;
      askForCategory(bot, ctx.chat.id, uiLanguage);
    } else {
      askToRestart(ctx);
    }
  });

  bot.action(/help-type:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const category = ctx.match[1];

    if (category && ctx.session.selection) {
      ctx.session.selection.category = category;
    } else {
      askToRestart(ctx);
    }
  });
};

export { initAnswerListeners, initialSelection };
