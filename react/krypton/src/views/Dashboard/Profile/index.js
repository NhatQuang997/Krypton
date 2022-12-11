// Chakra imports
import { Flex, Grid, useColorModeValue } from "@chakra-ui/react";
import ProfileBgImage from "assets/img/ProfileBackground.png";
import React, {useEffect, useState} from "react";
import { FaPenFancy } from "react-icons/fa";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import ProfileInformation from "./components/ProfileInformation";
import { useSelector } from "react-redux";
import AvatarSVG from "assets/svg/avatar.svg";
import {host} from '../../../configs/Apis'
function Profile() {
  const [avatar, setAvatar] = useState(AvatarSVG);
  const user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.languages.language);
  const [edit, setEdit] = useState(false)

  useEffect(()=>{
    if (user.avatar != null) {
      setAvatar(`${host}static${user.avatar}`);
    }
  })

  const save = () => {

  }
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  return (
    <Flex direction='column'>
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={avatar}
        name={user.first_name + " " + user.last_name}
        email={user.username}
        tabs={[
          {
            name: language.Edit,
            icon: <FaPenFancy w='100%' h='100%' />,
            event: setEdit
          }
        ]}
      />
      <Grid templateColumns={{ sm: "1fr", xl: "repeat(2, 1fr)" }} gap='22px'>
        <PlatformSettings
          title={language.Settings}
          subtitle1={language.Account}
        />
        <ProfileInformation
          title={language.Information}
          description={
            "Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
          }
          name={"Esthera Jackson"}
          email={"esthera@simmmple.com"}
        />
      </Grid>
    </Flex>
  );
}

export default Profile;
