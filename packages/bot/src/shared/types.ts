import { Context } from 'telegraf';

type TSelection = {
  language: string | null;
  option: string | null;
  helpType: string | null;
  userId: number | null;
  chatId: number | null;
};

type TSession = {
  session: {
    selection: TSelection;
  };
};

type THelpUAContext = Context & TSession;

export { TSelection, THelpUAContext };
