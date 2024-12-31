import { Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { colors } from './theme';
import dayjs from 'dayjs';

type DateFilterProps = {
  selectedDate: dayjs.Dayjs;
  onDateChange: (date: dayjs.Dayjs | null) => void;
};

const DateFilter = ({ selectedDate, onDateChange }: DateFilterProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography
          sx={{
            color: colors.gray,
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          VIEWING SPLITS FOR:
        </Typography>
        <DatePicker
          value={selectedDate}
          onChange={onDateChange}
          disableFuture
          slotProps={{
            textField: {
              variant: "standard",
              sx: {
                '& .MuiInputBase-input': {
                  color: colors.yellow,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: colors.borderColor,
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: colors.yellow,
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: colors.yellow,
                },
                '& .MuiIconButton-root': {
                  color: colors.gray,
                },
              }
            },
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default DateFilter;