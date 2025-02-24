import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styles from '../QuestionForm.module.css';
import { FormQuestion } from '../../types';

interface SelectFieldProps {
  question: FormQuestion;
  index: number;
  handleChange: (index: number, field: keyof FormQuestion, value: any) => void;
  isSubmitted?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  question,
  index,
  handleChange,
  isSubmitted = false,
}) => {
  return (
    <div className={styles.formGroup}>
      <div className={styles.rowContainer}>
        {[1, 2, 3, 4].map((optionNum) => (
          <div key={optionNum} className={styles.formGroup}>
            <label className={styles.label}>
              Option {optionNum}
              <input
                type="text"
                className={styles.input}
                placeholder="Enter option"
                disabled={isSubmitted}
                onChange={(e) => {
                  const options = [...(question.dropdownOptions || [])];
                  options[optionNum - 1] = e.target.value;
                  handleChange(index, 'dropdownOptions', options);
                }}
                value={question.dropdownOptions?.[optionNum - 1] || ''}
              />
            </label>
          </div>
        ))}
        <Button
          variant="contained"
          size="small"
          disabled={isSubmitted}
          onClick={() => {
            const options = [...(question.dropdownOptions || [])].filter(
              Boolean,
            );
            handleChange(index, 'dropdownOptions', options);
          }}
          sx={{ mt: 3.5 }}
        >
          <AddIcon />
        </Button>
      </div>
    </div>
  );
};

export default SelectField;
