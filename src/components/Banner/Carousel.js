import { makeStyles } from '@mui/styles'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { TrendingCoins } from '../../config/api';
import { CryptoState } from '../../CryptoContext';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  carousel: {
    height: '50%',
    display: 'flex',
    alignItems: 'center',
  },
  carouselItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    textTransform: 'uppercase',
    color: 'white',
  }
}));

// regex pattern that places a marker (,) after 3 numbers
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {

  const [trending, setTrending] = useState([])

  const classes = useStyles();

  const { currency, symbol } = CryptoState();

  // fetch the api 
  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));

    setTrending(data);
  };
  console.log(trending);

  useEffect(() => {
    fetchTrendingCoins(); // Call the function when the component Carousel renders.
  }, [currency]) // Every time the currency changes, we fetch the coins.
  
  // Carousel responsive variable for the <AliceCarousel/> component.
  const responsive = {
    0: {              // Max 512px: display 2 items
      items: 2,
    },
    512: {            // Min 512px: display 4 items
      items: 4,
    },
  };


  // the items come from the trending state
  // map through it to collect the relative infos
  const items = trending.map((coin) => {

    // calculate the profit
    let profit = coin.price_change_percentage_24h >= 0;

    return (
      <Link
      className={classes.carouselItem}
      to={`/coins/${coin.id}`}
      > {/* help us navigate from one page to another */}

        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />

        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{ color: profit > 0 ? "rgb(14, 203, 128)" : "red", 
            fontWeight: 500, }}
          >{profit && "+"} {coin?.price_change_percentage_24h?.toFixed(2)}%</span>
        </span>

        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>

      </Link>
    )
  })

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  )
}

export default Carousel