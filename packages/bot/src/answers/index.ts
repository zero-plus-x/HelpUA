import { Telegraf } from 'telegraf';
import { IUser, THelpUAContext, TSelection } from '../shared/types';
import { askForHelpType, askForInfo, askToRestart } from '../questions';
import { register } from '../db';

const initialSelection: TSelection = {
  uiLanguage: null,
  userId: null,
  chatId: null,
  optionId: null,
  helpTypeId: null
};

interface IWithDefaultSession {
  selection?: TSelection;
  options: Record<string, any>;
}

const withInitialSession = ({ selection, options }: IWithDefaultSession): TSelection => {
  return typeof selection === 'object' ? { ...selection, ...options } : { ...initialSelection, ...options };
};

const initAnswerListeners = (bot: Telegraf<THelpUAContext>) => {
  bot.action(/ui-language:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguage = ctx.match[1];

    if (uiLanguage != null) {
      ctx.session.selection = withInitialSession({ selection: ctx.session.selection, options: { uiLanguage } });
      ctx.session.selection.userId = ctx.update.callback_query.from.id;
      askForInfo(bot, ctx.chat.id, uiLanguage);
    } else {
      askToRestart(ctx);
    }
  });

  bot.action(/role:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguage = ctx.session.selection.uiLanguage;
    const optionId = parseInt(ctx.match[1]);

    if (optionId && uiLanguage != null && ctx.session.selection) {
      ctx.session.selection.optionId = optionId;
      askForHelpType(bot, ctx.chat.id, uiLanguage, optionId);
    } else {
      askToRestart(ctx);
    }
  });

  bot.action(/help-type:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const helpTypeId = parseInt(ctx.match[1]);

    if (helpTypeId && ctx.session.selection) {
      ctx.session.selection.helpTypeId = helpTypeId;
      const user = (await register(ctx.session.selection)) as IUser;

      ctx.reply(`Successfully registered user: ${JSON.stringify(user)}`);
    } else {
      askToRestart(ctx);
    }
  });
};

export { initAnswerListeners, initialSelection };
