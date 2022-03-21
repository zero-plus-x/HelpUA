import { Scenes, Telegraf } from 'telegraf';
import { HelpUAContext, Selection } from './shared/types';
import { createMatch, register } from '../db';
import { isUILanguage } from '../translations';
import { getNoUserNameErrorReply, getSelectLanguageReply, getStartReply } from './replies';
import {UILanguage} from '../types';
import {ValidationError} from '../error';
import {requestOrOrderCreationScene, REQUEST_OR_ORDER_CREATION} from './wizards/request-or-order-creation';

const initialSelection: Selection = {
  uiLanguage: UILanguage.ENGLISH,
  role: null,
  category: null
};

const getRestartMessage = () => {
  return 'Cannot process response, try /start again';
};

const getInitialSelection = (overrides?: Selection) => {
  return {...initialSelection, ...overrides}
}

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
      const { text, extra } = getNoUserNameErrorReply(UILanguage.ENGLISH);
      ctx.reply(text, extra)
      return
    }
    ctx.session.selection = getInitialSelection(ctx.session.selection);

    const telegramUserId = ctx.update.message.from.id

    await register({
      telegramUserId,
      chatId: ctx.chat.id
    });

    const { text, extra } = getStartReply(ctx.session.selection.uiLanguage)
    ctx.reply(text, extra)
  });

  bot.action('change-language', async ctx => {
    const { text, extra } = getSelectLanguageReply()
    ctx.reply(text, extra)
  });

  bot.action(/ui-language:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguage = ctx.match[1];
    if (uiLanguage == null || !isUILanguage(uiLanguage)) {
      throw new ValidationError("Validation failed on ui-language")
    }

    ctx.session.selection.uiLanguage = uiLanguage;


    const { text, extra } = getStartReply(uiLanguage)
    ctx.reply(text, extra);
  });

  const stage = new Scenes.Stage<HelpUAContext>([requestOrOrderCreationScene])
  bot.use(stage.middleware());
  bot.action(/role:(.*)/, Scenes.Stage.enter<HelpUAContext>(REQUEST_OR_ORDER_CREATION))

  bot.action(/match:(.*):(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const offerId = parseInt(ctx.match[1], 10);
    const requestId = parseInt(ctx.match[2], 10);
    const telegramUserId = ctx.update.callback_query.from.id

    if (!offerId || !requestId) {
      throw new ValidationError("Validation failed on match")
    }

    try {
      const { requestUser, offerUser } = await createMatch(offerId, requestId, telegramUserId)
      ctx.telegram.sendMessage(requestUser.chatId, `We found someone who wants to help you, we will forward their messages to you, you can stop anytime, just type /stop`)
      ctx.telegram.sendMessage(telegramUserId, 'The chat has started, say hi')
    } catch (e) {
      ctx.telegram.sendMessage(telegramUserId, 'Someone else already offered their help')
    }
  });

  // next: change registration so user has the offer or request in the same table, and matchedUserId as a reference.
  bot.on('text', ctx => ctx.reply(ctx.message.text))
};
