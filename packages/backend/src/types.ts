import {Offer, Request, User} from "@prisma/client";

export enum Role {
  HELPEE = 'HELPEE',
  HELPER = 'HELPER',
}

export enum UILanguage {
  ENGLISH = "ENGLISH",
  RUSSIAN = "RUSSIAN",
  UKRAINIAN = "UKRAINIAN",
}


export type Candidates = {request: Request, offers: (Offer & { user: User })[]}[]
