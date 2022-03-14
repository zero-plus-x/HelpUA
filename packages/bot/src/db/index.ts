import fetch from 'node-fetch';
import { TSelection } from '../shared/types';

const register = async (data: TSelection): Promise<boolean> => {
  try {
    const res = await fetch(`${process.env.BACKEND_HOST}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.status === 200) {
      console.log('Success: Registration stored:', data);
      return true;
    } else {
      console.log(`Error: Got status ${res.status} from backend:`, data);
      return false;
    }
  } catch (e) {
    console.error('Error: Cannot store registration:', data);
    return false;
  }
};

const getUILanguages = async () => {
  try {
    const response = await fetch(`${process.env.BACKEND_HOST}/ui_languages`);
    const uiLanguages = await response.json();

    return uiLanguages;
  } catch (e) {
    console.error('Error: Cannot get UI languages:', e);
    return [];
  }
};

const getOptions = async (uiLanguageId: number) => {
  try {
    const response = await fetch(`${process.env.BACKEND_HOST}/languages/${uiLanguageId}/options`);
    const options = await response.json();

    return options;
  } catch (e) {
    console.error('Error: Cannot get options:', e);
    return [];
  }
};

const getHelpTypes = async (uiLanguageId: number, optionId: number) => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_HOST}/languages/${uiLanguageId}/options/${optionId}/help_types`
    );
    const options = await response.json();

    return options;
  } catch (e) {
    console.error('Error: Cannot get help types:', e);
    return [];
  }
};

export { register, getUILanguages, getOptions, getHelpTypes };
