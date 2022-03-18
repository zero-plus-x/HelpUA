import { Scenes, Telegraf } from 'telegraf';
import { HelpUAContext, Selection } from './shared/types';
import { createMatch, createOffer, createRequest, register } from '../db';
import { isCategory, isRole, isUILanguage } from '../translations';
import { getNoUserNameErrorReply, getOfferCreatedReply, getRequestCreatedReply, getSelectCategoryReply, getSelectLanguageReply, getStartReply } from './replies';
import {Role, UILanguage} from '../types';
import {ValidationError} from '../error';
import {BaseScene, Stage} from 'telegraf/typings/scenes';

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
  const scene = new Scenes.WizardScene('REQUEST_OR_ORDER_CREATION',
    (ctx) => {
      ctx.reply('test')
      ctx.wizard.next()
    },
    (ctx) => {
      return ctx.scene.leave()
    }
  )

  const stage = new Stage([scene])
  // bot.use(stage.middleware());
  bot.action(/role:(.*)/, ctx => {
    if (!ctx || !ctx.chat) return;

    const uiLanguage = ctx.session.selection.uiLanguage;
    const role = ctx.match[1];

    if (!role || uiLanguage == null || !ctx.session.selection || !isUILanguage(uiLanguage) || !isRole(role)) {
      throw new ValidationError(`Validation failed on role ${role}`)
    }

    ctx.session.selection.role = role;

    const { text, extra } = getSelectCategoryReply(uiLanguage)
    ctx.reply(text, extra);
  });

  bot.action(/help-type:(.*)/, async ctx => {
    if (!ctx || !ctx.chat) return;

    const category = ctx.match[1];

    const uiLanguage = ctx.session.selection.uiLanguage;

    if (!category || !ctx.session.selection || !isCategory(category) || !uiLanguage) {
      throw new ValidationError("Validation failed on help-type")
    }

    ctx.session.selection.category = category;

    const telegramUserId = ctx.update.callback_query.from.id
    if (ctx.session.selection.role === Role.HELPER) {
      await createOffer(telegramUserId, ctx.session.selection)

      const { text, extra } = getOfferCreatedReply(uiLanguage)
      ctx.reply(text, extra)
    } else {
      await createRequest(telegramUserId, ctx.session.selection)

      const { text, extra } = getRequestCreatedReply(uiLanguage)
      ctx.reply(text, extra)
    }
  });


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
      ctx.telegram.sendMessage(requestUser.chatId, `We found someone who wants to help you, message them on: @${offerUser.telegramUsername}`)
      ctx.telegram.sendMessage(telegramUserId, 'We shared your username with them, expect a message soon')
    } catch (e) {
      ctx.telegram.sendMessage(telegramUserId, 'Someone else already offered their help')
    }
  });
};
