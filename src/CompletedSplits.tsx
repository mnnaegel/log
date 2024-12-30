import {Stack, Typography} from "@mui/material";
import {Split, SplitState} from "./types.ts";
import {colors} from "./theme.ts";
import {formatElapsedTime} from "./utils.ts";

type CompletedSplitsProps = {
  splits: Split[];
};

const CompletedSplits = ({ splits }: CompletedSplitsProps) => {
  const getTimeColor = (state: SplitState) => {
    switch (state) {
      case SplitState.ABANDONED:
        return colors.softRed;
      default:
        return colors.gray;
    }
  }
  
  return (
   <Stack spacing={2} sx={{ width: '100%', maxWidth: '700px', height: '300px', overflow: 'auto', scrollbarWidth: 'none' }}>
      {splits.map((split) => (
        <Stack
          key={split.id}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 1,
            borderBottom: `1px solid ${colors.borderColor}`,
            '&:last-child': {
              borderBottom: 'none'
            }
          }}
        >
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
          <Typography
            fontFamily="monospace"
            sx={{
              color: getTimeColor(split.state),
              letterSpacing: '0.05em'
            }}
          >
            {formatElapsedTime(split.startTime, split.endTime!)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default CompletedSplits;