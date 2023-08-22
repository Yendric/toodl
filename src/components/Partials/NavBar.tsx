import AccountCircle from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthState";

const NavBar: FC = () => {
  const { logout, isAuth } = useAuth();

  const location = useLocation();
  const [value, setValue] = useState<boolean | string>(false);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setValue(location.pathname === "/planning" || location.pathname === "/todos" ? location.pathname : false);
  }, [location]);

  return (
    <AppBar position="sticky" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Link to="/" style={{ textDecoration: "none", flexGrow: isAuth ? 0 : 1 }}>
          <Typography variant="h6">Toodl</Typography>
        </Link>
        {isAuth ? (
          <>
            <Tabs
              value={value}
              centered
              style={{ flexGrow: 1 }}
              textColor="inherit"
              TabIndicatorProps={{ style: { backgroundColor: "#fff" } }}
            >
              <Tab label="Todo" value="/todos" component={Link} to="/todos" />
              <Tab label="Planning" value="/planning" component={Link} to="/planning" />
            </Tabs>
            <IconButton
              aria-label="Jouw account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
              }}
              color="inherit"
              size="large"
            >
              <AccountCircle style={{ opacity: location.pathname === "/settings" ? 1 : 0.8 }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link to="/settings">Instellingen</Link>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  logout();
                  handleClose();
                }}
              >
                Log uit
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Link to="/login">
            <Button variant="outlined" color="inherit">
              Log in
            </Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
