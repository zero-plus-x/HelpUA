import { UILanguage, Category } from '@prisma/client';
import { Role } from '../types';

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
  [Category.URGENT_CARE]: {
    [UILanguage.ENGLISH]: 'Urgent help',
    [UILanguage.UKRAINIAN]: 'Невідкладна допомога',
    [UILanguage.RUSSIAN]: 'Срочная помощь',
  },
  [Category.TRANSPORTATION]: {
    [UILanguage.ENGLISH]: 'Transportation',
    [UILanguage.UKRAINIAN]: 'Перевезення',
    [UILanguage.RUSSIAN]: 'Транспорт',
  },
  [Category.LOCAL_INFORMATION]: {
    [UILanguage.ENGLISH]: 'Local information',
    [UILanguage.UKRAINIAN]: 'Місцева інформація',
    [UILanguage.RUSSIAN]: 'Местная информация',
  },
  [Category.ACCOMODATION]: {
    [UILanguage.ENGLISH]: 'Accommodation',
    [UILanguage.UKRAINIAN]: 'Проживання',
    [UILanguage.RUSSIAN]: 'Жилье',
  },
  [Category.MEDICAL_HELP]: {
    [UILanguage.ENGLISH]: 'Medical help',
    [UILanguage.UKRAINIAN]: 'Медична допомога',
    [UILanguage.RUSSIAN]: 'Медицинская помощь',
  },
}

const isSomeEnum = <T>(e: T) => (token: any): token is T[keyof T] =>  {
    return Object.values(e).includes(token as T[keyof T]);
}
export const isUILanguage = isSomeEnum(UILanguage)
export const isRole = isSomeEnum(Role)
export const isCategory = isSomeEnum(Category)
