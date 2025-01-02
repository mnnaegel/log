// App.tsx
import { useState } from 'react';
import { Box, Stack } from "@mui/material";
import SplitTimer from './SplitTimer';
import CompletedSplits from './CompletedSplits';
import { Split, SplitState } from "./types";
import SplitInput from "./SplitInput";
import AuthButton from "./AuthModal";

function App() {
  const [currentSplit, setCurrentSplit] = useState<Split | null>(null);
  const [completedSplits, setCompletedSplits] = useState<Split[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSplit = (name: string, estimatedMinutes: number) => {
    setCurrentSplit({
      id: Date.now().toString(),
      name,
      startTime: Date.now(),
      pessimisticEstimate: estimatedMinutes,
      state: SplitState.IN_PROGRESS
    });
  };

  const handleUpdateCurrentSplitName = (newName: string) => {
    if (currentSplit) {
      setCurrentSplit({
        ...currentSplit,
        name: newName
      });
    }
  };

  const handleUpdateCompletedSplitName = (splitId: string, newName: string) => {
    setCompletedSplits(splits =>
      splits.map(split =>
        split.id === splitId
          ? { ...split, name: newName }
          : split
      )
    );
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
      setRefreshTrigger(prev => prev + 1);
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
      setRefreshTrigger(prev => prev + 1);
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
      <Box sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <AuthButton />
      </Box>
      
      {(
        <>
          <Box p={4}>
            {currentSplit ? (
              <SplitTimer
                currentSplit={currentSplit}
                onComplete={handleCompleteSplit}
                onAbandon={handleAbandonSplit}
                onUpdateName={handleUpdateCurrentSplitName}
              />
            ) : (
              <SplitInput onCreateSplit={handleCreateSplit}/>
            )}
          </Box>

          <Stack width="100%" pb={8} alignItems="center">
            <CompletedSplits
              onUpdateName={handleUpdateCompletedSplitName}
              refreshTrigger={refreshTrigger}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default App;