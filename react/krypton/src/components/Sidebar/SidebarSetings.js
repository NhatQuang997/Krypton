import React, { useEffect, useState } from "react";
import { Flex, Text, Select, useColorMode, Switch } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ChangeLanguage } from "../../ActionCreators/LanguageCreator";
import Apis, { endpoints } from "configs/Apis";
import cookies from "react-cookies";
import { loginUser } from "../../ActionCreators/UserCreator";

export default function SidebarSetings() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.languages.language);
  const user = useSelector((state) => state.user.user);
  const { colorMode, toggleColorMode } = useColorMode();

  const [currentLanguage, setCurrentLangluage] = useState('ENG')

  useEffect(() => {
    if (user) {
      if (
        (user.dark_mode & (colorMode === "light")) |
        (!user.dark_mode & (colorMode === "dark"))
      ) {
        toggleColorMode();
      }
      dispatch(ChangeLanguage(user.language));
      setCurrentLangluage(user.language)
    }
  });

  const changeMode = async () => {
    const formData = new FormData();
    formData.append("dark_mode", colorMode == "dark" ? false : true);
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

  const changeLanguage = async (e) => {
    const formData = new FormData();
    formData.append("language", e);
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
  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Text fontSize="md" fontWeight="600" mb="4px">
          Dark/Light
        </Text>
        <Switch
          onChange={changeMode}
          colorScheme="teal"
          value={colorMode === "light" ? false : true}
        />
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Select onChange={(e) => changeLanguage(e.target.value)}>
          <option value="VNI" selected={"VNI" === currentLanguage ? true : false}>
            Tiếng Việt
          </option>
          <option value="ENG" selected={"ENG" === currentLanguage ? true : false}>
            English
          </option>
        </Select>
      </Flex>
    </Flex>
  );
}
