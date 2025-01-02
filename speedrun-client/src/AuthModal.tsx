import React, { useState, useEffect } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { colors } from './theme';
import { Typography, Box, Stack, Button, TextField } from '@mui/material';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
            },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) console.log(error);

      if (isSignUp && !error) {
        setError('Please check your email to confirm your account');
      }

      if (data.session) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
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
    '& .MuiInputLabel-root': {
      color: colors.gray,
    },
    marginBottom: 2
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
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
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleAuth} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={inputStyle}
            />
            {error && (
              <Typography
                sx={{
                  color: error.includes('check your email') ? colors.green : colors.softRed,
                  fontSize: '0.875rem'
                  }}>
                {error}
              </Typography>
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, flexDirection: 'column', gap: 1 }}>
        <Button 
          fullWidth
          onClick={handleAuth}
          disabled={loading}
          sx={{
            color: colors.yellow,
            borderColor: colors.borderColor,
            '&:hover': {
              borderColor: colors.yellow,
              backgroundColor: 'rgba(226, 183, 20, 0.1)',
            },
            textTransform: 'none',
          }}
          variant="outlined"
        >
          {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>
        <Button 
          fullWidth
          onClick={() => setIsSignUp(!isSignUp)}
          sx={{
            color: colors.gray,
            '&:hover': {
              color: colors.yellow,
              backgroundColor: 'transparent',
            },
            textTransform: 'none',
          }}
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AuthButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session?.user) {
    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography
          sx={{
            color: colors.gray,
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
          }}
        >
          {session.user.email}
        </Typography>
        <Button
          onClick={() => supabase.auth.signOut()}
          sx={{
            color: colors.gray,
            borderColor: colors.borderColor,
            '&:hover': {
              color: colors.softRed,
              borderColor: colors.softRed,
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
            },
            textTransform: 'none',
            minWidth: 'auto',
            padding: '4px 12px',
          }}
          variant="outlined"
          size="small"
        >
          Sign Out
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        sx={{
          color: colors.gray,
          borderColor: colors.borderColor,
          '&:hover': {
            color: colors.yellow,
            borderColor: colors.yellow,
            backgroundColor: 'rgba(226, 183, 20, 0.1)',
          },
          textTransform: 'none',
        }}
        variant="outlined"
      >
        Sign In
      </Button>
      <AuthModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AuthButton;