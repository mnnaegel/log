import { useEffect, useRef, useState } from 'react';
import { Typography, Box, Stack, Fade } from "@mui/material";
import { colors } from "./theme";

type TimerInputProps = {
  onComplete: (totalMinutes: number) => void;
  autoFocus?: boolean;
};

const TimerInput = ({ onComplete, autoFocus = false }: TimerInputProps) => {
  const [inputString, setInputString] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && boxRef.current) {
      boxRef.current.focus();
    }
  }, [autoFocus]);

  // Format the input string to display as time
  const getDisplayTime = () => {
    const paddedString = inputString.padStart(6, '0');
    const hours = paddedString.slice(0, 2);
    const minutes = paddedString.slice(2, 4);
    const seconds = paddedString.slice(4, 6);
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleNumberInput = (num: string) => {
    if (inputString.length >= 6) return;
    setInputString(prev => prev + num);
  };

  const handleBackspace = () => {
    setInputString(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    const paddedString = inputString.padStart(6, '0');
    const hours = parseInt(paddedString.slice(0, 2));
    const minutes = parseInt(paddedString.slice(2, 4));
    const seconds = parseInt(paddedString.slice(4, 6));
    
    const totalMinutes = hours * 60 + minutes + (seconds > 0 ? 1 : 0);
    onComplete(totalMinutes);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!boxRef.current?.contains(document.activeElement)) return;
      e.preventDefault();

      if (e.key === 'Enter') {
        handleEnter();
        return;
      }

      if (e.key === 'Backspace') {
        handleBackspace();
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        handleNumberInput(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputString]);

  return (
    <Fade in={true} timeout={300}>
      <Box
        ref={boxRef}
        tabIndex={0}
        onClick={() => {
          if (boxRef.current) boxRef.current.focus();
        }}
        sx={{
          outline: 'none',
          cursor: 'text',
          userSelect: 'none',
          '&:focus': {
            '& .time-display': {
              color: colors.yellow,
            }
          }
        }}
      >
        <Stack spacing={1} alignItems="center">
          <Typography
            variant="h2"
            fontFamily="monospace"
            className="time-display"
            sx={{
              color: colors.gray,
              letterSpacing: '0.1em',
              transition: 'color 0.2s ease'
            }}
          >
            {getDisplayTime()}
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={4} 
            sx={{ 
              color: colors.gray,
              opacity: 0.7,
              px: 1
            }}
          >
            <Typography sx={{ width: '3ch', textAlign: 'center' }}>
              HRS
            </Typography>
            <Typography sx={{ width: '3ch', textAlign: 'center' }}>
              MIN
            </Typography>
            <Typography sx={{ width: '3ch', textAlign: 'center' }}>
              SEC
            </Typography>
          </Stack>

          <Typography
            sx={{
              color: colors.gray,
              opacity: 0.7,
              fontSize: '0.875rem',
              textAlign: 'center',
              mt: 2
            }}
          >
            Use number keys to input time, enter to confirm
          </Typography>
        </Stack>
      </Box>
    </Fade>
  );
};

export default TimerInput;