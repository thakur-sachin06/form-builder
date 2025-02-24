import { FormState, FormAction, FormActionTypes } from './types';

export const initialState: FormState = {
  forms: [],
  selectedFormId: null,
  submittingFormId: null,
  selectedForm: null,
};

export const formReducer = (
  state: FormState,
  action: FormAction,
): FormState => {
  switch (action.type) {
    case FormActionTypes.SET_SELECTED_FORM: {
      const selectedForm = state.forms.find(
        (form) => form.id === action.payload,
      );
      return {
        ...state,
        selectedFormId: action.payload,
        selectedForm: selectedForm || null,
      };
    }
    case FormActionTypes.SET_FORMS:
      return {
        ...state,
        forms: action.payload,
      };
    case FormActionTypes.INITIALIZE_FORMS:
      return {
        ...state,
        forms: action.payload,
        selectedFormId: action.payload[0]?.id || null,
        selectedForm: action.payload[0] || null,
      };

    case FormActionTypes.UPDATE_FORM:
      return {
        ...state,
        forms: state.forms.map((form) =>
          form.id === action.payload.formId
            ? {
                ...form,
                questions: JSON.parse(JSON.stringify(action.payload.questions)),
              }
            : form,
        ),
      };

    case FormActionTypes.UPDATE_FORM_RESPONSES:
      return {
        ...state,
        forms: state.forms.map((form) =>
          form.id === action.payload.formId
            ? {
                ...form,
                responses: action.payload.responses,
              }
            : form,
        ),
        selectedForm:
          state.selectedFormId === action.payload.formId
            ? {
                ...state.selectedForm!,
                responses: action.payload.responses,
              }
            : state.selectedForm,
      };

    case FormActionTypes.CREATE_FORM:
      return {
        ...state,
        forms: [...state.forms, action.payload],
        selectedFormId: action.payload.id,
        selectedForm: action.payload,
      };

    case FormActionTypes.UPDATE_FORM_TITLE:
      return {
        ...state,
        forms: state.forms.map((form) =>
          form.id === action.payload.formId
            ? { ...form, title: action.payload.title }
            : form,
        ),
      };

    case FormActionTypes.SUBMIT_FORM: {
      const updatedForms = state.forms.map((form) =>
        form.id === action.payload ? { ...form, isSubmitted: true } : form,
      );
      const updatedSelectedForm = updatedForms.find(
        (form) => form.id === state.selectedFormId,
      );
      return {
        ...state,
        forms: updatedForms,
        selectedForm: updatedSelectedForm || state.selectedForm,
      };
    }
    case FormActionTypes.SET_SUBMITTING_FORM:
      return {
        ...state,
        submittingFormId: action.payload,
      };

    default:
      return state;
  }
};
