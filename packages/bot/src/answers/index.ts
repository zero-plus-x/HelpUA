import { Telegraf } from 'telegraf';
import { THelpUAContext, TSelection } from '../shared/types';
import { askForHelp, askForInfo, askToProvideHelp, askToRestart } from '../questions';
import { register } from '../db';

const initialSelection: TSelection = {
  language: null,
  userId: null,
  option: null,
  helpType: null
};

interface IWithDefaultSession {
  selection?: TSelection;
  options: Record<string, any>;
}

const withInitialSession = ({ selection, options }: IWithDefaultSession): TSelection => {
  return typeof selection === 'object' ? { ...selection, ...options } : { ...initialSelection, ...options };
};

const initAnswerListeners = (bot: Telegraf<THelpUAContext>) => {
  bot.action(/language:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const language = ctx.match[1];

    if (language) {
      ctx.session.selection = withInitialSession({ selection: ctx.session.selection, options: { language } });
      ctx.session.selection.userId = ctx.update.callback_query.from.id;
      askForInfo(bot, ctx.chat.id);
    } else {
      askToRestart(ctx);
    }
  });

  bot.action(/option:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const option = ctx.match[1];

    if (option && ctx.session.selection) {
      ctx.session.selection.option = option;
      option === 'need-help' ? askForHelp(bot, ctx.chat.id) : askToProvideHelp(bot, ctx.chat.id);
    } else {
      askToRestart(ctx);
    }
  });

  bot.action(/help-type:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const helpType = ctx.match[1];

    if (helpType && ctx.session.selection) {
      ctx.session.selection.helpType = helpType;
      register(ctx.session.selection);
      ctx.reply(`${helpType}: ${JSON.stringify(ctx.session.selection)}`);
    } else {
      askToRestart(ctx);
    }
  });
};

export { initAnswerListeners, initialSelection };
