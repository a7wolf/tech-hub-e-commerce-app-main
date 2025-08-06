import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Add this line
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

// Add a new theme with a fresh color palette (blue & purple)
const theme = createTheme({
  palette: {
    primary: {
      main: '#60732cff', // Indigo
    },
    secondary: {
      main: '#4f8f35ff', // Purple
    },
    background: {
      default: '#f3f0fa',
      paper: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #e3e0f7 0%, #ffffff 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 700,
        },
      },
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [reg_email, setreg_email] = useState('');
  const [reg_password, setreg_password] = useState('');
  const [error, setError] = useState('');
  const [regerror, setregError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      navigate('/products');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };
  // Registration logic
  const handleregister = async (e) => {
    e.preventDefault();
    setregError('');
    setLoading(true);

    if (!reg_email || !reg_password || !firstName || !lastName) {
      setregError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await register(firstName, lastName, reg_email, reg_password);

    if (result.success) {
      navigate('/products');
    } else {
      setregError(result.error);
    }

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='sm'>
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant='h4' align='center' gutterBottom color="primary">
              Login
            </Typography>

            {error && (
              <Alert severity='error' sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin='normal'
                required
                color="primary"
              />

              <TextField
                fullWidth
                label='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin='normal'
                required
                color="secondary"
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Paper>
        </Box>
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant='h4' align='center' gutterBottom color="secondary">
              Register
            </Typography>

            {regerror && (
              <Alert severity='error' sx={{ mb: 2 }}>
                {regerror}
              </Alert>
            )}

            <form onSubmit={handleregister}>
              <TextField
                fullWidth
                label='First Name'
                type='text'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin='normal'
                required
                color="primary"
              />
              <TextField
                fullWidth
                label='Last Name'
                type='text'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                margin='normal'
                required
                color="primary"
              />
              <TextField
                fullWidth
                label='Email'
                type='email'
                value={reg_email}
                onChange={(e) => setreg_email(e.target.value)}
                margin='normal'
                required
                color="primary"
              />
              <TextField
                fullWidth
                label='Password'
                type='password'
                value={reg_password}
                onChange={(e) => setreg_password(e.target.value)}
                margin='normal'
                required
                color="secondary"
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='secondary'
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
