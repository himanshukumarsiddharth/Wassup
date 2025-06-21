import React, {useEffect} from 'react'
import { Container,Center,Box,Text, Link, Tabs } from "@chakra-ui/react"
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    if (userInfo) navigate("/chats");
}, [navigate]);

  return (
    <Container maxW="xl" centerContent>       
            <Box  
            d="flex"
            justifyContent="center"
            p={3}
            bg="#F9F6EE"
            w="100%"
            m="100px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px">
                <Center><Text fontSize="4xl" fontFamily="Work sans">Wassup</Text></Center>
            </Box>
        <Box bg="#F9F6EE" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs.Root defaultValue="login">
      <Tabs.List>
        <Tabs.Trigger value="login" w="50%">
          <Link unstyled href="#login">
            Login
          </Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="signup" w="50%">
          <Link unstyled href="#signup">
            Sign Up
          </Link>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="login">{<Login />}</Tabs.Content>
      <Tabs.Content value="signup">{<Signup />}</Tabs.Content>
    </Tabs.Root>
        </Box>
    </Container>
  )
}

export default HomePage