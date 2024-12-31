import { useState, useEffect, useRef } from 'react';
import { Typography, Box } from "@mui/material";
import { colors } from "./theme";

type TimerInputProps = {
  onComplete: (totalMinutes: number) => void;
};

type TimeSegment = 'hours' | 'minutes' | 'seconds';

const TimerInput = ({ onComplete }: TimerInputProps) => {
  const [hours, setHours] = useState('AB');
  const [minutes, setMinutes] = useState('CD');
  const [seconds, setSeconds] = useState('EF');
  const [activeSegment, setActiveSegment] = useState<TimeSegment>('hours');
  const boxRef = useRef<HTMLDivElement>(null);

  const moveToNextSegment = () => {
    setActiveSegment(curr => {
      if (curr === 'hours') return 'minutes';
      if (curr === 'minutes') return 'seconds';
      return 'seconds';
    });
  };

  const moveToPreviousSegment = () => {
    setActiveSegment(curr => {
      if (curr === 'seconds') return 'minutes';
      if (curr === 'minutes') return 'hours';
      return 'hours';
    });
  };

  const handleBackspace = () => {
    switch (activeSegment) {
      case 'seconds':
        if (seconds !== 'EF') {
          setSeconds('EF');
        } else {
          moveToPreviousSegment();
        }
        break;
      case 'minutes':
        if (minutes !== 'CD') {
          setMinutes('CD');
        } else {
          moveToPreviousSegment();
        }
        break;
      case 'hours':
        if (hours !== 'AB') {
          setHours('AB');
        }
        break;
    }
  };

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.focus();
    }

    const isValidNumber = (value: string, max: number): boolean => {
      const num = parseInt(value);
      return !isNaN(num) && num >= 0 && num <= max;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!boxRef.current?.contains(document.activeElement)) return;
      e.preventDefault();

      if (e.key === 'Enter') {
        if (isValidNumber(hours, 23) && isValidNumber(minutes, 59) && isValidNumber(seconds, 59)) {
          const h = parseInt(hours);
          const m = parseInt(minutes);
          const s = parseInt(seconds);
          const totalMinutes = h * 60 + m + (s > 0 ? 1 : 0);
          onComplete(totalMinutes);
        }
        return;
      }

      if (e.key === 'Backspace') {
        handleBackspace();
        return;
      }

      // Only handle number inputs
      if (!/^\d$/.test(e.key)) return;

      const num = parseInt(e.key);
      switch (activeSegment) {
        case 'hours':
          if (hours === 'AB') {
            if (num <= 2) {
              setHours(num + '0');
            }
          } else {
            const firstDigit = parseInt(hours[0]);
            const candidate = firstDigit * 10 + num;
            if (candidate <= 23) {
              setHours(candidate.toString().padStart(2, '0'));
              moveToNextSegment();
            }
          }
          break;
        case 'minutes':
          if (minutes === 'CD') {
            if (num <= 5) {
              setMinutes(num + '0');
            }
          } else {
            const firstDigit = parseInt(minutes[0]);
            const candidate = firstDigit * 10 + num;
            if (candidate <= 59) {
              setMinutes(candidate.toString().padStart(2, '0'));
              moveToNextSegment();
            }
          }
          break;
        case 'seconds':
          if (seconds === 'EF') {
            if (num <= 5) {
              setSeconds(num + '0');
            }
          } else {
            const firstDigit = parseInt(seconds[0]);
            const candidate = firstDigit * 10 + num;
            if (candidate <= 59) {
              setSeconds(candidate.toString().padStart(2, '0'));
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSegment, hours, minutes, seconds, onComplete]);

  return (
    <Box
      ref={boxRef}
      tabIndex={0}
      onClick={() => {
        if (boxRef.current) boxRef.current.focus();
      }}
      sx={{
        outline: 'none',
        position: 'relative',
        cursor: 'text',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography
          variant="h2"
          fontFamily="monospace"
          sx={{
            color: colors.gray,
            borderBottom: activeSegment === 'hours' ? `2px solid ${colors.yellow}` : 'none'
          }}
        >
          {hours}
        </Typography>
        <Typography
          variant="h2"
          fontFamily="monospace"
          sx={{ color: colors.gray }}
        >
          :
        </Typography>
        <Typography
          variant="h2"
          fontFamily="monospace"
          sx={{
            color: colors.gray,
            borderBottom: activeSegment === 'minutes' ? `2px solid ${colors.yellow}` : 'none'
          }}
        >
          {minutes}
        </Typography>
        <Typography
          variant="h2"
          fontFamily="monospace"
          sx={{ color: colors.gray }}
        >
          :
        </Typography>
        <Typography
          variant="h2"
          fontFamily="monospace"
          sx={{
            color: colors.gray,
            borderBottom: activeSegment === 'seconds' ? `2px solid ${colors.yellow}` : 'none'
          }}
        >
          {seconds}
        </Typography>
      </Box>
      <Typography
        sx={{
          color: colors.gray,
          opacity: 0.7,
          fontSize: '0.875rem',
          textAlign: 'center'
        }}
      >
        Use number keys to input time, enter to confirm
      </Typography>
    </Box>
  );
};

export default TimerInput;