import React, { useEffect, useRef, useState } from 'react';
import { Stack, TextField, Fade } from "@mui/material";
import { colors } from "./theme";
import TimerInput from './TimerInput';

type SplitInputProps = {
  onCreateSplit: (name: string, estimatedMinutes: number) => void;
};

const SplitInput = ({ onCreateSplit }: SplitInputProps) => {
  const [state, setState] = useState<'NAME' | 'ESTIMATE'>('NAME');
  const [name, setName] = useState('');
  const [showTimer, setShowTimer] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === 'NAME') {
      nameInputRef.current?.focus();
      setShowTimer(false);
    } else if (state === 'ESTIMATE') {
      setTimeout(() => {
        setShowTimer(true);
      }, 100);
    }
  }, [state]);

  const handleNameKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && name.trim()) {
      event.preventDefault();
      setState('ESTIMATE');
    }
  };


  return (
    <Stack spacing={5} alignItems="center">
      <Fade in={true}>
        <TextField
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleNameKeyDown}
          variant="standard"
          placeholder="What are you working on?"
          inputRef={nameInputRef}
          sx={{
            maxWidth: '600px',
            '& .MuiInput-input': {
              color: colors.gray,
              fontSize: '2rem',
              textAlign: 'left',
              marginX: '2rem',
              caretColor: colors.gray,
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
            '& .MuiFormHelperText-root': {
              color: colors.softRed,
              textAlign: 'center',
            },
          }}
        />
      </Fade>
      {showTimer && (
        <TimerInput 
          onComplete={(minutes) => onCreateSplit(name, minutes)}
          autoFocus={true}
        />
      )}
    </Stack>
  );
};

export default SplitInput;