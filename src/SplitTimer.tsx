import { useState, useEffect } from 'react';
import { Stack, Typography, IconButton } from "@mui/material";
import { Split } from "./types";
import { colors } from "./theme";
import { formatDuration } from "./utils";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';

type SplitTimerProps = {
  currentSplit: Split;
  onComplete: () => void;
  onAbandon: () => void;
};

const SplitTimer = ({ currentSplit, onComplete, onAbandon }: SplitTimerProps) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentSplit && !currentSplit.endTime) {
        setElapsedTime(Date.now() - currentSplit.startTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSplit]);

  return (
    <Stack 
      spacing={3}
      alignItems="center"
    >
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center"
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: colors.yellow,
            fontWeight: 400,
            letterSpacing: '0.05em',
            textAlign: 'center'
          }}
        >
          {currentSplit.name}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton 
            onClick={onComplete}
            sx={{ 
              color: colors.gray,
              '&:hover': {
                color: colors.yellow
              }
            }}
          >
            <CheckCircleOutlineIcon />
          </IconButton>
          <IconButton 
            onClick={onAbandon}
            sx={{ 
              color: colors.gray,
              '&:hover': {
                color: colors.softRed
              }
            }}
          >
            <ClearIcon />
          </IconButton>
        </Stack>
      </Stack>
      
      <Typography 
        variant="h1" 
        fontFamily="monospace"
        sx={{ 
          color: colors.gray,
          fontWeight: 300,
          letterSpacing: '0.1em'
        }}
      >
        {formatDuration(elapsedTime)}
      </Typography>
    </Stack>
  );
};

export default SplitTimer;