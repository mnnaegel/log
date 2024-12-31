import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Typography,
  Box
} from '@mui/material';
import { colors } from './theme';
import dayjs from 'dayjs';

type NotesModalProps = {
  open: boolean;
  onClose: () => void;
  selectedDate: dayjs.Dayjs;
  notes: string;
  onNotesChange: (notes: string) => void;
};

const NotesModal = ({ 
  open, 
  onClose, 
  selectedDate, 
  notes, 
  onNotesChange 
}: NotesModalProps) => {
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
          Notes for {selectedDate.format('MMMM D, YYYY')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            variant="outlined"
            placeholder="Write your thoughts here..."
            sx={{
              '& .MuiOutlinedInput-root': {
                color: colors.gray,
                '& fieldset': {
                  borderColor: colors.borderColor,
                },
                '&:hover fieldset': {
                  borderColor: colors.yellow,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.yellow,
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          sx={{
            color: colors.gray,
            '&:hover': {
              color: colors.yellow,
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesModal;