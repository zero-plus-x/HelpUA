import { Context } from 'telegraf';

export type TSelection = {
  uiLanguage: string | null;
  role: string | null;
  category: string | null;
  userId: number | null;
  chatId: number | null;
};

export type TSession = {
  session: {
    selection: TSelection;
  };
};

export type THelpUAContext = Context & TSession;

export type TAnswer = {
  key: string;
  label: string;
}

export interface IUser {
  chatId: number;
  telegramUserId: number;
  uiLanguage: string;
  option: string;
  helpType: string;
}
