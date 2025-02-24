import React from 'react';
import FormStyles from '../../container/Form.module.css';
import {
  FormQuestion,
  FormQuestionType,
} from '../../container/FormBuilderContainer/FormBuilder/types';

interface FormFieldProps {
  question: FormQuestion;
  value: string;
  error?: string;
  onChange: (fieldName: string, value: string) => void;
  onBlur: (fieldName: string, value: string) => void;
  isSubmitted?: boolean;
  isSaving?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  question,
  value,
  error,
  onChange,
  onBlur,
  isSubmitted,
}) => {
  const fieldName = question.questionTitle;

  const commonProps = {
    required: question.isRequired,
    className: `${FormStyles.input} ${error ? FormStyles.error : ''}`,
    value: value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange(fieldName, e.target.value),
    onBlur: () => onBlur(fieldName, value || ''),
    disabled: isSubmitted,
  };

  switch (question.questionType) {
    case FormQuestionType.TEXT:
      return (
        <div>
          <label className={FormStyles.label}>
            {question.questionTitle}
            {question.isRequired && (
              <span className={FormStyles.required}>*</span>
            )}
          </label>
          {question.isDescription ? (
            <textarea
              {...commonProps}
              className={`${FormStyles.textarea} ${error ? FormStyles.error : ''}`}
              rows={4}
            />
          ) : (
            <input type="text" {...commonProps} />
          )}
          {question.helperText && (
            <div className={FormStyles.helperText}>{question.helperText}</div>
          )}
          {error && <div className={FormStyles.error}>{error}</div>}
        </div>
      );

    case FormQuestionType.EMAIL:
      return (
        <div>
          <label className={FormStyles.label}>
            {question.questionTitle}
            {question.isRequired && (
              <span className={FormStyles.required}>*</span>
            )}
          </label>
          <input
            type="email"
            {...commonProps}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
              e.target.setCustomValidity('Please enter a valid email address');
            }}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              e.currentTarget.setCustomValidity('');
            }}
          />
          {question.helperText && (
            <div className={FormStyles.helperText}>{question.helperText}</div>
          )}
          {error && <div className={FormStyles.error}>{error}</div>}
        </div>
      );

    case FormQuestionType.NUMBER:
      return (
        <div>
          <label className={FormStyles.label}>
            {question.questionTitle}
            {question.isRequired && (
              <span className={FormStyles.required}>*</span>
            )}
          </label>
          <input type="number" {...commonProps} />
          {question.helperText && (
            <div className={FormStyles.helperText}>{question.helperText}</div>
          )}
          {error && <div className={FormStyles.error}>{error}</div>}
        </div>
      );

    case FormQuestionType.SELECT:
      return (
        <div>
          <label className={FormStyles.label}>
            {question.questionTitle}
            {question.isRequired && (
              <span className={FormStyles.required}>*</span>
            )}
          </label>
          <select
            {...commonProps}
            className={FormStyles.select}
            value={value || question.defaultValue || ''}
          >
            <option value="">Select an option</option>
            {question.dropdownOptions?.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
          {question.helperText && (
            <div className={FormStyles.helperText}>{question.helperText}</div>
          )}
          {error && <div className={FormStyles.error}>{error}</div>}
        </div>
      );

    default:
      return null;
  }
};

export default FormField;
