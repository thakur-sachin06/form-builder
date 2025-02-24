import React, { useCallback, useState, useMemo } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  debounce,
  Snackbar,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

import QuestionForm from './QuestionForm';
import { FormQuestion, FormQuestionType } from './types';

import styles from './FormBuilder.module.css';
import { useFormContext } from '../../context/FormBuilder';
import { FormActionTypes } from '../../context/FormBuilder/types';
import { saveToStorage } from '../../../api/storage';

interface Errors {
  [key: string]: string;
}

interface FormBuilderProps {
  isSubmitted?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ isSubmitted }) => {
  const { selectedForm, updateForm, dispatch, submittingFormId, forms } =
    useFormContext();
  const [questionsList, setQuestionsList] = useState<FormQuestion[]>(
    selectedForm?.questions || [],
  );
  const [errors, setErrors] = useState<Errors>({});
  const [expandedPanel, setExpandedPanel] = useState<number | false>(
    selectedForm?.questions.length === 1 ? 0 : false,
  );
  const [savingStates, setSavingStates] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleCloseSnackbar = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  const validateQuestion = useMemo(
    () =>
      (question: FormQuestion): string[] => {
        const errors: string[] = [];
        if (!question.questionTitle.trim()) {
          errors.push('Question title is required');
        }
        if (!question.questionType) {
          errors.push('Question type is required');
        }
        if (
          question.questionType === FormQuestionType.NUMBER &&
          !question.numberType
        ) {
          errors.push('Number type is required');
        }
        return errors;
      },
    [],
  );

  const handleFormSubmit = useCallback(
    async (formId: string) => {
      try {
        dispatch({
          type: FormActionTypes.SET_SUBMITTING_FORM,
          payload: formId,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedForms = forms.map((form) =>
          form.id === formId ? { ...form, isSubmitted: true } : form,
        );
        await saveToStorage('forms', updatedForms);
        setSnackbarState({
          open: true,
          message: 'Form is submitted successfully.',
          severity: 'success',
        });
        dispatch({ type: FormActionTypes.SUBMIT_FORM, payload: formId });
      } catch (error) {
        console.error('Failed to submit form:', error);
        setSnackbarState({
          open: true,
          message: 'Failed to submit form. Please try again.',
          severity: 'error',
        });
      } finally {
        dispatch({ type: FormActionTypes.SET_SUBMITTING_FORM, payload: null });
      }
    },
    [dispatch, forms],
  );

  const handleSubmit = useCallback(() => {
    const allValidationErrors = questionsList.map(validateQuestion);
    const hasErrors = allValidationErrors.some((errors) => errors.length > 0);

    if (hasErrors) {
      const newErrors: Errors = {};
      allValidationErrors.forEach((errors, index) => {
        if (errors.length > 0) {
          newErrors[`question_${index}`] = errors.join(', ');
        }
      });
      setErrors(newErrors);
      return;
    }
    if (selectedForm) {
      handleFormSubmit(selectedForm.id);
    }
  }, [questionsList, validateQuestion, selectedForm, handleFormSubmit]);

  const debouncedSave = useMemo(
    () =>
      debounce((questions: FormQuestion[]) => {
        if (selectedForm) {
          updateForm(selectedForm.id, questions);
        }
      }, 500),
    [selectedForm, updateForm],
  );

  const saveQuestion = useCallback(
    async (index: number, question: FormQuestion) => {
      setSavingStates((prev) => ({ ...prev, [index]: true }));
      try {
        const validationErrors = validateQuestion(question);

        setQuestionsList((prevList) => {
          const updatedQuestions = [...prevList];
          updatedQuestions[index] = question;
          if (validationErrors.length === 0) {
            debouncedSave(updatedQuestions);
          }
          return updatedQuestions;
        });

        if (validationErrors.length > 0) {
          setErrors((prev) => ({
            ...prev,
            [`question_${index}`]: validationErrors.join(', '),
          }));
        }
      } finally {
        setTimeout(() => {
          setSavingStates((prev) => ({ ...prev, [index]: false }));
        }, 300);
      }
    },
    [validateQuestion, debouncedSave],
  );

  const handleChange = useCallback(
    (index: number, field: keyof FormQuestion, value: any) => {
      const updatedQuestion = {
        ...questionsList[index],
        [field]: value,
      };
      setErrors((prev) => ({
        ...prev,
        [`question_${index}`]: '',
        [field]: '',
      }));

      saveQuestion(index, updatedQuestion);
    },
    [questionsList, saveQuestion],
  );

  const handleOnFocus = useCallback(
    (index: number, field: keyof FormQuestion, isRequired = false) => {
      const question = questionsList[index];
      const value = question[field];

      let fieldError = '';
      if (field === 'questionTitle' && isRequired && !value?.trim()) {
        fieldError = 'Question Title is required';
      } else if (field === 'questionType' && !value) {
        fieldError = 'Question Type is required';
      } else if (
        field === 'numberType' &&
        question.questionType === FormQuestionType.NUMBER &&
        !value
      ) {
        fieldError = 'Number Type is required';
      }

      setErrors((prev) => ({
        ...prev,
        [field]: fieldError,
        [`question_${index}`]: fieldError
          ? fieldError
          : prev[`question_${index}`],
      }));
    },
    [questionsList],
  );

  const areAllQuestionsValid = useMemo(
    () =>
      questionsList.every((question) => {
        return validateQuestion(question).length === 0;
      }),
    [questionsList, validateQuestion],
  );

  const handleDeleteQuestion = useCallback(
    (indexToDelete: number) => {
      if (indexToDelete === 0) return;
      setQuestionsList((prevList) => {
        const updatedQuestions = prevList.filter(
          (_, index) => index !== indexToDelete,
        );
        debouncedSave(updatedQuestions);
        return updatedQuestions;
      });
    },
    [debouncedSave],
  );

  const onAddQuestion = useCallback(() => {
    const newQuestion: FormQuestion = {
      questionTitle: '',
      questionType: FormQuestionType.TEXT,
      isRequired: false,
      isHidden: false,
      helperText: '',
    };

    setQuestionsList((prev) => [...prev, newQuestion]);
    setExpandedPanel(questionsList.length);
  }, [questionsList.length]);

  const handleAccordionChange = useCallback(
    (index: number) => {
      setExpandedPanel(expandedPanel === index ? false : index);
    },
    [expandedPanel],
  );

  const renderAccordionTitle = useCallback(
    (question: FormQuestion, index: number) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontWeight: 'bold' }}>
          {question.questionTitle.trim()
            ? `Q${index + 1}:${question.questionTitle}`
            : `Question ${index + 1}`}
        </Typography>
        {index !== 0 && !selectedForm?.responses?.isSubmitted && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteQuestion(index);
            }}
            sx={{
              opacity: isSubmitted ? 0.5 : 1,
              cursor: isSubmitted ? 'not-allowed' : 'pointer',
            }}
            disabled={isSubmitted}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        )}
      </Box>
    ),
    [handleDeleteQuestion, isSubmitted, selectedForm?.responses?.isSubmitted],
  );

  return (
    <div className={styles.formBuilder}>
      {questionsList.map((question, index) => (
        <Accordion
          key={index}
          className={styles.accordion}
          expanded={expandedPanel === index}
          onChange={() => handleAccordionChange(index)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={styles.accordionSummary}
          >
            {renderAccordionTitle(question, index)}
          </AccordionSummary>
          <AccordionDetails className={styles.accordionDetails}>
            <QuestionForm
              question={question}
              index={index}
              errors={errors}
              handleChange={handleChange}
              handleOnFocus={handleOnFocus}
              isSaving={savingStates[index]}
              isSubmitted={isSubmitted}
            />
          </AccordionDetails>
        </Accordion>
      ))}
      <div>
        <Button
          variant="contained"
          color="success"
          disabled={
            !areAllQuestionsValid ||
            isSubmitted ||
            submittingFormId === selectedForm?.id
          }
          onClick={handleSubmit}
        >
          {isSubmitted
            ? 'Submitted'
            : submittingFormId === selectedForm?.id
              ? 'Submitting...'
              : 'Submit Form'}
        </Button>
        {!isSubmitted && (
          <Button
            variant="contained"
            disabled={
              !areAllQuestionsValid || submittingFormId === selectedForm?.id
            }
            onClick={onAddQuestion}
            sx={{ ml: 2 }}
          >
            Add Question
          </Button>
        )}
      </div>
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

export default React.memo(FormBuilder);
