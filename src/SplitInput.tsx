// SplitInput.tsx
import { useState } from 'react';
import { Stack, TextField } from "@mui/material";
import { colors } from "./theme";

type SplitInputProps = {
  onCreateSplit: (name: string) => void;
};

const SplitInput = ({ onCreateSplit }: SplitInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      onCreateSplit(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <Stack spacing={3} alignItems="center">
      <TextField
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        variant="standard"
        sx={{
          maxWidth: '600px',
          '& .MuiInput-input': {
            color: colors.gray,
            fontSize: '2rem',
            textAlign: 'center',
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
    </Stack>
  );
};

export default SplitInput;