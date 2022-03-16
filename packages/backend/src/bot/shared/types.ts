import {Category, UILanguage} from '@prisma/client';
import { Context } from 'telegraf';
import {Role} from '../../types';

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
