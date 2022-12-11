// Chakra imports
import { Flex, Grid, SimpleGrid } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MiniStatistics from "./components/MiniStatistics";
import Account from "./components/Account";

import BTC from "assets/img/Bitcoin.png";
import ETH from "assets/img/Ethereum.png";
import PLUS from "assets/img/Plus.png";

import Apis, { endpoints } from "configs/Apis";
import cookies from "react-cookies";

export default function Dashboard() {
  const language = useSelector((state) => state.languages.language);
  const [favoriteCoins, setFavoriteCoins] = useState([]);

  const fecthData = async () => {
    try {
      let coins = await Apis.get(endpoints["favorite-coins"], {
        headers: {
          Authorization: `Bearer ${cookies.load("access_token")}`,
        },
      });
      if (coins.data.length > 0) {
        setFavoriteCoins(coins.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px" mb="26px">
        <MiniStatistics
          name={"Bitcoin"}
          url={"wss://stream.binance.com:9443/ws/btcusdt@ticker"}
          icon={BTC}
        />
        <MiniStatistics
          name={"Ethereum"}
          url={"wss://stream.binance.com:9443/ws/ethusdt@ticker"}
          icon={ETH}
        />
        {favoriteCoins[0] ? (
          <MiniStatistics
            name={favoriteCoins[0].name}
            url={favoriteCoins[0].url}
            icon={favoriteCoins[0].logo}
            id={favoriteCoins[0].id}
            fecthData={fecthData}
          />
        ) : (
          <MiniStatistics
            name={language.Add_coin}
            icon={PLUS}
            note={language.Only_binance}
            fecthData={fecthData}
          />
        )}

        {favoriteCoins[1] ? (
          <MiniStatistics
            name={favoriteCoins[1].name}
            url={favoriteCoins[1].url}
            icon={favoriteCoins[1].logo}
            id={favoriteCoins[1].id}
            fecthData={fecthData}
          />
        ) : (
          <MiniStatistics
            name={language.Add_coin}
            icon={PLUS}
            note={language.Only_binance}
            fecthData={fecthData}
          />
        )}
      </SimpleGrid>
      <Account/>
    </Flex>
  );
}
