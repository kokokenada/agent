// src/pages/SignUpPage.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
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

export const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const [signUpError, setSignUpError] = React.useState('');

  const onSubmit = async (data: FormValues) => {
    try {
      // Call your sign-up API here
      // Example:
      // const response = await signUp(data.email, data.password);
      navigate('/login');
    } catch (err) {
      setSignUpError('Sign up failed. Please try again.');
    }
  };

  return (
    <StyledContainer component="main" maxWidth="xs">
      <Box>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {signUpError && <ErrorText>{signUpError}</ErrorText>}
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
            autoComplete="new-password"
            {...register('password', { required: true })}
            error={!!errors.password}
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign Up
          </StyledButton>
        </StyledForm>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
          </Typography>
        </Box>
      </Box>
    </StyledContainer>
  );
};
