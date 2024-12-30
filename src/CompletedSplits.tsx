// CompletedSplits.tsx
import { Stack, Typography } from "@mui/material";
import {Split} from "./types.ts";
import {colors} from "./theme.ts";
import {formatElapsedTime} from "./utils.ts";

type CompletedSplitsProps = {
  splits: Split[];
};

const CompletedSplits = ({ splits }: CompletedSplitsProps) => {
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: '600px' }}>
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
              letterSpacing: '0.05em'
            }}
          >
            {split.name}
          </Typography>
          <Typography
            fontFamily="monospace"
            sx={{
              color: colors.gray,
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