import { Box, Stack, Text, Button, Avatar, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { Toaster,toast } from 'react-hot-toast';
import groupChat from '../groupChat.png';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats, notification, setNotification } = ChatState();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast("Error Occured!",  {duration: 1200});
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(sessionStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <><Toaster position="top-center" /><Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={2}
      mx={3}
      marginBottom={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px">
      <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
      >My Chats
      <GroupChatModal>
        <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            background="#E8E8E8"
            color="black"
          >
            New Group Chat
            <i class="fa-solid fa-plus"></i>           
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="92%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack>
            {chats.map((chat) => (
              <Flex
                onClick={() => {setSelectedChat(chat); if(notification.length)setNotification(notification.filter((n) => n.chat._id !== chat._id));}}
                cursor="pointer"
                background={selectedChat?._id === chat?._id ? "#DAE9D5" : "#F6F9F5"}
                color="black"
                gap="1rem"
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                // position="relative"  
              >
                <Avatar.Root>
                  <Avatar.Image src={chat.isGroupChat ? groupChat : chat?.users.find(user=> user._id !== loggedUser._id)?.pic} />
                </Avatar.Root>
                <Text>
                <Text>
                  {!chat.isGroupChat
                    ? (getSender(loggedUser, chat.users))
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    {chat.isGroupChat && <b>{chat.latestMessage.sender._id == loggedUser._id ? "You" : chat.latestMessage.sender.name} : </b>}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
                </Text>
                {notification.length > 0 && notification.filter(notif=>notif.chat._id===chat._id).length>0 && (
              <Box
                marginLeft="8"
                marginTop="3"
                width="16px"
                height="16px"
                bg="red.500"
                color="white"
                fontSize="10px"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                zIndex="1"
              >
                {notification.filter(notif=>notif.chat._id===chat._id).length}
              </Box>
            )}
              </Flex>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      
    </Box>
    </>
  );
};

export default MyChats;