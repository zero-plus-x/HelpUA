import {Category} from '@prisma/client';
import { Context } from 'telegraf';
import {Role, UILanguage} from '../../types';

export type Selection = {
  uiLanguage: UILanguage;
  role: Role | null;
  category: Category | null;
};


export type HelpUAContext = Context & {
  session: {
    selection: Selection;
  };
};


export type Answer = {
  key: string;
  label: string;
}
