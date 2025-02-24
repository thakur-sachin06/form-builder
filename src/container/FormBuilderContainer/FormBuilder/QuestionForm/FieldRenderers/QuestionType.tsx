import React from 'react';

import styles from '../QuestionForm.module.css';
import { FormQuestion, FormQuestionType } from '../../types';
import { questionTypeOptions } from '../constants';

interface QuestionTypeFieldProps {
  question: FormQuestion;
  index: number;
  errors: { [key: string]: string };
  handleChange: (index: number, field: keyof FormQuestion, value: any) => void;
  handleOnFocus: (
    index: number,
    field: keyof FormQuestion,
    isRequired?: boolean,
  ) => void;
  isSubmitted?: boolean;
}

const QuestionTypeField: React.FC<QuestionTypeFieldProps> = ({
  question,
  index,
  errors,
  handleChange,
  handleOnFocus,
  isSubmitted = false,
}) => {
  return (
    <div className={styles.formGroup}>
      <div className={styles.rowContainer}>
        <div className={styles.questionTypeContainer}>
          <label className={styles.label}>
            Question Type<span className={styles.required}>*</span>
            <select
              className={styles.select}
              value={question.questionType}
              required
              disabled={isSubmitted}
              onBlur={() => handleOnFocus(index, 'questionType')}
              onChange={(e) =>
                handleChange(
                  index,
                  'questionType',
                  e.target.value as FormQuestionType,
                )
              }
            >
              {questionTypeOptions.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors['questionType'] && (
              <span className={styles.error}>{errors['questionType']}</span>
            )}
          </label>
        </div>
      </div>

      <div className={styles.checkboxContainer}>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            checked={question.isRequired}
            disabled={isSubmitted}
            onChange={(e) =>
              handleChange(index, 'isRequired', e.target.checked)
            }
          />
          <span>Required</span>
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            checked={question.isHidden}
            disabled={isSubmitted}
            onChange={(e) => handleChange(index, 'isHidden', e.target.checked)}
          />
          <span>Hidden</span>
        </div>

        {question.questionType === FormQuestionType.TEXT && (
          <>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                checked={question.isSpecialCharsAllowed}
                disabled={isSubmitted}
                onChange={(e) =>
                  handleChange(index, 'isSpecialCharsAllowed', e.target.checked)
                }
              />
              <span>Allow Special Characters</span>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                checked={question.isDescription}
                disabled={isSubmitted}
                onChange={(e) =>
                  handleChange(index, 'isDescription', e.target.checked)
                }
              />
              <span>Description</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionTypeField;
