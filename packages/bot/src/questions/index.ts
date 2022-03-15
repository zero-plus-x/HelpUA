import { Telegraf } from 'telegraf';
import { getCategories, getRoles, getUILanguages } from '../db';
import { THelpUAContext } from '../shared/types';

const askForLanguage = async (bot: Telegraf<THelpUAContext>, chatId: number) => {
  const uiLanguages = await getUILanguages();
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

const askForInfo = async (bot: Telegraf<THelpUAContext>, chatId: number, uiLanguage: string) => {
  const roles = await getRoles(uiLanguage);
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

const askForHelpType = async (
  bot: Telegraf<THelpUAContext>,
  chatId: number,
  uiLanguage: string,
  role: string
) => {
  const helpTypes = await getCategories(uiLanguage, role);
  const rows = helpTypes.map(helpType => ({
    text: helpType.label,
    callback_data: `help-type:${helpType.key}`
  }));
  bot.telegram.sendMessage(chatId, 'What do you need help with?', {
    reply_markup: {
      inline_keyboard: [rows]
    }
  });
};

const askToRestart = (ctx: THelpUAContext) => {
  ctx.reply('Cannot process response, try /start again');
};

export { askForLanguage, askForInfo, askForHelpType, askToRestart };
