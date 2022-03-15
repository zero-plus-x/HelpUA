import { Context } from 'telegraf';

export type Selection = {
  uiLanguage: string | null;
  role: string | null;
  category: string | null;
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
