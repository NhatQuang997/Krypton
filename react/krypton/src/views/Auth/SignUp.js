// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  useColorModeValue,
  FormErrorMessage,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import "./auth.scss";
// Assets
import AvatarSVG from "assets/svg/avatar.svg";
import BgSignUp from "assets/img/BgSignUp.png";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "theme/components/loading";
import Apis, { endpoints } from "configs/Apis";
function SignUp() {
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const errorColor = useColorModeValue("red.400");

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const isNameError = (firstName == "") | (lastName == "");

  const [email, setEmail] = useState("");
  const isEmailError = email == "";

  const [password, setPassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordConfirmError, setIsPasswordConfirmError] = useState(false);

  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [isRegisterError, setIsRegisterError] = useState(false);

  const language = useSelector((state) => state.languages.language);
  const history = useHistory();
  const [avatar, setAvatar] = useState({
    picture: null,
    src: null,
  });

  const handlePictureSelected = (event) => {
    var picture = event.target.files[0];
    var src = URL.createObjectURL(picture);

    setAvatar({
      picture: picture,
      src: src,
    });
  };

  const handleFirstNameInputChange = (e) => setFirstName(e.target.value);
  const handleLastNameInputChange = (e) => setLastName(e.target.value);
  const handleEmailInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => {
    if (e.target.value.length < 6) {
      setPassword(e.target.value);
      setIsPasswordError(true);
    } else {
      setPassword(e.target.value);
      setIsPasswordError(false);
    }
  };
  const handlePasswordConfirmInputChange = (e) => {
    if (e.target.value != password) {
      setPasswordConfirm(e.target.value);
      setIsPasswordConfirmError(true);
    } else {
      setPasswordConfirm(e.target.value);
      setIsPasswordConfirmError(false);
    }
  };

  const submit = async (e) => {
    e.preventdefault;
    if (
      !isNameError &
      !isEmailError &
      !isPasswordError &
      !isPasswordConfirmError
    ) {
      setLoading(true);
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("username", email);
      formData.append("password", password);
      if (avatar.picture) formData.append("avatar", avatar.picture);
      try {
        let res = await Apis.post(endpoints["register"], formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status === 201) {
          setLoading(false);
          setIsRegisterSuccess(true)
          setTimeout(() => {
            history.push("/auth/signin")
          }, 2000)
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
        if (error.response.data.username) {
          setIsRegisterError(true);
        }
      }
    }
  };
  return (
    <Flex
      direction="column"
      alignSelf="center"
      justifySelf="center"
      overflow="hidden"
    >
      {loading ? <Loading /> : null}
      <Box
        position="absolute"
        minH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        borderRadius={{ md: "15px" }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        bgSize="cover"
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
      ></Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        mb="30px"
      >
        <Text fontSize="4xl" color="white" fontWeight="bold">
          {language.Wellcome}
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}
        >
          {language.Register_subtitle}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Flex
          direction="column"
          w="445px"
          background="transparent"
          borderRadius="15px"
          p="40px"
          mx={{ base: "100px" }}
          bg={bgColor}
          boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
          {!isRegisterError ? null : (
            <Alert status="error">
              <AlertIcon />
              {language.Error_register_email}
            </Alert>
          )}
          {!isRegisterSuccess ? null : (
            <Alert status="success">
              <AlertIcon />
              {language.Register_success}
            </Alert>
          )}
          <Text
            fontSize="xl"
            color={titleColor}
            fontWeight="bold"
            textAlign="center"
            mb="22px"
          >
            {language.Register}
          </Text>
          <form onSubmit={submit}>
            <FormControl>
              <div className="picture-container">
                <div className="picture">
                  <img
                    src={avatar.src ? avatar.src : AvatarSVG}
                    id="wizardPicturePreview"
                    className="picture-src"
                  />
                  <Input
                    type="file"
                    id="wizard-picture"
                    onChange={(e) => handlePictureSelected(e)}
                  />
                </div>
                <Text color={titleColor} fontWeight="bold" m="5px">
                  Avatar
                </Text>
              </div>
              <FormControl isInvalid={isNameError} mb="24px">
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  {language.Full_name}
                </FormLabel>
                <Flex
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  maxW="100%"
                  mt="0px"
                >
                  <Input
                    fontSize="sm"
                    ms="4px"
                    borderRadius="15px"
                    type="text"
                    placeholder={language.First_name}
                    size="lg"
                    value={firstName}
                    onChange={handleFirstNameInputChange}
                  />
                  <Input
                    fontSize="sm"
                    ms="4px"
                    borderRadius="15px"
                    type="text"
                    placeholder={language.Last_name}
                    size="lg"
                    value={lastName}
                    onChange={handleLastNameInputChange}
                  />
                </Flex>
                {!isNameError ? null : (
                  <FormErrorMessage>{language.Error_name}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={isEmailError} mb="24px">
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Email
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  borderRadius="15px"
                  type="email"
                  placeholder="Email"
                  size="lg"
                  value={email}
                  onChange={handleEmailInputChange}
                />
                {!isEmailError ? null : (
                  <FormErrorMessage>{language.Error_email}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={isPasswordError} mb="24px">
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  {language.Password}
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  borderRadius="15px"
                  type="password"
                  placeholder={language.Password}
                  size="lg"
                  value={password}
                  onChange={handlePasswordInputChange}
                />
                {!isPasswordError ? null : (
                  <FormErrorMessage>{language.Error_password}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={isPasswordConfirmError} mb="24px">
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  {language.Confirm_password}
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  borderRadius="15px"
                  type="password"
                  placeholder={language.Confirm_password}
                  size="lg"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmInputChange}
                />
                {!isPasswordConfirmError ? null : (
                  <FormErrorMessage>
                    {language.Error_confirm_password}
                  </FormErrorMessage>
                )}
              </FormControl>
              <Button
                type="submit"
                bg="teal.300"
                fontSize="10px"
                color="white"
                fontWeight="bold"
                w="100%"
                h="45"
                mb="24px"
                _hover={{
                  bg: "teal.200",
                }}
                _active={{
                  bg: "teal.400",
                }}
              >
                {language.Sign_up}
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
              {language.Already_have_an_account}
              <Link
                color={titleColor}
                as="span"
                ms="5px"
                href="#"
                fontWeight="bold"
                onClick={() => history.push("/auth/signin")}
              >
                {language.Sign_in}
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
