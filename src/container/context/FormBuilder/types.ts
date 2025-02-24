import { FormQuestion } from '../../FormBuilderContainer/FormBuilder/types';
import { FormType } from '../../FormBuilderContainer/types';

export interface FormState {
  forms: FormType[];
  selectedFormId: string | null;
  submittingFormId: string | null;
  selectedForm: FormType | null;
}

export enum FormActionTypes {
  INITIALIZE_FORMS = 'INITIALIZE_FORMS',
  UPDATE_FORM = 'UPDATE_FORM',
  CREATE_FORM = 'CREATE_FORM',
  UPDATE_FORM_TITLE = 'UPDATE_FORM_TITLE',
  SUBMIT_FORM = 'SUBMIT_FORM',
  SET_SELECTED_FORM = 'SET_SELECTED_FORM',
  SET_SUBMITTING_FORM = 'SET_SUBMITTING_FORM',
  SET_FORMS = 'SET_FORMS',
  UPDATE_FORM_RESPONSES = 'UPDATE_FORM_RESPONSES',
}

export type FormAction =
  | { type: FormActionTypes.INITIALIZE_FORMS; payload: FormType[] }
  | {
      type: FormActionTypes.UPDATE_FORM;
      payload: { formId: string; questions: FormQuestion[] };
    }
  | { type: FormActionTypes.CREATE_FORM; payload: FormType }
  | {
      type: FormActionTypes.UPDATE_FORM_TITLE;
      payload: { formId: string; title: string };
    }
  | { type: FormActionTypes.SUBMIT_FORM; payload: string }
  | { type: FormActionTypes.SET_SELECTED_FORM; payload: string }
  | { type: FormActionTypes.SET_FORMS; payload: FormType[] }
  | { type: FormActionTypes.SET_SUBMITTING_FORM; payload: string | null }
  | {
      type: FormActionTypes.UPDATE_FORM_RESPONSES;
      payload: {
        formId: string;
        responses: { [key: string]: unknown };
      };
    };
