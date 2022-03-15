import {UILanguage} from '@prisma/client';
import { Telegraf } from 'telegraf';
import { getCategories, getRoles, getUILanguages } from '../db';
import { HelpUAContext } from '../shared/types';

export const askForLanguage = async (bot: Telegraf<HelpUAContext>, chatId: number) => {
  const uiLanguages = getUILanguages();
  const rows = uiLanguages.map(({ key, label }) => ({
    text: label,
    callback_data: `ui-language:${key}`
  }));

  bot.telegram.sendMessage(chatId, 'Please select a language', {
    reply_markup: {
      inline_keyboard: [rows]
    }
  });
};

export const askForRole = async (bot: Telegraf<HelpUAContext>, chatId: number, uiLanguage: UILanguage) => {
  const roles = getRoles(uiLanguage);
  const rows = roles.map(role => ({
    text: role.label,
    callback_data: `role:${role.key}`
  }));
  bot.telegram.sendMessage(chatId, 'Please select an option', {
    reply_markup: {
      inline_keyboard: [rows]
    }
  });
};

export const askForCategory = async (
  bot: Telegraf<HelpUAContext>,
  chatId: number,
  uiLanguage: UILanguage,
) => {
  const categories = getCategories(uiLanguage);
  const rows = categories.map(category => ({
    text: category.label,
    callback_data: `help-type:${category.key}`
  }));
  bot.telegram.sendMessage(chatId, 'What do you need help with?', {
    reply_markup: {
      inline_keyboard: [rows]
    }
  });
};

export const askToRestart = (ctx: HelpUAContext) => {
  ctx.reply('Cannot process response, try /start again');
};
