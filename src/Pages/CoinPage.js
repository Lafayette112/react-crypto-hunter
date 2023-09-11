import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import { makeStyles } from '@mui/styles';
import { LinearProgress, Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import CoinInfo from '../components/CoinInfo';
import axios from 'axios';
import { numberWithCommas } from '../components/Banner/Carousel';

const CoinPage = () => {

  // fetch id from url
  const { id } = useParams(); // destructure id

  const [coin, setCoin] = useState() // store the api info in the coin state

  const { currency, symbol } = CryptoState(); // import CryptoState by destructuring currency and symbol

  // fetch the coin
  const fetchCoins = async () => {
    const { data } = await axios.get(SingleCoin(id));

    setCoin(data); // set the Coin state to the data that we get from the api 
  }

  // console.log(coin);

  // call the function in the useEffect
  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line
  }, []);

  // Styles of components with Material UI
  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      "@media (max-width: 900px)": {
        flexDirection: "column",
        alignItems: "center",
      },
    },

    sidebar: {
      width: "30%",
      "@media (max-width: 900px)": {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },

    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },

    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },

    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",

      "@media (max-width: 900px)": {
        display: "flex",
        justifyContent: "space-around",
      },
      "@media (max-width: 600px)": {
        flexDirection: "column",
        alignItems: "center",
      },
      "@media (max-width: 480px)": {
        alignItems: "start",
      },
    }
  }));

  const classes = useStyles();

  // if coin is not initialized, return <LinearProgress/>
  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />
  

  return (
    <div className={classes.container}>

      {/*sidebar*/}
      <div className={classes.sidebar}>
        <img 
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant='h3' className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography 
          variant="subtitle1" 
          className={classes.description}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(coin?.description.en.split(". ")[0] + ".")
          }}
        >
          
        </Typography>

        <div className={classes.marketData} style={{ width: {  } }}>

          {/* Rank */}
          <span style={{ display: "flex" }}>
            <Typography 
              variant='h5' 
              className={classes.heading}
            >
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{ fontFamily: "Montserrat" }}
            >
              {coin?.market_cap_rank}
            </Typography>
          </span>

          {/* Current Price */}
          <span style={{ display: "flex" }}>
            <Typography 
              variant='h5' 
              className={classes.heading}
            >
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{ fontFamily: "Montserrat" }}
            >
              {symbol}{" "}
              {numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}
            </Typography>
          </span>

          {/* Rank */}
          <span style={{ display: "flex" }}>
            <Typography 
              variant='h5' 
              className={classes.heading}
            >
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{ fontFamily: "Montserrat" }}
            >
              {symbol}{" "}
              {numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6))}M
            </Typography>
          </span>

        </div>
      </div>

      {/* chart */}
      <CoinInfo coin={coin} />

    </div>

  )
}

export default CoinPage