import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, Box } from "@mui/material";
import { colors } from "./theme";

type EditableTextProps = {
  value: string;
  onChange: (newValue: string) => void;
  variant?: 'h4' | 'body1';
  isStrikethrough?: boolean;
};

const EditableText = ({ 
  value, 
  onChange, 
  variant = 'body1',
  isStrikethrough = false 
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && editValue.trim()) {
      onChange(editValue.trim());
      setIsEditing(false);
    } else if (event.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (editValue.trim()) {
      onChange(editValue.trim());
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  return (
    <Box
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDoubleClick={handleDoubleClick}
      sx={{ 
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {isEditing ? (
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          variant="standard"
          inputRef={inputRef}
          sx={{
            '& .MuiInput-input': {
              color: colors.yellow,
              fontSize: variant === 'h4' ? '2.125rem' : '1rem',
              fontWeight: variant === 'h4' ? 400 : 300,
              textAlign: 'center',
              letterSpacing: '0.05em',
              textDecoration: isStrikethrough ? 'line-through' : 'none',
            },
            '& .MuiInput-underline:before': {
              borderBottomColor: colors.borderColor,
            },
            '& .MuiInput-underline:hover:before': {
              borderBottomColor: colors.yellow,
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: colors.yellow,
            },
          }}
        />
      ) : (
        <Typography
          variant={variant}
          sx={{
            color: colors.yellow,
            fontWeight: variant === 'h4' ? 400 : 300,
            letterSpacing: '0.05em',
            textDecoration: isStrikethrough ? 'line-through' : 'none',
            textAlign: variant === 'h4' ? 'center' : 'left',
            borderBottom: isHovering ? `1px dashed ${colors.borderColor}` : 'none',
          }}
        >
          {value}
        </Typography>
      )}
    </Box>
  );
};

export default EditableText;