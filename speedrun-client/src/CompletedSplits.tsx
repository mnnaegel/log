import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import dayjs from 'dayjs';
import DateFilter from './DateFilter';
import { Split, SplitState } from "./types";
import { colors } from "./theme";
import { formatDuration, formatElapsedTime, minutesToMs, formatTimeDiff, formatDateTime } from "./utils";
import EditableText from './EditableText';
import React, { useState, useEffect } from "react";
import { getSplitsForDate, updateSplit } from './api';
import {Session} from "@supabase/supabase-js";
import getSupabaseClient from "./getSupabaseClient.ts";

type CompletedSplitsProps = {
  onUpdateName: (splitId: string, newName: string) => void;
  refreshTrigger: number;
};

const CompletedSplits = ({ onUpdateName, refreshTrigger }: CompletedSplitsProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [splits, setSplits] = useState<Split[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupabaseClient().auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchSplits() {
      if (!session) {
        setSplits([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const startOfDay = selectedDate.startOf('day').valueOf();
        const fetchedSplits = await getSplitsForDate(new Date(startOfDay));
        setSplits(fetchedSplits);
      } catch (err) {
        console.error('Error fetching splits:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch splits');
        setSplits([]);
      } finally {
        setLoading(false);
      }
    }

    void fetchSplits();
  }, [selectedDate, refreshTrigger, session]);

  const handleUpdateName = async (splitId: string, newName: string) => {
    try {
      const updatedSplit = await updateSplit(splitId, { name: newName });
      setSplits(currentSplits => 
        currentSplits.map(split => 
          split.id === splitId ? updatedSplit : split
        )
      );
      onUpdateName(splitId, newName);
    } catch (err) {
      console.error('Failed to update split name:', err);
    }
  };

  const getTimeColor = (split: Split) => {
    if (split.state === SplitState.ABANDONED) return colors.softRed;
    const actualMs = split.endTime! - split.startTime;
    const estimateMs = minutesToMs(split.pessimisticEstimate);
    return actualMs <= estimateMs ? colors.green : colors.red;
  };

  const BaseCell = ({ children, align = 'left' }: { children: React.ReactNode, align?: 'left' | 'right' }) => (
    <TableCell 
      align={align}
      sx={{
        borderBottom: `1px solid ${colors.borderColor}`,
        padding: '0.75rem 1rem',
      }}
    >
      {children}
    </TableCell>
  );

  if (!session) {
    return (
      <Stack alignItems="center" minWidth="50rem">
        <Typography sx={{ color: colors.gray, mt: 4 }}>
          Please sign in to view your splits
        </Typography>
      </Stack>
    );
  }
  
  return (
    <Stack alignItems="center" minWidth="50rem">
      <DateFilter
        selectedDate={selectedDate}
        onDateChange={(date) => date && setSelectedDate(date)}
      />

      {loading ? (
        <Typography sx={{ color: colors.gray, mt: 4 }}>
          Loading splits...
        </Typography>
      ) : error ? (
        <Typography sx={{ color: colors.softRed, mt: 4 }}>
          {error}
        </Typography>
      ) : splits.length === 0 ? (
        <Typography sx={{ color: colors.gray, mt: 4 }}>
          No splits found for this date
        </Typography>
      ) : (
        <TableContainer 
          sx={{ 
            height: '300px', 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: colors.borderColor,
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.gray,
              }
            },
            scrollbarWidth: 'thin',
            scrollbarColor: `${colors.borderColor} transparent`
          }}
        >
          <Table size="small" sx={{ maxWidth: '1000px', margin: '0 auto' }}>
            <TableHead>
              <TableRow>
                <BaseCell>
                  <Typography sx={{ color: colors.gray, fontSize: '0.75rem', fontWeight: 500 }}>
                    SPLIT NAME
                  </Typography>
                </BaseCell>
                <BaseCell align="right">
                  <Typography sx={{ color: colors.gray, fontSize: '0.75rem', fontWeight: 500 }}>
                    ELAPSED
                  </Typography>
                </BaseCell>
                <BaseCell align="right">
                  <Typography sx={{ color: colors.gray, fontSize: '0.75rem', fontWeight: 500 }}>
                    ESTIMATE
                  </Typography>
                </BaseCell>
                <BaseCell align="right">
                  <Typography sx={{ color: colors.gray, fontSize: '0.75rem', fontWeight: 500 }}>
                    STARTED
                  </Typography>
                </BaseCell>
                <BaseCell align="right">
                  <Typography sx={{ color: colors.gray, fontSize: '0.75rem', fontWeight: 500 }}>
                    DIFFERENCE
                  </Typography>
                </BaseCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {splits.map((split) => {
                const actualMs = split.endTime! - split.startTime;
                const estimateMs = minutesToMs(split.pessimisticEstimate);
                const timeColor = getTimeColor(split);

                return (
                  <TableRow key={split.id}>
                    <BaseCell>
                      <EditableText
                        value={split.name}
                        onChange={(newName) => handleUpdateName(split.id, newName)}
                        isStrikethrough={split.state === SplitState.ABANDONED}
                      />
                    </BaseCell>
                    <BaseCell align="right">
                      <Typography
                        fontFamily="monospace"
                        sx={{
                          color: timeColor,
                          letterSpacing: '0.05em'
                        }}
                      >
                        {formatElapsedTime(split.startTime, split.endTime!)}
                      </Typography>
                    </BaseCell>
                    <BaseCell align="right">
                      <Typography
                        fontFamily="monospace"
                        sx={{
                          color: colors.gray,
                          opacity: 0.7,
                          letterSpacing: '0.05em'
                        }}
                      >
                        {formatDuration(estimateMs)}
                      </Typography>
                    </BaseCell>
                    <BaseCell align="right">
                      <Typography
                        fontFamily="monospace"
                        sx={{
                          color: colors.gray,
                          opacity: 0.7,
                          letterSpacing: '0.05em'
                        }}
                      >
                        {formatDateTime(split.startTime)}
                      </Typography>
                    </BaseCell>
                    <BaseCell align="right">
                      {split.state !== SplitState.ABANDONED && (
                        <Typography
                          fontFamily="monospace"
                          sx={{
                            color: colors.gray,
                            opacity: 0.7,
                            letterSpacing: '0.05em'
                          }}
                        >
                          {formatTimeDiff(actualMs, estimateMs)}
                        </Typography>
                      )}
                    </BaseCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};

export default CompletedSplits;