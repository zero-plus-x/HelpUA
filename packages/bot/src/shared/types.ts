import { Context } from 'telegraf';

type TSelection = {
  language: string | null;
  option: string | null;
  type: string | null;
  userId: number | null;
};

type TSession = {
  session: {
    selection: TSelection;
  };
};

type THelpUAContext = Context & TSession;

export { TSelection, THelpUAContext };
