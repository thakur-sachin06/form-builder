import { Alert, Button, Chip, debounce, Snackbar } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchFromStorage, saveToStorage } from '../../api/storage';
import { useFormContext } from '../context/FormBuilder';
import { FormActionTypes } from '../context/FormBuilder/types';
import { FormType } from '../FormBuilderContainer/types';
import Styles from './FormRenderer.module.css';

import LoadingOverlay from '../../components/Loader';
import FormField from './Renderer';

import { CircularProgress } from '@mui/material';
import { CheckCircleIcon } from 'lucide-react';
import { FormQuestionType } from '../FormBuilderContainer/FormBuilder/types';
import { hasSpecialCharacters } from '../utils';
import { validateEmail, validateNumber } from './utils/validation';

const FormRenderer: React.FC = () => {
  const { selectedForm, dispatch } = useFormContext();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [values, setValues] = useState<{ [key: string]: string }>(() => {
    return selectedForm?.responses || {};
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [savingField, setSavingField] = useState<boolean>(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveResponses = useCallback(
    debounce(async (responses: { [key: string]: string }) => {
      setSavingField(true);
      try {
        if (selectedForm?.id) {
          const forms = (await fetchFromStorage('forms')) as FormType[];
          const formIndex = forms?.findIndex(
            (f: FormType) => f.id === selectedForm.id,
          );

          if (formIndex !== -1) {
            const updatedForms = [...forms];
            updatedForms[formIndex] = {
              ...forms[formIndex],
              responses,
            };
            await saveToStorage('forms', updatedForms);
            dispatch({
              type: FormActionTypes.UPDATE_FORM_RESPONSES,
              payload: { formId: selectedForm.id, responses },
            });
          }
        }
      } catch (error) {
        console.error('Error saving responses:', error);
      } finally {
        setSavingField(false);
      }
    }, 500),
    [selectedForm?.id, dispatch],
  );

  const handleChange = (fieldName: string, value: string) => {
    const newValues = { ...values, [fieldName]: value };
    setValues(newValues);
    saveResponses(newValues);
    validateField(fieldName, value);
  };
  const validateField = (fieldName: string, value: string) => {
    const question = selectedForm?.questions.find(
      (q) => q.questionTitle === fieldName,
    );
    if (!question) return;

    const newErrors = { ...errors };
    if (question.isRequired && !value) {
      newErrors[fieldName] = 'This field is required';
    } else if (question.questionType === FormQuestionType.EMAIL && value) {
      const validationResult = validateEmail(value);
      if (!validationResult.isValid) {
        newErrors[fieldName] = validationResult.error || '';
      }
    } else if (
      question.questionType === FormQuestionType.TEXT &&
      value &&
      !question.isSpecialCharsAllowed
    ) {
      if (hasSpecialCharacters(value)) {
        newErrors[fieldName] = 'Special characters are not allowed';
      }
    } else if (question.questionType === FormQuestionType.NUMBER && value) {
      const validationResult = validateNumber(
        value,
        question.numberType || '',
        question.minValue,
        question.maxValue,
      );
      if (!validationResult.isValid) {
        newErrors[fieldName] = validationResult.error || '';
      }
    } else {
      delete newErrors[fieldName];
    }
    setErrors(newErrors);
  };

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    selectedForm?.questions.forEach((question) => {
      const value = values[question.questionTitle] || '';
      if (question.isRequired && !value) {
        newErrors[question.questionTitle] = 'Field is required';
      } else if (question.questionType === FormQuestionType.EMAIL && value) {
        const validationResult = validateEmail(value);
        if (!validationResult.isValid) {
          newErrors[question.questionTitle] = validationResult.error || '';
        }
      } else if (
        question.questionType === FormQuestionType.TEXT &&
        value &&
        !question.isSpecialCharsAllowed
      ) {
        if (hasSpecialCharacters(value)) {
          newErrors[question.questionTitle] =
            'Special characters are not allowed';
        }
      } else if (question.questionType === FormQuestionType.NUMBER && value) {
        const validationResult = validateNumber(
          value,
          question.numberType || '',
          question.minValue,
          question.maxValue,
        );
        if (!validationResult.isValid) {
          newErrors[question.questionTitle] = validationResult.error || '';
        }
      }
    });
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, [selectedForm?.questions, values]);

  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        try {
          setIsSubmitting(true);
          if (selectedForm?.id) {
            const forms = (await fetchFromStorage('forms')) as FormType[];
            const formIndex = forms?.findIndex(
              (f: FormType) => f.id === selectedForm.id,
            );

            if (formIndex !== -1) {
              const updatedForms = [...forms];
              const updatedResponses = { ...values, isSubmitted: true };
              updatedForms[formIndex] = {
                ...forms[formIndex],
                responses: updatedResponses,
              };
              await saveToStorage('forms', updatedForms);
              dispatch({
                type: FormActionTypes.UPDATE_FORM_RESPONSES,
                payload: {
                  formId: selectedForm.id,
                  responses: updatedResponses,
                },
              });
              setSnackbarState({
                open: true,
                message: 'Your response is submitted successfully.',
                severity: 'success',
              });
            }
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          setSnackbarState({
            open: true,
            message: 'Failed to submit form. Please try again.',
            severity: 'error',
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [dispatch, selectedForm?.id, validateForm, values],
  );

  return (
    <div className={Styles.formContainer}>
      {isSubmitting && <LoadingOverlay />}
      <div className={Styles.headerRow}>
        <h2 className={Styles.title}>{selectedForm?.title}</h2>
        {savingField ? (
          <CircularProgress size={16} sx={{ ml: 1, verticalAlign: 'middle' }} />
        ) : (
          <CheckCircleIcon className={Styles.successIcon} />
        )}
        <Chip
          label={selectedForm?.responses?.isSubmitted ? 'Submitted' : 'Pending'}
          color={selectedForm?.responses?.isSubmitted ? 'success' : 'warning'}
          variant="filled"
          size="small"
          sx={{ ml: 'auto' }}
        />
      </div>
      <form onSubmit={handleSubmit}>
        {selectedForm?.questions.map((question, index) => (
          <div key={index} className={Styles.formField}>
            <FormField
              question={question}
              value={values[question.questionTitle] || ''}
              error={errors[question.questionTitle]}
              onChange={handleChange}
              onBlur={(fieldName, value) => validateField(fieldName, value)}
              isSubmitted={selectedForm?.responses?.isSubmitted}
            />
          </div>
        ))}
        <Button
          variant="contained"
          color="success"
          type="submit"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={
            !isFormValid || isSubmitting || selectedForm?.responses?.isSubmitted
          }
        >
          {selectedForm?.responses?.isSubmitted ? 'Submitted' : 'Submit'}
        </Button>
      </form>
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FormRenderer;
