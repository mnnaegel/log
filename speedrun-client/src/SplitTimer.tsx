import {useState, useEffect} from 'react';
import {Stack, IconButton} from "@mui/material";
import {Split} from "./types";
import {colors} from "./theme";
import {formatDuration} from "./utils";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import TimeDisplay from './TimeDisplay';
import EditableText from './EditableText';

type SplitTimerProps = {
  currentSplit: Split;
  onComplete: () => void;
  onAbandon: () => void;
  onUpdateName: (newName: string) => void;
};

const SplitTimer = ({currentSplit, onComplete, onAbandon, onUpdateName}: SplitTimerProps) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentSplit && !currentSplit.endTime) {
        const newTime = Date.now() - currentSplit.startTime;
        setElapsedTime(newTime);

        if (newTime / (1000 * 60) > currentSplit.pessimisticEstimate) {
          onAbandon();
          clearInterval(timer);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSplit, onAbandon]);

  const getTimeColor = () => {
    const elapsedMinutes = elapsedTime / (1000 * 60);
    const quarterEstimate = currentSplit.pessimisticEstimate / 4;
    const halfEstimate = currentSplit.pessimisticEstimate / 2;
    const threeQuarterEstimate = (currentSplit.pessimisticEstimate * 3) / 4;

    if (elapsedMinutes >= quarterEstimate && elapsedMinutes <= halfEstimate) {
      return colors.softYellow;
    }

    if (elapsedMinutes >= halfEstimate && elapsedMinutes <= threeQuarterEstimate) {
      return colors.yellow;
    }

    if (elapsedMinutes >= threeQuarterEstimate) {
      return colors.softRed;
    }

    return colors.gray;
  };

  return (
    <Stack
      spacing={3}
      alignItems="center"
    >
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
      >
        <EditableText
          value={currentSplit.name}
          onChange={onUpdateName}
          variant="h4"
        />
      </Stack>

      <TimeDisplay
        time={formatDuration(elapsedTime)}
        estimate={currentSplit.pessimisticEstimate}
        color={getTimeColor()}
        size="large"
      />

      <Stack direction="row" spacing={1}>
        <IconButton
          onClick={onComplete}
          sx={{
            color: colors.gray,
            '&:hover': {
              color: colors.yellow
            }
          }}
        >
          <CheckIcon/>
        </IconButton>
        <IconButton
          onClick={onAbandon}
          sx={{
            color: colors.gray,
            '&:hover': {
              color: colors.softRed
            }
          }}
        >
          <ClearIcon/>
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default SplitTimer;