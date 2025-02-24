/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  Grid,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormCard from '../../components/FormCard';
import { useFormContext } from '../context/FormBuilder';
import FormBuilder from './FormBuilder';
import { FormQuestionType, NumberType } from './FormBuilder/types';
import { FormType } from './types';
import { FormActionTypes } from '../context/FormBuilder/types';
import { fetchFromStorage } from '../../api/storage';
import LoadingOverlay from '../../components/Loader';
import FormRenderer from '../FormRenderer';
import { InfoOutlined } from '@mui/icons-material';

const createDefaultQuestion = () => ({
  questionTitle: '',
  questionType: FormQuestionType.TEXT,
  isRequired: false,
  isHidden: false,
  helperText: '',
  numberType: NumberType.YEAR,
});

const createNewFormData = (formCount: number): FormType => ({
  id: uuidv4(),
  title: `Form ${formCount + 1}`,
  questions: [createDefaultQuestion()],
  createdAt: new Date().toISOString(),
  isSubmitted: false,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </div>
  );
}

const FormBuilderContainer: React.FC = () => {
  const {
    forms,
    selectedForm,
    submittingFormId,
    createNewForm: contextCreateNewForm,
    updateFormTitle: contextUpdateFormTitle,
    setSelectedForm,
    dispatch,
  } = useFormContext();

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [isInitializing, setIsInitializing] = useState(true);

  const initializeForms = useCallback(async () => {
    try {
      setIsInitializing(true);
      const savedForms = await fetchFromStorage<FormType[]>('forms');
      if (savedForms?.length) {
        if (savedForms) {
          dispatch({ type: FormActionTypes.SET_FORMS, payload: savedForms });
          setSelectedForm(savedForms[0].id);
        }
      } else {
        const defaultForm = createNewFormData(0);
        await contextCreateNewForm(defaultForm);
      }
    } catch (error) {
      console.error('Failed to initialize forms:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [contextCreateNewForm, dispatch, setSelectedForm]);

  const handleFormSelect = useCallback(
    (formId: string) => {
      setSelectedForm(formId);
    },
    [setSelectedForm],
  );

  const createNewForm = useCallback(async () => {
    try {
      const newForm = {
        ...createNewFormData(forms.length),
        questions: [{ ...createDefaultQuestion() }],
      };
      await contextCreateNewForm(newForm);
    } catch (error) {
      console.error('Failed to create new form:', error);
    }
  }, [forms.length, contextCreateNewForm]);

  const updateFormTitle = useCallback(
    async (formId: string, newTitle: string) => {
      try {
        await contextUpdateFormTitle(formId, newTitle);
      } catch (error) {
        console.error('Failed to save form title:', error);
      }
    },
    [contextUpdateFormTitle],
  );

  useEffect(() => {
    initializeForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTabValue(0);
  }, [selectedForm?.id]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 4,
          mt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button variant="contained" onClick={createNewForm}>
          Create New Form
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={form.id}>
            <FormCard
              form={form}
              onClick={() => handleFormSelect(form.id)}
              isSelected={form.id === selectedForm?.id}
              onTitleUpdate={updateFormTitle}
            />
          </Grid>
        ))}
      </Grid>
      {selectedForm && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Form Builder" />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Form Renderer
                  </Box>
                }
                disabled={!selectedForm?.isSubmitted}
              />
              {!selectedForm?.isSubmitted && (
                <Tooltip title="Please build and submit the form">
                  <InfoOutlined
                    sx={{
                      fontSize: '1rem',
                      position: 'relative',
                      top: '1rem',
                      left: '-12px',
                    }}
                    color="info"
                  />
                </Tooltip>
              )}
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ position: 'relative' }} key={selectedForm?.id}>
              {submittingFormId === selectedForm.id && <LoadingOverlay />}
              <FormBuilder
                key={selectedForm.id}
                isSubmitted={selectedForm.isSubmitted}
              />
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {selectedForm?.isSubmitted && <FormRenderer />}
          </TabPanel>
        </>
      )}
      {isInitializing && <LoadingOverlay />}
    </Container>
  );
};

export default React.memo(FormBuilderContainer);
