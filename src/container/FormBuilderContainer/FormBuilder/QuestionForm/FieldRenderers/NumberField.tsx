import React from 'react';
import styles from '../QuestionForm.module.css';
import { FormQuestion, NumberType } from '../../types';
import { numberTypeOptions } from '../constants';

interface NumberFieldProps {
  question: FormQuestion;
  index: number;
  errors: { [key: string]: string };
  handleChange: (
    index: number,
    field: keyof FormQuestion,
    value: unknown,
  ) => void;
  handleOnFocus: (
    index: number,
    field: keyof FormQuestion,
    isRequired?: boolean,
  ) => void;
  isSubmitted?: boolean;
}

const NumberField: React.FC<NumberFieldProps> = ({
  question,
  index,
  errors,
  handleChange,
  handleOnFocus,
  isSubmitted = false,
}) => {
  return (
    <div className={styles.formGroup}>
      <div>
        <label className={styles.label}>
          Number Type<span className={styles.required}>*</span>
          <select
            value={question.numberType}
            required
            disabled={isSubmitted}
            onBlur={() => handleOnFocus(index, 'numberType')}
            onChange={(e) => handleChange(index, 'numberType', e.target.value)}
            className={styles.select}
          >
            {numberTypeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors[`numberType_${index}`] && (
            <span className={styles.error}>
              {errors[`numberType_${index}`]}
            </span>
          )}
        </label>

        {question.numberType === NumberType.RANGE && (
          <div className={styles.rowContainer}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Min Value
                <input
                  type="number"
                  className={styles.input}
                  value={question.minValue || ''}
                  disabled={isSubmitted}
                  onChange={(e) =>
                    handleChange(index, 'minValue', e.target.value)
                  }
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Max Value
                <input
                  type="number"
                  className={styles.input}
                  value={question.maxValue || ''}
                  disabled={isSubmitted}
                  onChange={(e) =>
                    handleChange(index, 'maxValue', e.target.value)
                  }
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Default Value
                <input
                  type="number"
                  className={styles.input}
                  value={question.defaultValue || ''}
                  disabled={isSubmitted}
                  onChange={(e) =>
                    handleChange(index, 'defaultValue', e.target.value)
                  }
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberField;
