import { Stack, Typography } from "@mui/material";
import { colors } from "./theme";
import { formatDuration, minutesToMs, formatTimeDiff } from "./utils";

type TimeDisplayProps = {
  time: string;
  estimate: number;
  color?: string;
  size?: 'normal' | 'large';
  showDiff?: boolean;
  actualMs?: number;
};

const TimeDisplay = ({ 
  time, 
  estimate, 
  color = colors.gray,
  size = 'normal',
  showDiff = false,
  actualMs
}: TimeDisplayProps) => {
  const isLarge = size === 'large';
  const estimateMs = minutesToMs(estimate);
  
  return (
    <Stack direction="row" alignItems="baseline" spacing={isLarge ? 2 : 1}>
      <Typography
        variant={isLarge ? "h1" : "body1"}
        fontFamily="monospace"
        sx={{
          color,
          letterSpacing: '0.1em',
          fontWeight: isLarge ? 300 : 400
        }}
      >
        {time}
      </Typography>
      <Typography
        fontFamily="monospace"
        sx={{
          color: colors.gray,
          opacity: 0.5,
          fontSize: isLarge ? '1.5rem' : '0.8em',
          letterSpacing: '0.05em'
        }}
      >
        /{formatDuration(estimateMs)}
      </Typography>
      {showDiff && actualMs && (
        <Typography
          fontFamily="monospace"
          sx={{
            color: colors.gray,
            opacity: 0.5,
            fontSize: isLarge ? '1.5rem' : '0.8em',
            letterSpacing: '0.05em',
            ml: 2
          }}
        >
          ({formatTimeDiff(actualMs, estimateMs)})
        </Typography>
      )}
    </Stack>
  );
};

export default TimeDisplay;