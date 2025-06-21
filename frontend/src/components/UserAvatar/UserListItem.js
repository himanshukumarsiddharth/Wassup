import React from 'react'
import { Box,Text, Avatar,Flex } from "@chakra-ui/react"
import { ChatState } from '../../Context/ChatProvider'

const UserListItem = ({ user, handleFunction}) => {
    return (
        <Flex
          gap="4"
          marginY="3"
          onClick={handleFunction}
          cursor="pointer"
          bg="#E8E8E8"
          _hover={{
            background: "#38B2AC",
            color: "white",
          }}
          w="100%"
          d="flex"
          alignItems="center"
          color="black"
          px={3}
          py={2}
          mb={2}
          borderRadius="lg"
        >
          <Avatar.Root>
            <Avatar.Fallback name={user.name} />
            <Avatar.Image src={user.pic} />
          </Avatar.Root>
          <Box>
            <Text>{user.name}</Text>
            <Text fontSize="xs">
              <b>Email : </b>
              {user.email}
            </Text>
          </Box>
        </Flex>
      );
}

export default UserListItem