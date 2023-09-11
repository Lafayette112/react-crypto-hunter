import { AppBar, Container, MenuItem, Select, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: 'gold',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
}))

const Header = () => {

  // click on title will return to homepage
  const navigate = useNavigate();

  const { currency, setCurrency } = CryptoState(); // destructure the currency from the CryptoState

  const classes = useStyles();

  // Dark Theme
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  })

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <AppBar color='transparent' position='static'>
          <Container>
            <Toolbar>
              {/* title */}
              <Typography 
                onClick={() => navigate("/")} 
                className={classes.title}
                variant='h6'
              >
                  Crypto Hunter
              </Typography>

              {/* select component */}
              <Select 
                variant="outlined" 
                style={{
                  width: 100,
                  height: 40,
                  marginRight: 15,
                }}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <MenuItem value={"EUR"}>EUR</MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
              </Select>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
    </div>
  )
}

export default Header