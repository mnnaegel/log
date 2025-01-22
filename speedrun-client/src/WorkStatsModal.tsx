import { Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Split, SplitState } from './types';
import { colors } from './theme';
import { formatDuration, minutesToMs } from './utils';
import dayjs from 'dayjs';

type WorkStatsModalProps = {
  open: boolean;
  onClose: () => void;
  splits: Split[];
  selectedDate: dayjs.Dayjs;
};

const WorkStatsModal = ({ open, onClose, splits, selectedDate }: WorkStatsModalProps) => {
  const getHourlyWork = () => {
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      totalWork: 0,
      displayHour: `${String(i).padStart(2, '0')}:00`
    }));

    splits
      .filter(split => split.state === SplitState.COMPLETED)
      .forEach(split => {
        const endHour = new Date(split.endTime!).getHours();
        hourlyData[endHour].totalWork += split.pessimisticEstimate;
      });

    return hourlyData;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const minutes = payload[0].value;
      return (
        <Box sx={{
          backgroundColor: '#1b1b1b',
          border: `1px solid ${colors.borderColor}`,
          p: 1,
        }}>
          <Typography sx={{ color: colors.gray, fontSize: '0.875rem' }}>
            {`Time: ${payload[0].payload.displayHour}`}
          </Typography>
          <Typography sx={{ 
            color: colors.yellow, 
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>
            {formatDuration(minutesToMs(minutes))}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const chartData = getHourlyWork();
  const hasData = chartData.some(hour => hour.totalWork > 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1b1b1b',
          border: `1px solid ${colors.borderColor}`,
        }
      }}
    >
      <DialogTitle>
        <Typography
          sx={{
            color: colors.yellow,
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          Work Distribution for {selectedDate.format('MMMM D, YYYY')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ height: '400px', width: '100%', mt: 2 }}>
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={colors.borderColor}
                  vertical={false}
                />
                <XAxis 
                  dataKey="displayHour"
                  stroke={colors.gray}
                  interval={2}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke={colors.gray}
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: 'Minutes', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: colors.gray }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="totalWork" 
                  fill={colors.yellow}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Typography sx={{ color: colors.gray }}>
                No completed work for this day
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WorkStatsModal;