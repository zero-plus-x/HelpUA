import { Telegraf } from 'telegraf';
import { IUser, THelpUAContext, TSelection } from '../shared/types';
import { askForHelpType, askForInfo, askToRestart } from '../questions';
import { register } from '../db';

const initialSelection: TSelection = {
  uiLanguageId: null,
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

    const uiLanguageId = parseInt(ctx.match[1]);

    if (uiLanguageId) {
      ctx.session.selection = withInitialSession({ selection: ctx.session.selection, options: { uiLanguageId } });
      ctx.session.selection.userId = ctx.update.callback_query.from.id;
      askForInfo(bot, ctx.chat.id, uiLanguageId);
    } else {
      askToRestart(ctx);
    }
  });

  bot.action(/option:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguageId = ctx.session.selection.uiLanguageId as number;
    const optionId = parseInt(ctx.match[1]);

    if (optionId && ctx.session.selection) {
      ctx.session.selection.optionId = optionId;
      askForHelpType(bot, ctx.chat.id, uiLanguageId, optionId);
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
