import React, {useState} from 'react';
import axios from "axios";
import { Button, Box, CloseButton, Dialog, Portal,Field, Fieldset, Input, Spinner} from "@chakra-ui/react";
import { Toaster,toast } from 'react-hot-toast';
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState();
    const [isOpen, setIsOpen] = useState(false);

    const { user, chats, setChats, setSelectedChat } = ChatState();

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

    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.some(item=>item._id===userToAdd._id)) {
            toast.error(`User already added`, {duration: 1200,style: {
                fontSize: '12px',
                padding: '6px 10px',
                minHeight: 'auto',
              }});
          return;
        }
    
        setSelectedUsers([...selectedUsers, userToAdd]);
      };

      const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers.length) {
          toast.error("Please fill all the fields", {duration: 1200,style: {
            fontSize: '12px',
            padding: '6px 10px',
            minHeight: 'auto',
          }});
          return;
        }
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            `/api/chat/group`,
            {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          );
          setChats([data, ...chats]);
          setIsOpen(false);
          setSelectedChat(data)
          toast.success(`New Group Chat Created`, {duration: 2000,style: {
            fontSize: '12px',
            padding: '6px 10px',
            minHeight: 'auto',
          }});
        } catch (error) {
          toast.error(`${error.response.data}`, {duration: 2000,style: {
            fontSize: '12px',
            padding: '6px 10px',
            minHeight: 'auto',
          }});
        }
      };

      const handleClose = () => {
        setIsOpen(false);
      };

    return (
        <><Toaster position="top-center" />
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen} placement="center">
      <Dialog.Trigger asChild>
        <span onClick={() => setIsOpen(true)} variant="outline" size="sm">
          {children}
        </span>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center">Create Group Chat</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Fieldset.Root size="lg" maxW="md">
                <Fieldset.Content>
                    <Field.Root>
                    <Field.Label>Chat Name</Field.Label>
                    <Input name="name" onChange={(e)=> setGroupChatName(e.target.value)}/>
                    </Field.Root>

                    <Field.Root>
                    <Field.Label>Add Users</Field.Label>
                    <Input name="email" type="email" placeholder='eg: Sid, John, Jack' onChange={(e)=> handleSearch(e.target.value)}/>
                    </Field.Root>
                </Fieldset.Content>
              </Fieldset.Root>

              <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

              {loading ? <Spinner/> : (search && searchResult?.slice(0,4).map(user=>(
                <UserListItem key={user._id}
                user={user}
                handleFunction={() => handleGroup(user)}/>
              )))}
            </Dialog.Body>
            {/* <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Flex gap="9">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={()=>handleSubmit()}>Create Group</Button>
                </Flex>
              </Dialog.ActionTrigger>
              
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}

            <Dialog.Footer>
              <Button variant="outline" _hover={{ transform: "scale(1.02)"}} onClick={handleClose}>
                Cancel
              </Button>
              <Button _hover={{ transform: "scale(1.02)"}} onClick={handleSubmit}>Create Group</Button>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
    </>
    )
}

export default GroupChatModal