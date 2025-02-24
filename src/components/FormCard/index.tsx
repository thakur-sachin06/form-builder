import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FormType } from '../../container/FormBuilderContainer/types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import styles from './FormCard.module.css';

interface FormCardProps {
  form: FormType;
  onClick: () => void;
  isSelected?: boolean;
  onTitleUpdate: (formId: string, newTitle: string) => void;
}

const FormCard: React.FC<FormCardProps> = ({
  form,
  onClick,
  isSelected = false,
  onTitleUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(form.title);

  const handleSave = () => {
    onTitleUpdate(form.id, tempTitle);
    setIsEditing(false);
  };

  return (
    <Card
      onClick={isEditing ? undefined : onClick}
      sx={{
        cursor: isEditing ? 'default' : 'pointer',
        transition: 'all 0.2s',
        backgroundColor: isSelected ? '#eaf1fb' : 'white',
        transform: isSelected ? 'scale(1.02)' : 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 1,
        },
      }}
    >
      <CardContent sx={{ padding: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditing ? (
            <>
              <input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className={styles.titleInput}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                startIcon={<CheckCircleIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                size="small"
                variant="contained"
                color="success"
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography
                sx={{ flex: 1, fontSize: '1rem', fontWeight: 'bold' }}
              >
                <>
                  {form.title}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setTempTitle(form.title);
                    }}
                  >
                    <EditIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </>
              </Typography>
              <Chip
                label={form.isSubmitted ? 'Submitted' : 'Pending'}
                color={form.isSubmitted ? 'success' : 'warning'}
                size="small"
                sx={{ mr: 1 }}
              />
            </>
          )}
        </Box>
        <Typography color="text.secondary" sx={{ flex: 1, fontSize: '1rem' }}>
          {form.questions.length} Questions
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(form.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FormCard;
