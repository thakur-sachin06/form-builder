import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CircularProgress } from '@mui/material';
import React from 'react';
import { FormQuestion, FormQuestionType } from '../types';
import NumberField from './FieldRenderers/NumberField';
import SelectField from './FieldRenderers/SelectField';
import styles from './QuestionForm.module.css';
import QuestionTypeField from './FieldRenderers/QuestionType';

interface QuestionFormProps {
  question: FormQuestion;
  index: number;
  errors: { [key: string]: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (index: number, field: keyof FormQuestion, value: any) => void;
  handleOnFocus: (
    index: number,
    field: keyof FormQuestion,
    isRequired?: boolean,
  ) => void;
  isSaving?: boolean;
  isSubmitted?: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  index,
  errors,
  handleChange,
  handleOnFocus,
  isSaving = false,
  isSubmitted = false,
}) => {
  return (
    <>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Question title<span className={styles.required}>*</span>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="text"
              value={question.questionTitle}
              disabled={isSubmitted}
              placeholder="Enter question title"
              onChange={(e) =>
                handleChange(index, 'questionTitle', e.target.value)
              }
              onFocus={() => handleOnFocus(index, 'questionTitle', true)}
              required
            />
            {isSaving ? (
              <CircularProgress size={20} className={styles.inputLoader} />
            ) : (
              <CheckCircleIcon className={styles.successIcon} />
            )}
          </div>
          {errors['questionTitle'] && (
            <span className={styles.error}>{errors['questionTitle']}</span>
          )}
        </label>
      </div>

      <QuestionTypeField
        question={question}
        index={index}
        errors={errors}
        handleChange={handleChange}
        handleOnFocus={handleOnFocus}
        isSubmitted={isSubmitted}
      />

      {question.questionType === FormQuestionType.NUMBER && (
        <NumberField
          question={question}
          index={index}
          errors={errors}
          handleChange={handleChange}
          handleOnFocus={handleOnFocus}
          isSubmitted={isSubmitted}
        />
      )}

      {question.questionType === FormQuestionType.SELECT && (
        <SelectField
          question={question}
          index={index}
          handleChange={handleChange}
          isSubmitted={isSubmitted}
        />
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Default Value
          <input
            className={styles.input}
            type={
              question.questionType === FormQuestionType.NUMBER
                ? 'number'
                : 'text'
            }
            disabled={isSubmitted}
            value={question.defaultValue || ''}
            onChange={(e) =>
              handleChange(index, 'defaultValue', e.target.value)
            }
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Helper Text
          <input
            className={styles.input}
            type="text"
            disabled={isSubmitted}
            value={question.helperText}
            onChange={(e) => handleChange(index, 'helperText', e.target.value)}
          />
          <span className={styles.helperText}>Additional information</span>
        </label>
      </div>
    </>
  );
};

export default QuestionForm;
