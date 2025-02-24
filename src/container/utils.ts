import { v4 as uuidv4 } from 'uuid';
import {
  FormQuestionType,
  NumberType,
} from './FormBuilderContainer/FormBuilder/types';

export const createDefaultQuestion = () => ({
  questionTitle: '',
  questionType: FormQuestionType.TEXT,
  isRequired: false,
  isHidden: false,
  helperText: '',
  numberType: NumberType.YEAR,
});

export const createDefaultForm = () => ({
  id: uuidv4(),
  title: 'Form 1',
  questions: [createDefaultQuestion()],
  createdAt: new Date().toISOString(),
  isSubmitted: false,
});

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const SPECIAL_CHARACTERS_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
export const YEAR_REGEX = /^(19|20)\d{2}$/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const hasSpecialCharacters = (text: string): boolean => {
  return SPECIAL_CHARACTERS_REGEX.test(text);
};

export const isValidYear = (value: string): boolean => {
  return YEAR_REGEX.test(value);
};
