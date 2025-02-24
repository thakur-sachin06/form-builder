import { FormQuestionType, NumberType } from '../types';

export const questionTypeOptions = [
  { label: 'Text', value: FormQuestionType.TEXT },
  { label: 'Number', value: FormQuestionType.NUMBER },
  { label: 'Select', value: FormQuestionType.SELECT },
  { label: 'Email', value: FormQuestionType.EMAIL },
];

export const numberTypeOptions = [
  { label: 'Year', value: NumberType.YEAR },
  { label: 'Range', value: NumberType.RANGE },
  { label: 'Number', value: NumberType.NUMBER },
];
