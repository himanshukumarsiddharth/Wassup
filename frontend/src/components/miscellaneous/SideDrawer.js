import React, {useState} from 'react'
import { Box, Button, Text, Menu, Portal, Flex, Avatar, Drawer, CloseButton, Input, Spinner } from "@chakra-ui/react"
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal"
import ChatLoading from "../ChatLoading"
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from "../../config/ChatLogics";
import { useNavigate } from "react-router-dom";
import { Toaster,toast } from 'react-hot-toast';
import axios from 'axios';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [open, setOpen] = useState(false)

    const { user,setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const navigate = useNavigate();

    const logoutHandler = () => {
        sessionStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async(query) => {
        // if(!search)toast.error("Enter email or name to Search", {duration: 1200});
        setSearch(query);
        // setTimeout(async ()=>{
        try {
            setLoading(true);
      
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
      
            const { data } = await axios.get(`/api/user?search=${search}`, config);
      
            setLoading(false);
            setSearchResult(data);
          } catch (error) {
            toast.error("Failed to Load the Search Results", {duration: 1200});
          }
        // },3000)        
    }

    const accessChat = async(userId) => {
        try{
            setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(!open);
    } catch (error) {
      toast("Error fetching the chat", {duration: 1200})
    }
    }

    return <>
    <Toaster position="top-center" />
    <Box display="flex" justifyContent={'space-between'} alignItems={"center"} background={'white'} p="10px 10px 5px 10px" borderWidth={"5px"}>
      <Button variant="ghost" size="sm" onClick={()=> setOpen(open=>!open)}>
          <i className="fa-solid fa-magnifying-glass"></i>
              <Text display={{ base: "none", md: "block" }} px="4"> Search User</Text>
      </Button>
      <Text fontSize="3xl" fontWeight="bold" fontFamily="Work sans" transition="color 0.3s ease" cursor="pointer" _hover={{ color: "#25D366" }}>Wassup</Text>
      <div>
      <Menu.Root>
        <Menu.Trigger asChild>
          {/* <Button variant="ghost" size="m" px="8">
          <i className="fa-solid fa-bell"></i>
          </Button> */}

          <Box position="relative" display="inline-block">
            <Button variant="ghost" size="m" px="8">
              <i className="fa-solid fa-bell"></i>
            </Button>

            {notification.length > 0 && (
              <Box
                position="absolute"
                top="1"
                right="6"
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
                {[...new Map(notification.map(n => [n.chat._id, n])).values()].length}
              </Box>
            )}
          </Box>

        </Menu.Trigger>
        {/* <Portal> */}
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item>{!notification.length && "No New Messages"}</Menu.Item>
              {notification.map((notif) => (
                <Menu.Item
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        {/* </Portal> */}
        </Menu.Root>
          <Menu.Root>
              <Menu.Trigger asChild>           
                  <Button variant="ghost" size="m" px="20px">
                      <Flex>
                      <Avatar.Root size="sm" cursor="pointer">
                          <Avatar.Fallback name={user.name}/>
                          <Avatar.Image src={user.pic} />
                      </Avatar.Root>
                          <Text py="7px" px="10px"><i className="fa-solid fa-angle-down"></i></Text>
                      </Flex>
                  </Button>   
              </Menu.Trigger>
              {/* <Portal> */}
              <Menu.Positioner>
              <Menu.Content>
                  <Menu.Item value="my-profile" onSelect={() => setIsProfileOpen(true)}>My Profile</Menu.Item>
                  <Menu.Item value="logout" onClick={logoutHandler}>Logout</Menu.Item>
              </Menu.Content>
              </Menu.Positioner>
              {/* </Portal> */}
          </Menu.Root>
      </div>
      </Box>
      
      <ProfileModal isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} user={user} />

      <Drawer.Root placement="start" open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Drawer.Trigger>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Search Users</Drawer.Title>
                  </Drawer.Header>
                  <Drawer.Body>                    
                    <Box display="flex" pb="2">
                        <Input placeholder="Search by name or email" mr="2" value={search} onChange={(e)=> handleSearch(e.target.value)}/>
                        {/* <Toaster position="top"/><Button onClick={handleSearch}>Go</Button> */}
                    </Box>
                    {loading ? (<ChatLoading />) : (
                        search && searchResult?.map(user=>(
                            <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)} />
                        ))
                    )}
                    {loadingChat && <Spinner ml="auto" display="flex" />}
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Drawer.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Drawer.ActionTrigger>
                  </Drawer.Footer>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
    </>
}

export default SideDrawer 