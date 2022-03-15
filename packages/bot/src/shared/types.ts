import { Context } from 'telegraf';

export type TSelection = {
  uiLanguage: string | null;
  optionId: number | null;
  helpTypeId: number | null;
  userId: number | null;
  chatId: number | null;
};

export type TSession = {
  session: {
    selection: TSelection;
  };
};

export type THelpUAContext = Context & TSession;

export type TLanguage = {
  key: string;
  label: string;
}

export interface TRole {
  key: string;
  label: string;
}

export interface IHelpType {
  id: number;
  label: string;
}

export interface IUser {
  chatId: number;
  telegramUserId: number;
  uiLanguage: string;
  option: string;
  helpType: string;
}
