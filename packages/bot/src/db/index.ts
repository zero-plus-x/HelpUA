import fetch from 'node-fetch';
import { TSelection, TAnswer } from '../shared/types';

export const register = async (data: TSelection) => {
  try {
    const res = await fetch(`${process.env.BACKEND_HOST}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.status === 200) {
      const user = await res.json();

      console.log('Success: Registration stored:', data);

      return user;
    } else {
      console.log(`Error: Got status ${res.status} from backend:`, data);
      return null;
    }
  } catch (e) {
    console.error('Error: Cannot store registration:', data);
    return null;
  }
};

export const getUILanguages = async (): Promise<TAnswer[]> => {
  try {
    const response = await fetch(`${process.env.BACKEND_HOST}/ui_languages`);
    const uiLanguages = await response.json();

    return uiLanguages as TAnswer[]; // @TODO validate
  } catch (e) {
    console.error('Error: Cannot get UI languages:', e);
    return [];
  }
};

export const getRoles = async (uiLanguage: string): Promise<TAnswer[]> => {
  try {
    const response = await fetch(`${process.env.BACKEND_HOST}/languages/${uiLanguage}/roles`);
    const options = await response.json();

    return options as TAnswer[]; // @TODO validate
  } catch (e) {
    console.error('Error: Cannot get options:', e);
    return [];
  }
};

export const getCategories = async (uiLanguage: string, role: string): Promise<TAnswer[]> => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_HOST}/languages/${uiLanguage}/roles/${role}/help_types`
    );
    const options = await response.json();

    return options as TAnswer[]; // @TODO validate
  } catch (e) {
    console.error('Error: Cannot get help types:', e);
    return [];
  }
};
