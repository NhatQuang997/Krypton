// Chakra imports
import { Flex, Switch, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cookies from "react-cookies";
import Apis, { endpoints } from "configs/Apis";
import { loginUser } from "../../../../ActionCreators/UserCreator";

const PlatformSettings = ({ title, subtitle1 }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.languages.language);
  const user = useSelector((state) => state.user.user);

  const [emailWhenFollow, setEmailWhenFollow] = useState(false);
  const [emailWhenHitTPSL, setEmailWhenHitTPSL] = useState(false);

  useEffect(() => {
    if (user) {
      setEmailWhenFollow(user.email_when_follows);
      setEmailWhenHitTPSL(user.email_when_hit_sl_tp);
    }
  });

  const handle_email_when_follow = async () => {
    const formData = new FormData();
    formData.append("email_when_follows", emailWhenFollow ? false : true);
    try {
      await Apis.patch(endpoints["register"], formData, {
        headers: {
          Authorization: `Bearer ${cookies.load("access_token")}`,
        },
      });
      let user = await Apis.get(endpoints["current-user"], {
        headers: {
          Authorization: `Bearer ${cookies.load("access_token")}`,
        },
      });
      cookies.save("user", user.data);
      dispatch(loginUser(user.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handle_email_when_hit_sl_tp = async () => {
    const formData = new FormData();
    formData.append("email_when_hit_sl_tp", emailWhenHitTPSL ? false : true);
    try {
      await Apis.patch(endpoints["register"], formData, {
        headers: {
          Authorization: `Bearer ${cookies.load("access_token")}`,
        },
      });
      let user = await Apis.get(endpoints["current-user"], {
        headers: {
          Authorization: `Bearer ${cookies.load("access_token")}`,
        },
      });
      cookies.save("user", user.data);
      dispatch(loginUser(user.data));
    } catch (error) {
      console.error(error);
    }
  };

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Card p="16px">
      <CardHeader p="12px 5px" mb="12px">
        <Text fontSize="lg" color={textColor} fontWeight="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody px="5px">
        <Flex direction="column">
          <Text fontSize="sm" color="gray.500" fontWeight="600" mb="20px">
            {subtitle1}
          </Text>
          <Flex align="center" mb="20px">
            <Switch
              colorScheme="teal"
              me="10px"
              isChecked={emailWhenFollow}
              onChange={handle_email_when_follow}
            />
            <Text noOfLines={1} fontSize="md" color="gray.500" fontWeight="400">
              {language.Email_when_follows_me}
            </Text>
          </Flex>
          <Flex align="center" mb="20px">
            <Switch
              colorScheme="teal"
              me="10px"
              isChecked={emailWhenHitTPSL}
              onChange={handle_email_when_hit_sl_tp}
            />
            <Text noOfLines={1} fontSize="md" color="gray.500" fontWeight="400">
              {language.Email_when_hit_sl_tp}
            </Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default PlatformSettings;
