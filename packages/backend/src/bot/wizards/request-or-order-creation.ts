import {Scenes} from "telegraf";
import {createOffer, createRequest} from "../../db";
import {ValidationError} from "../../error";
import {isCategory, isRole} from "../../translations";
import {Role} from "../../types";
import {getOfferCreatedReply, getRequestCreatedReply, getSelectCategoryReply} from "../replies";
import {HelpUAContext} from "../shared/types";


export const REQUEST_OR_ORDER_CREATION = 'REQUEST_OR_ORDER_CREATION'

export const requestOrOrderCreationScene = new Scenes.WizardScene<HelpUAContext>(REQUEST_OR_ORDER_CREATION,
  async (ctx) => {
    const uiLanguage = ctx.session.selection.uiLanguage;
    const role = (ctx as any).match[1] // @TODO find a way to remove typecast

    if (!role || !ctx.session.selection || !isRole(role)) {
      throw new ValidationError(`Validation failed on role ${role}`)
    }

    ctx.session.selection.role = role;
    const { text, extra } = getSelectCategoryReply(uiLanguage)
    ctx.reply(text, extra);
    ctx.wizard.next()
  },
  async (ctx: HelpUAContext) => {
    const category = (ctx.callbackQuery as any)?.data // https://github.com/telegraf/telegraf/issues/1471
    if (category == null || !isCategory(category)) {
      return new ValidationError('Wrong category')
    }
    const uiLanguage = ctx.session.selection.uiLanguage;
    ctx.session.selection.category = category // @TODO use wizard context

    const telegramUserId = ctx.callbackQuery?.from.id
    if (telegramUserId == null) {
      return new ValidationError('no telegramUsrId')
    }
    if (ctx.session.selection.role === Role.HELPER) {
      await createOffer(telegramUserId, ctx.session.selection)

      const { text, extra } = getOfferCreatedReply(uiLanguage)
      ctx.reply(text, extra)
    } else {
      await createRequest(telegramUserId, ctx.session.selection)

      const { text, extra } = getRequestCreatedReply(uiLanguage)
      ctx.reply(text, extra)
    }
    return ctx.scene.leave()
  }
)

