import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthApi } from '@src/api/use-auth-api';
import { ROUTES } from '@src/Routes';

const StyledAppBar = styled(AppBar)`
  background-color: ${({ theme }) => theme.palette.primary};
`;

const StyledTypography = styled(Typography)`
  flex-grow: 1;
`;

export const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const authApi = useAuthApi();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await authApi.logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <StyledAppBar position="static" theme={theme}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <StyledTypography variant="h6">My App</StyledTypography>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};
