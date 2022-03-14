import { Context } from 'telegraf';

type TSelection = {
  uiLanguageId: number | null;
  optionId: number | null;
  helpTypeId: number | null;
  userId: number | null;
  chatId: number | null;
};

type TSession = {
  session: {
    selection: TSelection;
  };
};

type THelpUAContext = Context & TSession;

interface ILanguage {
  id: number;
  language: string;
}

interface IOption {
  id: number;
  label: string;
}

interface IHelpType {
  id: number;
  label: string;
}

export { TSelection, THelpUAContext, ILanguage, IOption, IHelpType };
