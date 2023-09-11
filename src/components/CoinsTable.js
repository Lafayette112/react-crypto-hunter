import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { Container, LinearProgress, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { numberWithCommas } from './Banner/Carousel';


const CoinsTable = () => {

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const { currency, symbol } = CryptoState(); // destructure the currency and symbol from the CryptoState

  // fetch the CoinList API
  const fetchCoins = async () => {
    setLoading(true);
    // cache the data to avoid unnecessery api request
    const cachedData = localStorage.getItem('coinsData');
    if (cachedData) {
      setCoins(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    const { data } = await axios.get(CoinList(currency)) // destructure the data from the API
    localStorage.setItem('coinsData', JSON.stringify(data));
    setCoins(data); // set the Coins state to the data that we get from the api
    setLoading(false);
  };


  // Call the function in the useEffect
  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line
  }, [currency]);
  
  // Dark Theme
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  // Styles of components with Material UI
  const useStyles = makeStyles(() => ({
    row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#232323",
      },
      fontFamily: "Montserrat"
    },

    title: {
      margin: 18,
      fontFamily: "Montserrat",
    },

    pagination: {
      "& .MuiPaginationItem-root": {
        color: "gold",
      },
    }
  }));

  const classes = useStyles();

  // filter the search for names and symbols
  const handleSearch = () => {
    return coins.filter((coin) => (
      coin.name.toLowerCase().includes(search) || 
      coin.symbol.toLowerCase().includes(search)
    ))
  }

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Container style={{ textAlign: "center" }}>

          <Typography
            variant="h4"
            className={classes.title}
          >
            Cryptocurrency Prices by Market Cap
          </Typography>


          <TextField 
            label="Search For a Crypto Currency..." 
            variant="outlined" 
            style={{ marginBottom: 20, width: "100%" }}
            // Search event
            onChange={ (e) => setSearch(e.target.value) } // What we enter in the search bar will update the state
          />


          {/* Crypto Table */}
          <TableContainer>
            {
              loading ? (
                <LinearProgress style={{ backgroundColor: "gold" }} />
              ) : (
                <Table>

                  <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                    {/* map an array to render table cells */}
                    <TableRow>
                      {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                      <TableCell
                        style={{
                          color: "black",
                          fontWeight: "700",
                          fontFamily: "Montserrat",
                        }}
                        key={head}
                        // create more space for the first element "Coin"
                        align={head === "Coin" ? "" : "right"}
                      >
                        {head}
                      </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map((row) => {
                      const profit = row.price_change_percentage_24h > 0;

                      const navigateToCurrency = () => {
                        navigate(`/coins/${row.id}`)
                      }

                      return (
                        <TableRow
                          onclick={navigateToCurrency}
                          className={classes.row}
                          key={row.id}
                        >
                          <Link to={`/coins/${row.id}`}>

                          {/* Cells of Coins */}
                          <TableCell 
                            component="th" 
                            scope="row"
                            style={{ 
                              display: "flex",
                              gap: 15, 
                            }}
                          >
                            <img
                              src={row.image}
                              alt={row.name}
                              height="50"
                              style={{ marginBottom: 10 }}
                            />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ textTransform: "uppercase", fontSize: 22 }}>
                                {row.symbol}
                              </span>
                              <span style={{ color: "darkgray" }}>
                                {row.name}
                              </span>
                            </div>
                          </TableCell>
                          </Link>

                          {/* Cells of Prices */}
                          <TableCell align='right'>
                            {symbol}{" "}
                            {numberWithCommas(row.current_price.toFixed(2))}
                          </TableCell>

                          {/* Cells of 24h Change */}
                          <TableCell
                            align="right"
                            style={{ color: profit > 0 ? "rgb(14, 203, 129)" : "red", fontWeight: 500 }}
                          >
                            {profit && "+"}
                            {row.price_change_percentage_24h.toFixed(2)}%
                          </TableCell>

                          {/* Cells of Market Cap */}
                          <TableCell align="right">
                            {symbol}{" "}
                            {numberWithCommas(row.market_cap.toString().slice(0, -6))}M {/* remove the last 6 digits */}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>

                </Table>
              )
            }
          </TableContainer>

          {/* Pagination */}
          <Pagination
            style={{
              padding: 20,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
            classes={{ ul: classes.pagination }}
            count={( handleSearch()?.length/10 ).toFixed(0)}
            // When clicked, set the page value and scroll the page to the top
            onChange={(_, value) => {
              setPage(value);
              window.scroll(0, 450);
            }}
          />

        </Container>
      </ThemeProvider>
    </div>
  )
}

export default CoinsTable