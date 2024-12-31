import { useEffect, useRef, useState } from 'react';
import { Stack, TextField } from "@mui/material";
import { colors } from "./theme";
import TimerInput from './TimerInput';

type SplitInputProps = {
  onCreateSplit: (name: string, estimatedMinutes: number) => void;
};

type InputState = 'NAME' | 'ESTIMATE';

const SplitInput = ({ onCreateSplit }: SplitInputProps) => {
  const [state, setState] = useState<InputState>('NAME');
  const [name, setName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === 'NAME') {
      nameInputRef.current?.focus();
    }
  }, [state]);

  const handleNameKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && name.trim()) {
      setState('ESTIMATE');
    }
  };

  const handleEstimateComplete = (minutes: number) => {
    onCreateSplit(name.trim(), minutes);
    setName('');
    setState('NAME');
  };

  return (
    <Stack spacing={3} alignItems="center">
      <TextField
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleNameKeyPress}
        variant="standard"
        placeholder="What are you working on?"
        inputRef={nameInputRef}
        sx={{
          maxWidth: '600px',
          opacity: state === 'NAME' ? 1 : 0.5,
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
        }}
      />
      {state === 'ESTIMATE' && (
        <TimerInput onComplete={handleEstimateComplete} />
      )}
    </Stack>
  );
};

export default SplitInput;