import React, { useEffect, useState } from 'react'
import { CryptoState } from '../CryptoContext';
import { HistoricalChart } from '../config/api';
import { CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { chartDays } from '../config/data';
import SelectButton from './SelectButton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const CoinInfo = ({ coin }) => {

  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);

  const { currency } = CryptoState();

  const fetchHistoricalData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency))

    setHistoricalData(data.prices);
  }

  // console.log("data", historicalData);

  useEffect(() => {
    fetchHistoricalData();
    // eslint-disable-next-line
  }, [currency, days]);

  // dark theme
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  // Material UI styles
  const useStyles = makeStyles(() => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      "@media (max-width: 900px)": {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();
  

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>

        {/* circular loading */}
        {!historicalData 
          ? (<CircularProgress style={{ color: "gold" }} size={250} thickness={1} />)
          : ( 
            <>
              <Line 

                datasetIdKey='id'
                data={{
                  labels: historicalData.map((coin) => {
                    let date = new Date(coin[0]);
                    let time = date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()}PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;

                    return days === 1 ? time : date.toLocaleDateString();
                  }),

                  datasets: [
                    { 
                      id: 1,
                      data: historicalData.map((coin) => coin[1]),
                      label: `Price ( Past ${days} Days ) in ${currency}`,
                      borderColor: "#EEBC1D",
                    },
                  ],
                }}

                options={{
                  elements: {
                    point: {
                      radius: 1, // reduce the points size of the chart
                    },
                  },
                }}
              />

              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                {chartDays.map(day => (
                  <SelectButton 
                    key={day.value} 
                    onClick={() => setDays(day.value)}
                    selected={day.value === days} // equal to the state of day
                  >
                    {day.label}
                  </SelectButton>
                ))}
              </div>
            </> )
        }

        


        {/* buttons */}

      </div>
    </ThemeProvider>
  )
}

export default CoinInfo