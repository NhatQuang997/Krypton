// Chakra imports
import {
  Button,
  Flex,
  Text,
  Checkbox,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Apis, { endpoints } from "configs/Apis";
import cookies from "react-cookies";


const Account = () => {
  const language = useSelector((state) => state.languages.language);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const [isDisable, setIsDisable] = useState(true)
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );



  return (
    <Card p='16px' mt='24px'>
      <CardHeader>
        <Flex justify='space-between' align='center' minHeight='60px' w='100%'>
          <Text fontSize='lg' color={textColor} fontWeight='bold'>
            {language.Account}
          </Text>
          <Button onClick={onOpen} bg={bgButton} color='white' fontSize='xs' variant='no-hover'>
            {language.Link_account}
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
      
      </CardBody>

      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{language.Policy}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
           {language.Policies}
           <Checkbox mt='12px' alignItems="baseline">{language.Policy_1}</Checkbox>
           <Checkbox mt='12px' alignItems="baseline">{language.Policy_2}</Checkbox>
           <Checkbox mt='12px' alignItems="baseline">{language.Policy_3}</Checkbox>
           <Checkbox mt='12px' alignItems="baseline">{language.Policy_4}</Checkbox>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {language.Cancel}
            </Button>
            <Button colorScheme='blue' ml={3} disabled={isDisable}>
              {language.Agree}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default Account;
