import React from 'react'
import { Dialog, Button, Portal, Image, Text } from "@chakra-ui/react"

const ProfileModal = ({ isOpen, onOpenChange, user, children }) => {
    // Handle close button click explicitly
    const handleClose = () => {
        if (onOpenChange) {
            onOpenChange(false);
        }
    };
    
    return <>
    {/* {children ? (<span onClick={isOpen}>{children}</span>): (
     <i class="fa-solid fa-eye" onCLick={isOpen}></i>)} */}
        <Dialog.Root 
            open={isOpen} 
            onOpenChange={onOpenChange}
            key="center"
            placement="center"
            motionPreset="slide-in-bottom"
          >
            {/* Removed Dialog.Trigger as we're controlling it from parent */}
            {isOpen && (
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content alignItems="center">
                  <Dialog.Header>
                    <Dialog.Title fontSize="2xl">{user?.name}</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body display="flex" flexDirection="column" alignItems="center" textAlign="center" pt={4}>
                  <Image
                    src={user.pic}
                    boxSize="150px"
                    borderRadius="full"
                    fit="cover"
                    alt={user.name}
                  />
                    <Text fontFamily="Work sans" fontSize="xl" pt="3">{user?.email}</Text>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button variant="outline" onClick={handleClose}>Close</Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
            )}
          </Dialog.Root>
          </>
}

export default ProfileModal