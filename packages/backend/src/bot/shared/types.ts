import {Category} from '@prisma/client';
import { Context, Scenes } from 'telegraf';
import {Role, UILanguage} from '../../types';

export type Selection = {
  uiLanguage: UILanguage;
  role: Role | null;
  category: Category | null;
};


type Session = Scenes.WizardSession<Scenes.WizardSessionData> & {
  selection: Selection,
}

export type HelpUAContext = Context & {
  session: Session
  scene: Scenes.SceneContextScene<HelpUAContext, Scenes.WizardSessionData>
  wizard: Scenes.WizardContextWizard<HelpUAContext>
};


export type Answer = {
  key: string;
  label: string;
}
