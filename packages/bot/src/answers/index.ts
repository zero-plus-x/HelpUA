import { Telegraf } from 'telegraf';
import { THelpUAContext } from '../shared/types';
import { askForHelp, askForInfo, askToProvideHelp, askToRestart } from '../questions';
import { register } from '../db';
import fetch from 'node-fetch';

const initAnswerListeners = (bot: Telegraf<THelpUAContext>) => {
  bot.action(/language:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const language = ctx.match[1];

    if (language) {
      ctx.session.selection.language = language;
      ctx.session.selection.userId = ctx.update.callback_query.from.id;
      askForInfo(bot, ctx.chat.id);
    } else {
      askToRestart(ctx);
    }
  });

  bot.action(/option:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const option = ctx.match[1];

    if (option) {
      ctx.session.selection.option = option;
      option === 'need-help' ? askForHelp(bot, ctx.chat.id) : askToProvideHelp(bot, ctx.chat.id);
    } else {
      askToRestart(ctx);
    }
  });

  bot.action(/help-type:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const helpType = ctx.match[1];

    if (helpType) {
      ctx.session.selection.type = helpType;
      register(ctx.session.selection);
      ctx.reply(`${helpType}: ${JSON.stringify(ctx.session.selection)}`);
    } else {
      askToRestart(ctx);
    }
  });
};

export { initAnswerListeners };
