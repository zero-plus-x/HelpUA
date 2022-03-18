import { Category } from '@prisma/client';
import { Role, UILanguage } from '../types';

export const BotCategoryQuestion = {
  [UILanguage.ENGLISH]: 'What category?',
  [UILanguage.UKRAINIAN]: 'Яка категорія?',
  [UILanguage.RUSSIAN]: 'Какая категория?',
}

export const BotOfferCreatedReply = {
  [UILanguage.ENGLISH]: 'We will get back to you when we find who you can help',
  [UILanguage.UKRAINIAN]: 'Ми повернемося до вас, коли знайдемо, кому ви можете допомогти',
  [UILanguage.RUSSIAN]: 'Мы свяжемся с вами, когда найдем, кому вы можете помочь',
}

export const BotRequestCreatedReply = {
  [UILanguage.ENGLISH]: 'We will try to find help as soon as possible',
  [UILanguage.UKRAINIAN]: 'Ми постараємося знайти допомогу якомога швидше',
  [UILanguage.RUSSIAN]: 'Мы постараемся найти помощь как можно скорее',
}

export const BotNoUserNameErrorReply = {
  [UILanguage.ENGLISH]: 'In order to use this bot you need to have a username. You can add it in the settings.',
  [UILanguage.UKRAINIAN]: 'Щоб користуватися цим ботом, потрібно мати ім’я користувача. Ви можете додати його в налаштуваннях.',
  [UILanguage.RUSSIAN]: 'Чтобы использовать этого бота, у вас должно быть имя пользователя. Вы можете добавить его в настройках.',
}

export const UILanguageLabels = {
  [UILanguage.ENGLISH]: 'English',
  [UILanguage.UKRAINIAN]: 'Украї́нська мо́ва',
  [UILanguage.RUSSIAN]: 'Русский язык',
}

export const RoleTranslations = {
  [Role.HELPER]: {
    [UILanguage.ENGLISH]: 'I want to help',
    [UILanguage.UKRAINIAN]: 'Я можу допомогти',
    [UILanguage.RUSSIAN]: 'Я могу помочь',
  },
  [Role.HELPEE]: {
    [UILanguage.ENGLISH]: 'I need help',
    [UILanguage.UKRAINIAN]: 'Мені потрібна допомога',
    [UILanguage.RUSSIAN]: 'Мне нужна помощь',
  }
}

export const CategoryTranslations = {
  [Category.LOCAL_INFORMATION]: {
    [UILanguage.ENGLISH]: 'Local information',
    [UILanguage.UKRAINIAN]: 'Місцева інформація',
    [UILanguage.RUSSIAN]: 'Местная информация',
  },
  [Category.TEXT_TRANSLATION]: {
    [UILanguage.ENGLISH]: 'Text translation',
    [UILanguage.UKRAINIAN]: 'Переклад тексту',
    [UILanguage.RUSSIAN]: 'Перевод текста',
  },
}

const isSomeEnum = <T>(e: T) => (token: any): token is T[keyof T] =>  {
    return Object.values(e).includes(token as T[keyof T]);
}
export const isUILanguage = isSomeEnum(UILanguage)
export const isRole = isSomeEnum(Role)
export const isCategory = isSomeEnum(Category)
