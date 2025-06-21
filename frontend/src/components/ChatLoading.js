import React from 'react'
import { HStack, Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react"

const ChatLoading = () => {
  return (
    <Stack spacing={4} width="100%">
      <Skeleton height="45px" width="100%" />
      <Skeleton height="45px" width="100%" />
      <Skeleton height="45px" width="100%" />
      <Skeleton height="45px" width="100%" />
      <Skeleton height="45px" width="100%" />
      <Skeleton height="45px" width="100%" />
      <Skeleton height="45px" width="100%" />
      <Skeleton height="45px" width="100%" />
    </Stack>
  )
}

export default ChatLoading