import fetch from 'node-fetch';
import { Answer, User } from '../shared/types';

export const register = async (data: { userId: number, chatId: number, uiLanguage: string }): Promise<User> => {
  const res = await fetch(`${process.env.BACKEND_HOST}/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.status !== 200) {
    throw new Error(`Error: Got status ${res.status} from backend: ${data}`);
  }

  const user = await res.json();

  console.log('Success: Registration stored:', data);

  return user as User; // @TODO validate
};

export const getUILanguages = async (): Promise<Answer[]> => {
  try {
    const response = await fetch(`${process.env.BACKEND_HOST}/ui_languages`);
    const uiLanguages = await response.json();

    return uiLanguages as Answer[]; // @TODO validate
  } catch (e) {
    console.error('Error: Cannot get UI languages:', e);
    return [];
  }
};

export const getRoles = async (uiLanguage: string): Promise<Answer[]> => {
  try {
    const response = await fetch(`${process.env.BACKEND_HOST}/languages/${uiLanguage}/roles`);
    const options = await response.json();

    return options as Answer[]; // @TODO validate
  } catch (e) {
    console.error('Error: Cannot get options:', e);
    return [];
  }
};

export const getCategories = async (uiLanguage: string, role: string): Promise<Answer[]> => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_HOST}/languages/${uiLanguage}/roles/${role}/help_types`
    );
    const options = await response.json();

    return options as Answer[]; // @TODO validate
  } catch (e) {
    console.error('Error: Cannot get help types:', e);
    return [];
  }
};
