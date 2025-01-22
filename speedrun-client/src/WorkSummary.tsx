import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { Split, SplitState } from './types';
import { formatDuration, minutesToMs } from './utils';
import { colors } from './theme';
import WorkStatsModal from './WorkStatsModal';
import dayjs from 'dayjs';

type WorkSummaryProps = {
  splits: Split[];
  selectedDate: dayjs.Dayjs;
};

const WorkSummary = ({ splits, selectedDate }: WorkSummaryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const completedSplits = splits.filter(split => split.state === SplitState.COMPLETED);
  const totalEstimatedMinutes = completedSplits.reduce((acc, split) => acc + split.pessimisticEstimate, 0);
  const totalEstimatedMs = minutesToMs(totalEstimatedMinutes);

  return (
    <>
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center"
        sx={{
          cursor: 'pointer',
          transition: 'opacity 0.2s ease',
          '&:hover': {
            opacity: 0.8,
          }
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <Typography
          sx={{
            color: colors.gray,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          COMPLETED:
        </Typography>
        <Typography
          fontFamily="monospace"
          sx={{
            color: colors.yellow,
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          {formatDuration(totalEstimatedMs)}
        </Typography>
      </Stack>

      <WorkStatsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        splits={splits}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default WorkSummary;