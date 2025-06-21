import React, {useState} from 'react'
import axios from "axios";
import { Toaster,toast } from 'react-hot-toast';
import { Button, CloseButton, Dialog, Portal, Box, Field, Input, Fieldset, Flex, Spinner } from "@chakra-ui/react"
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModel = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error(`Error Occured! error.response.data.message`, {duration: 1200,style: {
        fontSize: '12px',
        padding: '6px 10px',
        minHeight: 'auto',
      }});
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query)=> {
    setSearch(query);
if (!query) {
  return;
}

try {
  setLoading(true);
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.get(`/api/user?search=${search}`, config);
  console.log(data);
  setLoading(false);
  setSearchResult(data);
} catch (error) {
    toast.error(`Failed to Load the Search Results`, {duration: 1200,style: {
        fontSize: '12px',
        padding: '6px 10px',
        minHeight: 'auto',
      }});
      setLoading(false);
}       
}

const handleAddUser = async (user1) => {
  if (selectedChat.users.find((u) => u._id === user1._id)) {
    toast.error(`User Already in group!`, {duration: 1200,style: {
      fontSize: '12px',
      padding: '6px 10px',
      minHeight: 'auto',
    }});
    return;
  }

  if (selectedChat.groupAdmin._id !== user._id) {
    toast.error("Only admin can add a member!", {duration: 1200,style: {
        fontSize: '12px',
        padding: '6px 10px',
        minHeight: 'auto',
      }});
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/chat/groupadd`,
      {
        chatId: selectedChat._id,
        userId: user1._id,
      },
      config
    );

    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
  } catch (error) {
    toast.error(`${error.response.data.message}`,{duration: 1200,style: {
        fontSize: '12px',
        padding: '6px 10px',
        minHeight: 'auto',
      }});
    setLoading(false);
  }
  setGroupChatName("");
};

const handleRemove = async (user1) => {
  if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
    toast.error("Only admin can remove a member!", {duration: 1200,style: {
        fontSize: '12px',
        padding: '6px 10px',
        minHeight: 'auto',
      }});
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/chat/groupremove`,
      {
        chatId: selectedChat._id,
        userId: user1._id,
      },
      config
    );
    console.log("data",data);

    user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    fetchMessages();
    setLoading(false);
    if(user1._id === user._id) toast.success("You left the group!",{duration: 2000,style: {
      fontSize: '12px',
      padding: '6px 10px',
      minHeight: 'auto',
    }})
  } catch (error) {
    toast.error(`${error.response.data.message}`,{duration: 1200,style: {
      fontSize: '12px',
      padding: '6px 10px',
      minHeight: 'auto',
    }});
    setLoading(false);
  }
  setGroupChatName("");
};

    return (
      <>
      <Toaster position="top-center" />
        <Dialog.Root size="xs"  placement="center" motionPreset="slide-in-bottom">
          <Dialog.Trigger asChild>
            <Button ml="1.5" variant="outline" size="lg" border="none">
            <i class="fa-solid fa-circle-info"></i>
            </Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title mx="auto" mb="3" fontSize={{ base: "xl", md: "3xl" }} fontWeight="bold" fontFamily="heading">{selectedChat.chatName}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                  {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                  ))}
                </Box>
                <Flex alignItems="end">
                {/* <Fieldset.Root maxW="md">
                  <Fieldset.Content>
                      <Field.Root> */}
                      {/* <Field.Label>Chat Name</Field.Label> */}
                      <Input size="sm" name="name" placeholder="Chat Name" value={groupChatName} onChange={(e)=> setGroupChatName(e.target.value)}/>
                      {/* </Field.Root>
                  </Fieldset.Content>
                </Fieldset.Root> */}

              <Button size="sm" variant="solid" color="white" _hover={{ transform: "scale(1.02)"}} ml={1} isLoading={renameloading} onClick={handleRename}>
                Update
              </Button>
              </Flex>

              <Input mt="8px" size="sm" name="name" placeholder="Add User to group" mb={1} onChange={(e) => handleSearch(e.target.value)}/>

              {loading ? (
              <Spinner size="lg" />
            ) : (
              search && searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}

                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button size="sm" variant="solid" background="red" color="white" _hover={{ transform: "scale(1.02)"}} onClick={() => handleRemove(user)}>Leave Group</Button>
                  </Dialog.ActionTrigger>
                  {/* <Button>Save</Button> */}
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
        </>
      )
}

export default UpdateGroupChatModel