import { useState } from 'react';
import { Box, Stack } from "@mui/material";
import SplitTimer from './SplitTimer';
import SplitInput from './SplitInput';
import CompletedSplits from './CompletedSplits';
import { Split } from "./types";

function App() {
  const [currentSplit, setCurrentSplit] = useState<Split | null>(null);
  const [completedSplits, setCompletedSplits] = useState<Split[]>([]);

  const handleCreateSplit = (name: string) => {
    setCurrentSplit({
      id: Date.now().toString(),
      name,
      startTime: Date.now(),
    });
  };

  const handleCompleteSplit = () => {
    if (currentSplit) {
      const completedSplit = {
        ...currentSplit,
        endTime: Date.now(),
      };
      setCompletedSplits([completedSplit, ...completedSplits]);
      setCurrentSplit(null);
    }
  };

  return (
    <Stack 
      width="100%" 
      height="100%" 
      alignItems="center"
      spacing={6}
    >
      <Box p={4}>
        {currentSplit ? (
          <SplitTimer 
            currentSplit={currentSplit} 
            onComplete={handleCompleteSplit}
          />
        ) : (
          <SplitInput onCreateSplit={handleCreateSplit} />
        )}
      </Box>
      <CompletedSplits splits={completedSplits} />
    </Stack>
  );
}

export default App;