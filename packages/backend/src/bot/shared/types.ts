import {Category, UILanguage} from '@prisma/client';
import { Context } from 'telegraf';
import {Role} from '../../translations';

export type Selection = {
  uiLanguage: UILanguage | null;
  role: Role | null;
  category: Category | null;
};

export type Session = {
  session: {
    selection: Selection;
  };
};

export type HelpUAContext = Context & Session;

export type Answer = {
  key: string;
  label: string;
}

export type User = {
  chatId: number;
  telegramUserId: number;
  uiLanguage: string;
}
