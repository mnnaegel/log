import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Split, SplitState } from "./types";
import { colors } from "./theme";
import { formatDuration, formatElapsedTime, minutesToMs, formatTimeDiff, formatDateTime } from "./utils";
import EditableText from './EditableText';
import React from "react";

type CompletedSplitsProps = {
  splits: Split[];
  onUpdateName: (split: Split, newName: string) => void;
  isLoading?: boolean;
  error?: string | null;
};

const CompletedSplits = ({ 
  splits, 
  onUpdateName, 
  isLoading = false,
  error = null 
}: CompletedSplitsProps) => {
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
  
  if (isLoading) {
    return (
      <Typography sx={{ color: colors.gray, mt: 4 }}>
        Loading splits...
      </Typography>
    );
  }
  
  if (error) {
    return (
      <Typography sx={{ color: colors.softRed, mt: 4 }}>
        {error}
      </Typography>
    );
  }
  
  if (splits.length === 0) {
    return (
      <Typography sx={{ color: colors.gray, mt: 4 }}>
        No splits found for this date
      </Typography>
    );
  }

  return (
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
                    onChange={(newName) => onUpdateName(split, newName)}
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
  );
};

export default CompletedSplits;