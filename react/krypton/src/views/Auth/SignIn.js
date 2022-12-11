import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import cookies from "react-cookies";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  FormErrorMessage,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/signInImage.png";
import Loading from "theme/components/loading";
import Apis, { endpoints } from "configs/Apis";
import { loginUser } from "../../ActionCreators/UserCreator";
function SignIn() {
  const [email, setEmail] = useState("");
  const isEmailError = email == "";

  const [password, setPassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state.languages.language);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    if (user) {
      return history.push("/dashboard");
    }
  });

  // Chakra color mode
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");
  const errorColor = useColorModeValue("red.400");

  const handleEmailInputChange = (e) => setEmail(e.target.value);

  const handlePasswordInputChange = (e) => {
    if (e.target.value.length < 6) {
      setPassword(e.target.value);
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
      setPassword(e.target.value);
    }
  };

  const submit = async (e) => {
    e.preventdefault;
    setLoading(true);
    if (!isEmailError & !isPasswordError) {
      try {
        let info = await Apis.get(endpoints["oauth2"]);
        let res = await Apis.post(endpoints["login"], {
          client_id: info.data.client_id,
          client_secret: info.data.client_secret,
          username: email,
          password: password,
          grant_type: "password",
        });

        cookies.save("access_token", res.data.access_token);

        let user = await Apis.get(endpoints["current-user"], {
          headers: {
            Authorization: `Bearer ${cookies.load("access_token")}`,
          },
        });

        cookies.save("user", user.data);

        setError(false);
        setLoading(false);
        dispatch(loginUser(user.data));
        history.push("/home");
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(true);
      }
    }
  };

  return (
    <Flex position="relative" mb="40px">
      {loading ? <Loading /> : null}
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="32px" mb="10px">
              {language.Wellcome_back}
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColor}
              fontWeight="bold"
              fontSize="14px"
            >
              {language.Enter_email_pass_to_signin}
            </Text>
            {!error ? null : (
              <Text
                ms="4px"
                color={errorColor}
                fontWeight="bold"
                fontSize="14px"
              >
                {language.Error_signin}
              </Text>
            )}
            <form onSubmit={submit}>
              <FormControl isInvalid={isEmailError} mb="15px">
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Email
                </FormLabel>
                <Input
                  borderRadius="15px"
                  fontSize="sm"
                  placeholder="Email"
                  size="lg"
                  type="email"
                  value={email}
                  onChange={handleEmailInputChange}
                />
                {!isEmailError ? null : (
                  <FormErrorMessage>{language.Error_email}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={isPasswordError}>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Password
                </FormLabel>
                <Input
                  borderRadius="15px"
                  fontSize="sm"
                  placeholder={language.Password}
                  size="lg"
                  type="password"
                  value={password}
                  onChange={handlePasswordInputChange}
                />
                {!isPasswordError ? null : (
                  <FormErrorMessage>{language.Error_password}</FormErrorMessage>
                )}
                <Button
                  fontSize="10px"
                  type="submit"
                  bg="teal.300"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: "teal.200",
                  }}
                  _active={{
                    bg: "teal.400",
                  }}
                >
                  {language.Sign_in}
                </Button>
              </FormControl>
            </form>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px"
            >
              <Text color={textColor} fontWeight="medium">
                {language.Dont_have_account}
                <Link
                  color={titleColor}
                  as="span"
                  ms="5px"
                  fontWeight="bold"
                  onClick={() => history.push("/auth/signup")}
                >
                  {language.Sign_up}
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="40vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius="20px"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
