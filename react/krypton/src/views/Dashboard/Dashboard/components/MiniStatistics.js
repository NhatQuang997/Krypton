// Chakra imports
import {
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Avatar,
  useColorModeValue,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Apis, { endpoints } from "configs/Apis";
import cookies from "react-cookies";

const MiniStatistics = ({ name, url, icon, id, note, fecthData }) => {
  const language = useSelector((state) => state.languages.language);

  const textColor = useColorModeValue("gray.700", "white");
  const [percentage, setPercentage] = useState(0);
  const [amount, setAmount] = useState(0);
  const [coin, setCoin] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const wsRef = useRef();

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, "Deliberate disconnection");
      wsRef.current = undefined;
    }
    if (!wsRef.current && url) {
      wsRef.current = new WebSocket(url);
      wsRef.current.onmessage = (msg) => {
        let data = JSON.parse(msg.data);
        setAmount(parseFloat(data.c).toFixed(3));
        setPercentage(data.P);
      };
    }
  }, [url]);

  const addCoin = async () => {
    if (coin) {
      const formData = new FormData();
      if (id) {
        formData.append("old", id);
      }
      formData.append("symbol", coin);
      try {
        let add = await Apis.post(endpoints["favorite-coins"], formData, {
          headers: {
            Authorization: `Bearer ${cookies.load("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (add.status === 200) {
          if (isOpen) {
            setIsOpen(false);
          }
          return fecthData();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <AlertDialog isOpen={isOpen}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {language.Add_coin}
            </AlertDialogHeader>

            <AlertDialogBody>
              <Input
                variant="flushed"
                placeholder={language.Only_binance}
                onChange={(e) => setCoin(e.target.value)}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => setIsOpen(false)}>
                {language.Cancel}
              </Button>
              <Button colorScheme="green" onClick={addCoin} ml={3}>
                {language.Save}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Card
        minH="83px"
        _hover={{ cursor: id ? "pointer" : "", opacity: id ? 0.8 : "" }}
        onClick={() => (id ? setIsOpen(true) : "")}
      >
        <CardBody>
          <Flex flexDirection="row" align="center" justify="center" w="100%">
            <Stat me="auto">
              <StatLabel
                fontSize="sm"
                color="gray.400"
                fontWeight="bold"
                pb=".1rem"
              >
                {name}
              </StatLabel>
              <Flex>
                {!note ? (
                  <>
                    <StatNumber fontSize="lg" color={textColor}>
                      {amount}
                    </StatNumber>
                    <StatHelpText
                      alignSelf="flex-end"
                      justifySelf="flex-end"
                      m="0px"
                      color={percentage > 0 ? "green.400" : "red.400"}
                      fontWeight="bold"
                      ps="3px"
                      fontSize="md"
                    >
                      {percentage > 0 ? `+${percentage}%` : `${percentage}%`}
                    </StatHelpText>
                  </>
                ) : (
                  <Input
                    variant="flushed"
                    placeholder={note}
                    onChange={(e) => setCoin(e.target.value)}
                  />
                )}
              </Flex>
            </Stat>
            {!note ? (
              <Avatar size="md" src={icon} />
            ) : (
              <Avatar
                size="md"
                src={icon}
                _hover={{ cursor: "pointer", opacity: 0.8 }}
                onClick={addCoin}
              />
            )}
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default MiniStatistics;
