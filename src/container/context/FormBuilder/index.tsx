import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import { FormState, FormActionTypes, FormAction } from './types';
import { formReducer, initialState } from './reducer';
import { FormType } from '../../FormBuilderContainer/types';
import { saveToStorage } from '../../../api/storage';
import { FormQuestion } from '../../FormBuilderContainer/FormBuilder/types';

interface FormContextType extends FormState {
  updateForm: (formId: string, questions: FormQuestion[]) => Promise<void>;
  createNewForm: (form: FormType) => Promise<void>;
  updateFormTitle: (formId: string, title: string) => Promise<void>;
  handleFormSubmit: (formId: string) => Promise<void>;
  setSelectedForm: (formId: string) => void;
  dispatch: React.Dispatch<FormAction>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const updateForm = useCallback(
    async (formId: string, questions: FormQuestion[]) => {
      try {
        dispatch({
          type: FormActionTypes.UPDATE_FORM,
          payload: { formId, questions },
        });
        await saveToStorage('forms', state.forms);
      } catch (error) {
        console.error('Failed to update form:', error);
      }
    },
    [state.forms],
  );

  const createNewForm = useCallback(
    async (form: FormType) => {
      try {
        dispatch({ type: FormActionTypes.CREATE_FORM, payload: form });
        const updatedForms = [...state.forms, form];
        await saveToStorage('forms', updatedForms);
        dispatch({ type: FormActionTypes.SET_SELECTED_FORM, payload: form.id });
      } catch (error) {
        console.error('Failed to create form:', error);
      }
    },
    [state.forms],
  );

  const updateFormTitle = useCallback(
    async (formId: string, title: string) => {
      try {
        dispatch({
          type: FormActionTypes.UPDATE_FORM_TITLE,
          payload: { formId, title },
        });
        await saveToStorage('forms', state.forms);
      } catch (error) {
        console.error('Failed to update form title:', error);
      }
    },
    [state.forms],
  );

  const handleFormSubmit = useCallback(
    async (formId: string) => {
      try {
        dispatch({
          type: FormActionTypes.SET_SUBMITTING_FORM,
          payload: formId,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedForms = state.forms.map((form) =>
          form.id === formId ? { ...form, isSubmitted: true } : form,
        );
        await saveToStorage('forms', updatedForms);
        dispatch({ type: FormActionTypes.SUBMIT_FORM, payload: formId });
      } catch (error) {
        console.error('Failed to submit form:', error);
      } finally {
        dispatch({ type: FormActionTypes.SET_SUBMITTING_FORM, payload: null });
      }
    },
    [state.forms],
  );

  const setSelectedForm = useCallback((formId: string) => {
    dispatch({ type: FormActionTypes.SET_SELECTED_FORM, payload: formId });
  }, []);

  return (
    <FormContext.Provider
      value={{
        ...state,
        updateForm,
        createNewForm,
        updateFormTitle,
        handleFormSubmit,
        setSelectedForm,
        dispatch,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
