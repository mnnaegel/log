import {useCallback, useEffect, useState} from 'react';
import {Box, Stack, Typography} from "@mui/material";
import dayjs from 'dayjs';
import SplitTimer from './SplitTimer';
import CompletedSplits from './CompletedSplits';
import {Split, SplitState} from "./types";
import SplitInput from "./SplitInput";
import AuthButton from "./AuthModal";
import DateFilter from './DateFilter';
import NotesModal from './NotesModal';
import {createSplit, deleteSplit, getSplitsForDate, updateSplit} from './api';
import {Session} from "@supabase/supabase-js";
import getSupabaseClient from "./getSupabaseClient";
import {colors} from "./theme.ts";
import WorkSummary from "./WorkSummary.tsx";

function App() {
  const [currentSplit, setCurrentSplit] = useState<Split | null>(null);
  const [completedSplits, setCompletedSplits] = useState<Split[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupabaseClient().auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });
  }, []);

  const fetchCompletedSplits = useCallback(async () => {
    if (!session) {
      setCompletedSplits([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const startOfDay = selectedDate.startOf('day').valueOf();
      const fetchedSplits = (await getSplitsForDate(new Date(startOfDay))).filter(split => split.state !== SplitState.IN_PROGRESS);
      setCompletedSplits(fetchedSplits);
    } catch (err) {
      console.error('Error fetching splits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch splits');
      setCompletedSplits([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, session]);

  useEffect(() => {
    void fetchCompletedSplits();
  }, [fetchCompletedSplits, selectedDate, session]);

  const handleCreateSplit = async (name: string, estimatedMinutes: number) => {
    const newSplit = await createSplit({
      name: name,
      startTime: Date.now(),
      pessimisticEstimate: estimatedMinutes,
      state: SplitState.IN_PROGRESS
    });

    setCurrentSplit(newSplit);
  };

  const handleDeleteSplit = async (split: Split) => {
    try {
      setCompletedSplits(completedSplits.filter(s => s.id !== split.id));
      await deleteSplit(split.id);
    } catch (err) {
      console.error('Failed to delete split:', err);
    }
  }

  const handleUpdateCurrentSplitName = (newName: string) => {
    if (currentSplit) {
      setCurrentSplit({
        ...currentSplit,
        name: newName
      });
    }
  };

  const handleUpdateCompletedSplitName = async (split: Split, newName: string) => {
    try {
      const updatedSplit = await updateSplit(split.id, {...split, name: newName});
      setCompletedSplits(currentSplits =>
        currentSplits.map(s =>
          s.id === split.id ? updatedSplit : split
        )
      );
    } catch (err) {
      console.error('Failed to update split name:', err);
    }
  };

  const handleCompleteSplit = async () => {
    if (currentSplit) {
      // update the split with the new end time
      try {
        await updateSplit(currentSplit.id, {
          ...currentSplit,
          endTime: Date.now(),
          state: SplitState.COMPLETED
        });
      } catch (err) {
        console.error('Failed to update split end time:', err);
      }

      setCurrentSplit(null);

      //refresh list
      void fetchCompletedSplits()
    }
  };

  const handleAbandonSplit = async () => {
    if (currentSplit) {
      const abandonedSplit = {
        ...currentSplit,
        endTime: Date.now(),
        state: SplitState.ABANDONED
      };
      setCurrentSplit(null);

      await updateSplit(abandonedSplit.id, abandonedSplit);

      // refresh list
      void fetchCompletedSplits();
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
      <Box sx={{position: 'absolute', top: '1rem', right: '1rem'}}>
        <AuthButton/>
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
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{mb: 3}}
            >
              <DateFilter
                selectedDate={selectedDate}
                onDateChange={(date) => date && setSelectedDate(date)}
                onNotesOpen={() => setIsNotesOpen(true)}
              />
              <WorkSummary splits={completedSplits} selectedDate={selectedDate}/>
            </Stack>

            {session ? (
              <CompletedSplits
                splits={completedSplits}
                onUpdateName={handleUpdateCompletedSplitName}
                onDeleteSplit={handleDeleteSplit}
                isLoading={loading}
                error={error}
              />
            ) : (
              <Typography sx={{color: colors.gray, mt: 4}}>
                Please sign in to view your splits
              </Typography>
            )}
          </Stack>

          <NotesModal
            open={isNotesOpen}
            onClose={() => setIsNotesOpen(false)}
            selectedDate={selectedDate}
            notes={notes}
            onNotesChange={setNotes}
          />
        </>
      )}
    </Stack>
  );
}

export default App;