import { useState, useEffect } from 'react';
import { Stack, Typography } from "@mui/material";

type Split = {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
};

const SplitTimer = () => {
  const [currentSplit] = useState<Split>({
    id: '1',
    name: 'Cook a meal for lunch',
    startTime: Date.now(),
  });
  
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentSplit && !currentSplit.endTime) {
        setElapsedTime(Date.now() - currentSplit.startTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSplit]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const pad = (num: number): string => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
  };

  return (
    <Stack 
      spacing={3}
      alignItems="center"
    >
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#e2b714', // monkeytype yellow
          fontWeight: 400,
          letterSpacing: '0.05em',
          textAlign: 'center'
        }}
      >
        {currentSplit.name}
      </Typography>
      
      <Typography 
        variant="h1" 
        fontFamily="monospace"
        sx={{ 
          color: '#646464', // light gray
          fontWeight: 300,
          letterSpacing: '0.1em'
        }}
      >
        {formatTime(elapsedTime)}
      </Typography>
    </Stack>
  );
};

export default SplitTimer;