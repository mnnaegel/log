import { useState } from 'react';
import {Box, Stack} from "@mui/material";
import SplitTimer from './SplitTimer';
import SplitInput from './SplitInput';
import CompletedSplits from './CompletedSplits';
import { Split, SplitState } from "./types";

function App() {
  const [currentSplit, setCurrentSplit] = useState<Split | null>(null);
  const [completedSplits, setCompletedSplits] = useState<Split[]>([]);

  const handleCreateSplit = (name: string) => {
    setCurrentSplit({
      id: Date.now().toString(),
      name,
      startTime: Date.now(),
      state: SplitState.IN_PROGRESS
    });
  };

  const handleCompleteSplit = () => {
    if (currentSplit) {
      const completedSplit = {
        ...currentSplit,
        endTime: Date.now(),
        state: SplitState.COMPLETED
      };
      setCompletedSplits([completedSplit, ...completedSplits]);
      setCurrentSplit(null);
    }
  };

  const handleAbandonSplit = () => {
    if (currentSplit) {
      const abandonedSplit = {
        ...currentSplit,
        endTime: Date.now(),
        state: SplitState.ABANDONED
      };
      setCompletedSplits([abandonedSplit, ...completedSplits]);
      setCurrentSplit(null);
    }
  };

  return (
    <Stack 
      width="100%" 
      height="100%" 
      alignItems="center"
      spacing={6}
      justifyContent="space-between"
    >
      <Box p={4}>
        {currentSplit ? (
          <SplitTimer 
            currentSplit={currentSplit} 
            onComplete={handleCompleteSplit}
            onAbandon={handleAbandonSplit}
          />
        ) : (
          <SplitInput onCreateSplit={handleCreateSplit} />
        )}
      </Box>

      <Stack width="100%" pb={8} alignItems="center">
        <CompletedSplits splits={completedSplits} />
      </Stack>
    </Stack>
  );
}

export default App;