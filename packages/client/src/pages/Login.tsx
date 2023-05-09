import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthApi } from '../api/use-auth-api';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { styled } from '@mui/system';
import { ROUTES } from '@src/Routes';

const StyledContainer = styled(Container)`
  margin-top: ${({ theme }) => theme.spacing(8)};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledForm = styled('form')`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const StyledButton = styled(Button)`
  margin: ${({ theme }) => theme.spacing(3, 0, 2)};
`;

const ErrorText = styled(Typography)`
  color: ${({ theme }) => theme.palette.error.main};
`;

type FormValues = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { tokenAuth } = useAuthApi();
  const navigate = useNavigate();
  const [loginError, setLoginError] = React.useState('');

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await tokenAuth(data.email, data.password);
      const token = response.data.tokenAuth.token;
      localStorage.setItem('authToken', token);
      navigate('/');
    } catch (err) {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <StyledContainer component="main" maxWidth="xs">
      <Box>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {loginError && <ErrorText>{loginError}</ErrorText>}
        <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register('email', { required: true })}
            error={!!errors.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: true })}
            error={!!errors.password}
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Login
          </StyledButton>
        </StyledForm>
        <Box mt={2}>
          <Typography variant="body2">
            Need an account? <Link to={ROUTES.SIGNUP}>Sign Up</Link>
          </Typography>
        </Box>
      </Box>
    </StyledContainer>
  );
};
