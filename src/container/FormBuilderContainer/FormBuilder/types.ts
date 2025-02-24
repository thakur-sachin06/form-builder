export enum FormQuestionType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  EMAIL = 'email',
}

export enum NumberType {
  NUMBER = 'number',
  RANGE = 'range',
  YEAR = 'year',
}

export interface FormQuestion {
  questionTitle: string;
  questionType: FormQuestionType;
  isRequired: boolean;
  isHidden: boolean;
  helperText: string;
  numberType?: NumberType;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string | number;
  dropdownOptions?: string[];
  isSpecialCharsAllowed?: boolean;
  isDescription?: boolean;
}
