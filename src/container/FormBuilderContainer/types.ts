/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormQuestion } from './FormBuilder/types';

export interface FormType {
  id: string;
  title: string;
  questions: FormQuestion[];
  createdAt: string;
  isSubmitted: boolean;
  responses?: { [key: string]: any };
}
