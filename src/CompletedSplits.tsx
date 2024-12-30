import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Split, SplitState } from "./types";
import { colors } from "./theme";
import { formatDuration, formatElapsedTime, minutesToMs, formatTimeDiff } from "./utils";

type CompletedSplitsProps = {
  splits: Split[];
};

const CompletedSplits = ({ splits }: CompletedSplitsProps) => {
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
  
  return (
    <TableContainer sx={{ maxHeight: '300px', overflow: 'auto', scrollbarWidth: 'none' }}>
      <Table size="small" sx={{ maxWidth: '900px', margin: '0 auto' }}>
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
                  <Typography
                    sx={{
                      color: colors.yellow,
                      fontWeight: 300,
                      letterSpacing: '0.05em',
                      textDecoration: split.state === SplitState.ABANDONED ? 'line-through' : 'none'
                    }}
                  >
                    {split.name}
                  </Typography>
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