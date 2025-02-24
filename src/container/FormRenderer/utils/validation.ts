import { isValidEmail, isValidYear } from '../../utils';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateNumber = (
  value: string,
  numberType: string,
  minValue?: number,
  maxValue?: number,
): ValidationResult => {
  if (numberType === 'range') {
    const numValue = Number(value);
    if (numValue < Number(minValue) || numValue > Number(maxValue)) {
      return {
        isValid: false,
        error: `Please set value between ${minValue} and ${maxValue}`,
      };
    }
  } else if (numberType === 'year') {
    if (!isValidYear(value)) {
      return {
        isValid: false,
        error: 'Please enter a valid year (1900-2099)',
      };
    }
  }
  return { isValid: true };
};

export const validateEmail = (value: string): ValidationResult => {
  if (!isValidEmail(value)) {
    return {
      isValid: false,
      error: 'Please enter valid email',
    };
  }
  return { isValid: true };
};
