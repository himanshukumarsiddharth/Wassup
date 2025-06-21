// import React, {useState, useEffect } from 'react'
// import { Box, Text, Flex, Avatar, Button, Spinner,Input } from "@chakra-ui/react";
// // import EmojiPicker from "emoji-picker-react";
// import axios from "axios";
// import { Toaster,toast } from 'react-hot-toast';
// import "./styles.css";
// import { ChatState } from "../Context/ChatProvider";
// import { getSender, getSenderFull } from "../config/ChatLogics";
// import ProfileModal from "./miscellaneous/ProfileModal";
// import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
// import ScrollableChat from "./ScrollableChat";
// import chatBackground from '../chat-background.png';
// import background from '../background.png';
// import io from "socket.io-client";
// const ENDPOINT = "http://localhost:5000";
// var socket, selectedChatCompare;

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//     const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
//     const [isProfileOpen, setIsProfileOpen] = useState(false);
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [newMessage, setNewMessage] = useState("");
//     const [socketConnected, setSocketConnected] = useState(false);
//     const [typing, setTyping] = useState(false);
//     // const [showPicker, setShowPicker] = useState(false);
//     const [isTyping, setIsTyping] = useState(false);

//     const fetchMessages = async () => {
//       if (!selectedChat) return;
  
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
  
//         setLoading(true);
  
//         const { data } = await axios.get(
//           `/api/message/${selectedChat._id}`,
//           config
//         );
//         // console.log(messages)
//         setMessages(data);
//         setLoading(false);

//         console.log(socket)
  
//         socket.emit("join chat", selectedChat._id);
//       } catch (error) {
//         toast.error("Failed to load messages",{duration: 1200,style: {
//           fontSize: '12px',
//           padding: '6px 10px',
//           minHeight: 'auto',
//         }});
//       }
//     };

//     // const onEmojiClick = (emojiData, event) => {
//     //   console.log("emoji",emojiData)
//     //   setNewMessage((prev) => prev + emojiData.emoji);
//     // };

//     const sendMessage = async (event) => {
//       if (event.key === "Enter" && newMessage) {
//         socket.emit("stop typing", selectedChat._id);
//         try {
//           const config = {
//             headers: {
//               "Content-type": "application/json",
//               Authorization: `Bearer ${user.token}`,
//             },
//           };
//           setNewMessage("");
//           const { data } = await axios.post(
//             "/api/message",
//             {
//               content: newMessage,
//               chatId: selectedChat,
//             },
//             config
//           );
//           // console.log(data)
//           socket.emit("new message", data);
//           setMessages([...messages, data]);
//         } catch (error) {
//           toast.error("Failed to send the Message",{duration: 1200,style: {
//             fontSize: '12px',
//             padding: '6px 10px',
//             minHeight: 'auto',
//           }});
//         }
//       }
//     }

//     const typingHandler = (e) => {
//       setNewMessage(e.target.value);
  
//       if (!socketConnected) return;
  
//       if (!typing) {
//         setTyping(true);
//         socket.emit("typing", selectedChat._id);
//       }
//       let lastTypingTime = new Date().getTime();
//       var timerLength = 2000;
//       setTimeout(() => {
//         var timeNow = new Date().getTime();
//         var timeDiff = timeNow - lastTypingTime;
//         if (timeDiff >= timerLength && typing) {
//           socket.emit("stop typing", selectedChat._id);
//           setTyping(false);
//         }
//       }, timerLength);
//     };

//     useEffect(() => {
//       socket = io(ENDPOINT);
//       socket.emit("setup", user);
//       socket.on("connected", () => setSocketConnected(true));
//       socket.on("typing", () => setIsTyping(true));
//       socket.on("stop typing", () => setIsTyping(false));  
//       // eslint-disable-next-line
//     }, []);

//     useEffect(() => {
//       fetchMessages(); 
//       selectedChatCompare = selectedChat;
//     }, [selectedChat]);

//     useEffect(() => {
//       socket.on("message recieved", (newMessageRecieved) => {
//         if (
//           !selectedChatCompare ||
//           selectedChatCompare._id !== newMessageRecieved.chat._id
//         ) {
//           if (!notification.includes(newMessageRecieved)) {
//             setNotification([newMessageRecieved, ...notification]);
//             setFetchAgain(!fetchAgain);
//           }
//         } else {
//           setMessages([...messages, newMessageRecieved]);
//         }
//       });
//     });

//     return (
//     <>
//         {selectedChat ? (
//             <>
//              <Text
//             fontSize={{ base: "28px", md: "30px" }}
//             pb={3}
//             px={2}
//             w="100%"
//             fontFamily="Work sans"
//             display="flex"
//             justifyContent={{ base: "flex-start" }}
//             alignItems="center"
//           >
//             {/* <i class="fa-solid fa-arrow-left fa-sm" style={{ cursor: 'pointer', marginTop: "12px", display: window.innerWidth < "768px" ? "flex" : "none" }} onClick={()=> setSelectedChat("")}></i> */}
//             <Box
//                 as="i"
//                 className="fa-solid fa-arrow-left fa-sm"
//                 cursor="pointer"
//                 marginTop="5px"
//                 marginRight="10px"
//                 display={{ base: "flex", md: "none" }}
//                 onClick={() => setSelectedChat("")}
//             />
//             {(!selectedChat.isGroupChat ? (
//                 <>
//                   <Button variant="ghost" size="m" px="20px" onClick={() => setIsProfileOpen(true)} _hover={{ bg: "transparent" }} borderRadius="50%">
//                       {/* <Flex> */}
//                       <Avatar.Root size="md" cursor="pointer" _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" }}>
//                           <Avatar.Image src={getSenderFull(user, selectedChat.users).pic} />
//                       </Avatar.Root>
//                       {/* </Flex> */}
//                   </Button>
//                   {getSender(user, selectedChat.users)}
//                   <ProfileModal isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} 
//                     user={getSenderFull(user, selectedChat.users)}
//                   />
//                 </>
//               ) : (
//                 <>
//                   {selectedChat.chatName.toUpperCase()}
//                   <UpdateGroupChatModal
//                     fetchMessages={fetchMessages}
//                     fetchAgain={fetchAgain}
//                     setFetchAgain={setFetchAgain} 
//                   />
//                 </>
//               ))}
//             </Text>
//             <Toaster position="top-center" />
//             <Box
//             display="flex"
//             flexDir="column"
//             justifyContent="flex-end"
//             p={3}
//             bg="#E8E8E8"
//             w="100%"
//             h="100%"
//             borderRadius="lg"
//             overflowY="hidden"
//             bgAttachment="fixed" bgImage={`url(${chatBackground})`} bgSize="cover" bgRepeat="no-repeat"
//           >
//             {loading ? (
//               <Spinner size="xl" width="20" height="20" alignSelf="center" margin="auto"/>
//             ): (
//               <>
//               <div className="messages" style={{ height: "100vh" }}>
//                 <ScrollableChat messages={messages} isGroupChat={selectedChat.isGroupChat}/>
//               </div>
//               </>
//             )}
//           </Box>
//           {isTyping ? (
//             <Box w="100%" background="transparent">
//                 <div className="typing-indicator">
//                 <span className="typing-dot"></span>
//                 <span className="typing-dot"></span>
//                 <span className="typing-dot"></span>
//               </div>
//               </Box>
//               ) : (
//                 <></>
//               )}
//               {/* <Flex> */}
//             <Input onKeyDown={sendMessage} variant="filled" background="#E0E0E0" value={newMessage} placeholder="Enter a message..." mt={3} mb={2} onChange={typingHandler}/>
//             {/* <Button onClick={() => setShowPicker(!showPicker)}>😊</Button>
//             {showPicker && (
//         <div style={{ position: "absolute", bottom: "40px", right: 0, zIndex: 1000 }}>
//           <EmojiPicker onEmojiClick={onEmojiClick} />
//         </div>
//       )} */}
//            {/* </Flex> */}
//             </>
//         ) : (
//             <Box display="flex" border="none" alignItems="center" bgAttachment="fixed" bgImage={`url(${background})`} bgSize="cover" bgRepeat="no-repeat" justifyContent="center" bgColor="rgba(0, 0, 0, 0.6)" bgBlendMode="overlay" h="100%" width="100%">
//               <Text fontSize="5xl" fontFamily="Work sans" color="white" fontWeight="bold">
//             Click on a user to start chatting
//           </Text>
//         </Box>
//         )}
//     </>
//   );
// }

// export default SingleChat

// import React, {useState, useEffect, useRef } from 'react'
// import { Box, Text, Flex, Avatar, Button, Spinner, Input, IconButton } from "@chakra-ui/react";
// import axios from "axios";
// import { Toaster,toast } from 'react-hot-toast';
// import "./styles.css";
// import { ChatState } from "../Context/ChatProvider";
// import { getSender, getSenderFull } from "../config/ChatLogics";
// import ProfileModal from "./miscellaneous/ProfileModal";
// import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
// import ScrollableChat from "./ScrollableChat";
// import chatBackground from '../chat-background.png';
// import background from '../background.png';
// import io from "socket.io-client";

// const ENDPOINT = "http://localhost:5000";
// var socket, selectedChatCompare;

// // Emoji data - popular emojis organized by category
// const emojiData = [
//   { category: "Smileys", emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐"] },
//   { category: "Hearts", emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"] },
//   { category: "Gestures", emojis: ["👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏", "🙌", "🤲", "🤝", "🙏"] },
//   { category: "Objects", emojis: ["🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🏅", "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥅", "🎯", "🎮", "🎲", "🎭", "🎨", "🎪", "🎫", "🎬", "🎤", "🎧", "🎼", "🎵", "🎶", "🎹", "🥁", "🎷", "🎺", "🎸", "🎻"] }
// ];

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//     const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
//     const [isProfileOpen, setIsProfileOpen] = useState(false);
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [newMessage, setNewMessage] = useState("");
//     const [socketConnected, setSocketConnected] = useState(false);
//     const [typing, setTyping] = useState(false);
//     const [isTyping, setIsTyping] = useState(false);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const [cursorPosition, setCursorPosition] = useState(0);
    
//     const inputRef = useRef(null);
//     const emojiPickerRef = useRef(null);

//     const fetchMessages = async () => {
//       if (!selectedChat) return;
  
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
  
//         setLoading(true);
  
//         const { data } = await axios.get(
//           `/api/message/${selectedChat._id}`,
//           config
//         );
//         setMessages(data);
//         setLoading(false);

//         console.log(socket)
  
//         socket.emit("join chat", selectedChat._id);
//       } catch (error) {
//         toast.error("Failed to load messages",{duration: 1200,style: {
//           fontSize: '12px',
//           padding: '6px 10px',
//           minHeight: 'auto',
//         }});
//       }
//     };

//     const sendMessageHandler = async () => {
//       if (!newMessage.trim()) return;
      
//       socket.emit("stop typing", selectedChat._id);
//       try {
//         const config = {
//           headers: {
//             "Content-type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         setNewMessage("");
//         const { data } = await axios.post(
//           "/api/message",
//           {
//             content: newMessage,
//             chatId: selectedChat,
//           },
//           config
//         );
//         socket.emit("new message", data);
//         setMessages([...messages, data]);
//       } catch (error) {
//         toast.error("Failed to send the Message",{duration: 1200,style: {
//           fontSize: '12px',
//           padding: '6px 10px',
//           minHeight: 'auto',
//         }});
//       }
//     };

//     const sendMessage = async (event) => {
//       if (event.key === "Enter" && newMessage.trim()) {
//         await sendMessageHandler();
//       }
//     };

//     const typingHandler = (e) => {
//       const value = e.target.value;
//       const position = e.target.selectionStart;
//       setCursorPosition(position);
//       setNewMessage(value);
  
//       // Check for colon trigger
//       if (value.charAt(position - 1) === ':' && position > 0) {
//         setShowEmojiPicker(true);
//       }
  
//       if (!socketConnected) return;
  
//       if (!typing) {
//         setTyping(true);
//         socket.emit("typing", selectedChat._id);
//       }
//       let lastTypingTime = new Date().getTime();
//       var timerLength = 2000;
//       setTimeout(() => {
//         var timeNow = new Date().getTime();
//         var timeDiff = timeNow - lastTypingTime;
//         if (timeDiff >= timerLength && typing) {
//           socket.emit("stop typing", selectedChat._id);
//           setTyping(false);
//         }
//       }, timerLength);
//     };

//     const handleEmojiSelect = (emoji) => {
//       const beforeCursor = newMessage.substring(0, cursorPosition);
//       const afterCursor = newMessage.substring(cursorPosition);
      
//       // If emoji picker was opened by colon, replace the colon
//       let newBeforeCursor = beforeCursor;
//       if (beforeCursor.endsWith(':')) {
//         newBeforeCursor = beforeCursor.slice(0, -1);
//       }
      
//       const newText = newBeforeCursor + emoji + afterCursor;
//       setNewMessage(newText);
      
//       // Set cursor position after emoji
//       setTimeout(() => {
//         if (inputRef.current) {
//           const newPosition = newBeforeCursor.length + emoji.length;
//           inputRef.current.setSelectionRange(newPosition, newPosition);
//           setCursorPosition(newPosition);
//           inputRef.current.focus();
//         }
//       }, 0);
      
//       setShowEmojiPicker(false);
//     };

//     const toggleEmojiPicker = () => {
//       setShowEmojiPicker(!showEmojiPicker);
//       if (!showEmojiPicker) {
//         setTimeout(() => inputRef.current?.focus(), 0);
//       }
//     };

//     // Close emoji picker when clicking outside
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
//           setShowEmojiPicker(false);
//         }
//       };

//       document.addEventListener('mousedown', handleClickOutside);
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }, []);

//     useEffect(() => {
//       socket = io(ENDPOINT);
//       socket.emit("setup", user);
//       socket.on("connected", () => setSocketConnected(true));
//       socket.on("typing", () => setIsTyping(true));
//       socket.on("stop typing", () => setIsTyping(false));  
//       // eslint-disable-next-line
//     }, []);

//     useEffect(() => {
//       fetchMessages(); 
//       selectedChatCompare = selectedChat;
//     }, [selectedChat]);

//     useEffect(() => {
//       socket.on("message recieved", (newMessageRecieved) => {
//         if (
//           !selectedChatCompare ||
//           selectedChatCompare._id !== newMessageRecieved.chat._id
//         ) {
//           if (!notification.includes(newMessageRecieved)) {
//             setNotification([newMessageRecieved, ...notification]);
//             setFetchAgain(!fetchAgain);
//           }
//         } else {
//           setMessages([...messages, newMessageRecieved]);
//         }
//       });
//     });

//     return (
//     <>
//         {selectedChat ? (
//             <>
//              <Text
//             fontSize={{ base: "28px", md: "30px" }}
//             pb={3}
//             px={2}
//             w="100%"
//             fontFamily="Work sans"
//             display="flex"
//             justifyContent={{ base: "flex-start" }}
//             alignItems="center"
//           >
//             <Box
//                 as="i"
//                 className="fa-solid fa-arrow-left fa-sm"
//                 cursor="pointer"
//                 marginTop="5px"
//                 marginRight="10px"
//                 display={{ base: "flex", md: "none" }}
//                 onClick={() => setSelectedChat("")}
//             />
//             {(!selectedChat.isGroupChat ? (
//                 <>
//                   <Button variant="ghost" size="m" px="20px" onClick={() => setIsProfileOpen(true)} _hover={{ bg: "transparent" }} borderRadius="50%">
//                       <Avatar.Root size="md" cursor="pointer" _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" }}>
//                           <Avatar.Image src={getSenderFull(user, selectedChat.users).pic} />
//                       </Avatar.Root>
//                   </Button>
//                   {getSender(user, selectedChat.users)}
//                   <ProfileModal isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} 
//                     user={getSenderFull(user, selectedChat.users)}
//                   />
//                 </>
//               ) : (
//                 <>
//                   {selectedChat.chatName.toUpperCase()}
//                   <UpdateGroupChatModal
//                     fetchMessages={fetchMessages}
//                     fetchAgain={fetchAgain}
//                     setFetchAgain={setFetchAgain} 
//                   />
//                 </>
//               ))}
//             </Text>
//             <Toaster position="top-center" />
//             <Box
//             display="flex"
//             flexDir="column"
//             justifyContent="flex-end"
//             p={3}
//             bg="#E8E8E8"
//             w="100%"
//             h="100%"
//             borderRadius="lg"
//             overflowY="hidden"
//             bgAttachment="fixed" bgImage={`url(${chatBackground})`} bgSize="cover" bgRepeat="no-repeat"
//           >
//             {loading ? (
//               <Spinner size="xl" width="20" height="20" alignSelf="center" margin="auto"/>
//             ): (
//               <>
//               <div className="messages" style={{ height: "100vh" }}>
//                 <ScrollableChat messages={messages} isGroupChat={selectedChat.isGroupChat}/>
//               </div>
//               </>
//             )}
//           </Box>
//           {isTyping ? (
//             <Box w="100%" background="transparent">
//                 <div className="typing-indicator">
//                 <span className="typing-dot"></span>
//                 <span className="typing-dot"></span>
//                 <span className="typing-dot"></span>
//               </div>
//               </Box>
//               ) : (
//                 <></>
//               )}
            
//             {/* Message Input with Emoji Picker and Send Button */}
//             <Box position="relative" mt={3} mb={2}>
//               {/* Emoji Picker */}
//               {showEmojiPicker && (
//                 <Box
//                   ref={emojiPickerRef}
//                   position="absolute"
//                   bottom="60px"
//                   left="0"
//                   bg="white"
//                   border="1px solid #ccc"
//                   borderRadius="12px"
//                   boxShadow="0 4px 12px rgba(0,0,0,0.1)"
//                   p={3}
//                   width="320px"
//                   maxHeight="280px"
//                   overflowY="auto"
//                   zIndex={1000}
//                 >
//                   {emojiData.map((category) => (
//                     <Box key={category.category} mb={3}>
//                       <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2}>
//                         {category.category}
//                       </Text>
//                       <Flex flexWrap="wrap" gap={1}>
//                         {category.emojis.map((emoji) => (
//                           <Button
//                             key={emoji}
//                             variant="ghost"
//                             size="sm"
//                             p={1}
//                             minW="32px"
//                             h="32px"
//                             fontSize="18px"
//                             onClick={() => handleEmojiSelect(emoji)}
//                             _hover={{ bg: "gray.100" }}
//                             borderRadius="6px"
//                           >
//                             {emoji}
//                           </Button>
//                         ))}
//                       </Flex>
//                     </Box>
//                   ))}
//                 </Box>
//               )}
              
//               {/* Input Container */}
//               <Flex alignItems="center" gap={2}>
//                 <Box position="relative" flex={1}>
//                   <Input
//                     ref={inputRef}
//                     onKeyDown={sendMessage}
//                     variant="filled"
//                     background="#E0E0E0"
//                     value={newMessage}
//                     placeholder="Enter a message..."
//                     onChange={typingHandler}
//                     onSelect={(e) => setCursorPosition(e.target.selectionStart)}
//                     onClick={(e) => setCursorPosition(e.target.selectionStart)}
//                     pr="50px"
//                   />
                  
//                   {/* Emoji Button */}
//                   <IconButton
//                     position="absolute"
//                     right="8px"
//                     top="50%"
//                     transform="translateY(-50%)"
//                     size="sm"
//                     variant="ghost"
//                     onClick={toggleEmojiPicker}
//                     _hover={{ bg: "transparent" }}
//                     icon={
//                       <Text fontSize="20px" cursor="pointer">
//                         😊
//                       </Text>
//                     }
//                   />
//                 </Box>
                
//                 {/* Send Button */}
//                 <IconButton
//                   size="lg"
//                   borderRadius="full"
//                   bg="#25D366"
//                   color="white"
//                   _hover={{ bg: "#128C7E" }}
//                   _active={{ bg: "#075e54" }}
//                   onClick={sendMessageHandler}
//                   isDisabled={!newMessage.trim()}
//                   icon={
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                       <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
//                     </svg>
//                   }
//                 />
//               </Flex>
//             </Box>
            
//             </>
//         ) : (
//             <Box display="flex" border="none" alignItems="center" bgAttachment="fixed" bgImage={`url(${background})`} bgSize="cover" bgRepeat="no-repeat" justifyContent="center" bgColor="rgba(0, 0, 0, 0.6)" bgBlendMode="overlay" h="100%" width="100%">
//               <Text fontSize="5xl" fontFamily="Work sans" color="white" fontWeight="bold">
//             Click on a user to start chatting
//           </Text>
//         </Box>
//         )}
//     </>
//   );
// }

// export default SingleChat

// import React, {useState, useEffect, useRef } from 'react'
// import { Box, Text, Flex, Avatar, Button, Spinner, Input, IconButton } from "@chakra-ui/react";
// import axios from "axios";
// import { Toaster,toast } from 'react-hot-toast';
// import EmojiPicker from 'emoji-picker-react';
// import "./styles.css";
// import { ChatState } from "../Context/ChatProvider";
// import { getSender, getSenderFull } from "../config/ChatLogics";
// import ProfileModal from "./miscellaneous/ProfileModal";
// import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
// import ScrollableChat from "./ScrollableChat";
// import chatBackground from '../chat-background.png';
// import background from '../background.png';
// import io from "socket.io-client";

// const ENDPOINT = "http://localhost:5000";
// var socket, selectedChatCompare;

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//     const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
//     const [isProfileOpen, setIsProfileOpen] = useState(false);
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [newMessage, setNewMessage] = useState("");
//     const [socketConnected, setSocketConnected] = useState(false);
//     const [typing, setTyping] = useState(false);
//     const [isTyping, setIsTyping] = useState(false);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const [cursorPosition, setCursorPosition] = useState(0);
    
//     const inputRef = useRef(null);
//     const emojiPickerRef = useRef(null);

//     const fetchMessages = async () => {
//       if (!selectedChat) return;
  
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
  
//         setLoading(true);
  
//         const { data } = await axios.get(
//           `/api/message/${selectedChat._id}`,
//           config
//         );
//         setMessages(data);
//         setLoading(false);

//         console.log(socket)
  
//         socket.emit("join chat", selectedChat._id);
//       } catch (error) {
//         toast.error("Failed to load messages",{duration: 1200,style: {
//           fontSize: '12px',
//           padding: '6px 10px',
//           minHeight: 'auto',
//         }});
//       }
//     };

//     const sendMessageHandler = async () => {
//       if (!newMessage.trim()) return;
      
//       socket.emit("stop typing", selectedChat._id);
//       try {
//         const config = {
//           headers: {
//             "Content-type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         setNewMessage("");
//         const { data } = await axios.post(
//           "/api/message",
//           {
//             content: newMessage,
//             chatId: selectedChat,
//           },
//           config
//         );
//         socket.emit("new message", data);
//         setMessages([...messages, data]);
//       } catch (error) {
//         toast.error("Failed to send the Message",{duration: 1200,style: {
//           fontSize: '12px',
//           padding: '6px 10px',
//           minHeight: 'auto',
//         }});
//       }
//     };

//     const sendMessage = async (event) => {
//       if (event.key === "Enter" && newMessage.trim()) {
//         await sendMessageHandler();
//       }
//     };

//     const typingHandler = (e) => {
//       const value = e.target.value;
//       const position = e.target.selectionStart;
//       setCursorPosition(position);
//       setNewMessage(value);
  
//       // Check for colon trigger - open picker
//       if (value.charAt(position - 1) === ':' && position > 0) {
//         setShowEmojiPicker(true);
//       }
      
//       // Close picker if colon is erased or not present
//       if (!value.includes(':')) {
//         setShowEmojiPicker(false);
//       }
  
//       if (!socketConnected) return;
  
//       if (!typing) {
//         setTyping(true);
//         socket.emit("typing", selectedChat._id);
//       }
//       let lastTypingTime = new Date().getTime();
//       var timerLength = 2000;
//       setTimeout(() => {
//         var timeNow = new Date().getTime();
//         var timeDiff = timeNow - lastTypingTime;
//         if (timeDiff >= timerLength && typing) {
//           socket.emit("stop typing", selectedChat._id);
//           setTyping(false);
//         }
//       }, timerLength);
//     };

//     const handleEmojiSelect = (emojiObject) => {
//       const beforeCursor = newMessage.substring(0, cursorPosition);
//       const afterCursor = newMessage.substring(cursorPosition);
      
//       // If emoji picker was opened by colon, replace the colon
//       let newBeforeCursor = beforeCursor;
//       if (beforeCursor.endsWith(':')) {
//         newBeforeCursor = beforeCursor.slice(0, -1);
//       }
      
//       const newText = newBeforeCursor + emojiObject.emoji + afterCursor;
//       setNewMessage(newText);
      
//       // Set cursor position after emoji
//       setTimeout(() => {
//         if (inputRef.current) {
//           const newPosition = newBeforeCursor.length + emojiObject.emoji.length;
//           inputRef.current.setSelectionRange(newPosition, newPosition);
//           setCursorPosition(newPosition);
//           inputRef.current.focus();
//         }
//       }, 0);
      
//       setShowEmojiPicker(false);
//     };

//     const toggleEmojiPicker = () => {
//       setShowEmojiPicker(!showEmojiPicker);
//       if (!showEmojiPicker) {
//         setTimeout(() => inputRef.current?.focus(), 0);
//       }
//     };

//     // Close emoji picker when clicking outside
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
//           setShowEmojiPicker(false);
//         }
//       };

//       document.addEventListener('mousedown', handleClickOutside);
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }, []);

//     useEffect(() => {
//       socket = io(ENDPOINT);
//       socket.emit("setup", user);
//       socket.on("connected", () => setSocketConnected(true));
//       socket.on("typing", () => setIsTyping(true));
//       socket.on("stop typing", () => setIsTyping(false));  
//       // eslint-disable-next-line
//     }, []);

//     useEffect(() => {
//       fetchMessages(); 
//       selectedChatCompare = selectedChat;
//     }, [selectedChat]);

//     useEffect(() => {
//       socket.on("message recieved", (newMessageRecieved) => {
//         if (
//           !selectedChatCompare ||
//           selectedChatCompare._id !== newMessageRecieved.chat._id
//         ) {
//           if (!notification.includes(newMessageRecieved)) {
//             setNotification([newMessageRecieved, ...notification]);
//             setFetchAgain(!fetchAgain);
//           }
//         } else {
//           setMessages([...messages, newMessageRecieved]);
//         }
//       });
//     });

//     return (
//     <>
//         {selectedChat ? (
//             <>
//              <Text
//             fontSize={{ base: "28px", md: "30px" }}
//             pb={3}
//             px={2}
//             w="100%"
//             fontFamily="Work sans"
//             display="flex"
//             justifyContent={{ base: "flex-start" }}
//             alignItems="center"
//           >
//             <Box
//                 as="i"
//                 className="fa-solid fa-arrow-left fa-sm"
//                 cursor="pointer"
//                 marginTop="5px"
//                 marginRight="10px"
//                 display={{ base: "flex", md: "none" }}
//                 onClick={() => setSelectedChat("")}
//             />
//             {(!selectedChat.isGroupChat ? (
//                 <>
//                   <Button variant="ghost" size="m" px="20px" onClick={() => setIsProfileOpen(true)} _hover={{ bg: "transparent" }} borderRadius="50%">
//                       <Avatar.Root size="md" cursor="pointer" _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" }}>
//                           <Avatar.Image src={getSenderFull(user, selectedChat.users).pic} />
//                       </Avatar.Root>
//                   </Button>
//                   {getSender(user, selectedChat.users)}
//                   <ProfileModal isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} 
//                     user={getSenderFull(user, selectedChat.users)}
//                   />
//                 </>
//               ) : (
//                 <>
//                   {selectedChat.chatName.toUpperCase()}
//                   <UpdateGroupChatModal
//                     fetchMessages={fetchMessages}
//                     fetchAgain={fetchAgain}
//                     setFetchAgain={setFetchAgain} 
//                   />
//                 </>
//               ))}
//             </Text>
//             <Toaster position="top-center" />
//             <Box
//             display="flex"
//             flexDir="column"
//             justifyContent="flex-end"
//             p={3}
//             bg="#E8E8E8"
//             w="100%"
//             h="100%"
//             borderRadius="lg"
//             overflowY="hidden"
//             bgAttachment="fixed" bgImage={`url(${chatBackground})`} bgSize="cover" bgRepeat="no-repeat"
//           >
//             {loading ? (
//               <Spinner size="xl" width="20" height="20" alignSelf="center" margin="auto"/>
//             ): (
//               <>
//               <div className="messages" style={{ height: "100vh" }}>
//                 <ScrollableChat messages={messages} isGroupChat={selectedChat.isGroupChat}/>
//               </div>
//               </>
//             )}
//           </Box>
//           {isTyping ? (
//             <Box w="100%" background="transparent">
//                 <div className="typing-indicator">
//                 <span className="typing-dot"></span>
//                 <span className="typing-dot"></span>
//                 <span className="typing-dot"></span>
//               </div>
//               </Box>
//               ) : (
//                 <></>
//               )}
            
//             {/* Message Input with Emoji Picker and Send Button */}
//             <Box position="relative" mt={3} mb={2} w="100%">
//               {/* Emoji Picker */}
//               {showEmojiPicker && (
//                 <Box
//                   ref={emojiPickerRef}
//                   position="absolute"
//                   bottom="70px"
//                   left="0"
//                   zIndex={1000}
//                 >
//                   <EmojiPicker
//                     onEmojiClick={handleEmojiSelect}
//                     width={320}
//                     height={350}
//                     searchDisabled={false}
//                     previewConfig={{
//                       showPreview: false
//                     }}
//                     skinTonesDisabled={false}
//                   />
//                 </Box>
//               )}
              
//               {/* Input Container */}
//               <Flex alignItems="center" gap={3} w="100%">
//                 <Box position="relative" flex={1} w="100%">
//                   <Input
//                     ref={inputRef}
//                     onKeyDown={sendMessage}
//                     variant="filled"
//                     background="#E0E0E0"
//                     value={newMessage}
//                     placeholder="Enter a message..."
//                     onChange={typingHandler}
//                     onSelect={(e) => setCursorPosition(e.target.selectionStart)}
//                     onClick={(e) => setCursorPosition(e.target.selectionStart)}
//                     paddingRight="55px"
//                     paddingLeft="15px"
//                     borderRadius="25px"
//                     border="1px solid #ddd"
//                     height="50px"
//                     fontSize="16px"
//                     w="100%"
//                     _focus={{
//                       borderColor: "#25D366",
//                       boxShadow: "0 0 0 1px #25D366"
//                     }}
//                     _placeholder={{
//                       color: "#8696a0"
//                     }}
//                   />
                  
//                   {/* Emoji Button */}
//                   <Box
//                     position="absolute"
//                     right="15px"
//                     top="50%"
//                     transform="translateY(-50%)"
//                     cursor="pointer"
//                     onClick={toggleEmojiPicker}
//                     fontSize="24px"
//                     color="#8696a0"
//                     _hover={{ color: "#25D366" }}
//                     transition="color 0.2s"
//                     zIndex={1}
//                   >
//                     <i class="fa-regular fa-face-smile"></i>
//                   </Box>
//                 </Box>
                
//                 {/* Send Button */}
//                 <Button
//                   size="lg"
//                   borderRadius="50%"
//                   bg="#25D366"
//                   color="white"
//                   _hover={{ bg: "#128C7E" }}
//                   _active={{ bg: "#075e54" }}
//                   onClick={sendMessageHandler}
//                   isDisabled={!newMessage.trim()}
//                   minW="50px"
//                   h="50px"
//                   p={0}
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="center"
//                   flexShrink={0}
//                 >
//                   <svg 
//                     width="20" 
//                     height="20" 
//                     viewBox="0 0 24 24" 
//                     fill="none" 
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <line x1="22" y1="2" x2="11" y2="13"></line>
//                     <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
//                   </svg>
//                 </Button>
//               </Flex>
//             </Box>
            
//             </>
//         ) : (
//             <Box display="flex" border="none" alignItems="center" bgAttachment="fixed" bgImage={`url(${background})`} bgSize="cover" bgRepeat="no-repeat" justifyContent="center" bgColor="rgba(0, 0, 0, 0.6)" bgBlendMode="overlay" h="100%" width="100%">
//               <Text fontSize="5xl" fontFamily="Work sans" color="white" fontWeight="bold">
//             Click on a user to start chatting
//           </Text>
//         </Box>
//         )}
//     </>
//   );
// }

// export default SingleChat

import React, {useState, useEffect, useRef } from 'react'
import { Box, Text, Flex, Avatar, Button, Spinner, Input, IconButton } from "@chakra-ui/react";
import axios from "axios";
import { Toaster,toast } from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import "./styles.css";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import chatBackground from '../chat-background.png';
import background from '../background.png';
import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_BACKEND_URI ||"http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    
    const inputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const fetchMessages = async () => {
      if (!selectedChat) return;
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        setLoading(true);
  
        const { data } = await axios.get(
          `/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
        setLoading(false);
  
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        toast.error("Failed to load messages",{duration: 1200,style: {
          fontSize: '12px',
          padding: '6px 10px',
          minHeight: 'auto',
        }});
      }
    };

    const sendMessageHandler = async () => {
      if (!newMessage.trim()) return;
      
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast.error("Failed to send the Message",{duration: 1200,style: {
          fontSize: '12px',
          padding: '6px 10px',
          minHeight: 'auto',
        }});
      }
    };

    const sendMessage = async (event) => {
      if (event.key === "Enter" && newMessage.trim()) {
        await sendMessageHandler();
      }
    };

    // Debounced typing handler to prevent excessive socket emissions
    const typingTimeoutRef = useRef(null);
    
    const typingHandler = (e) => {
      const value = e.target.value;
      const position = e.target.selectionStart;
      setCursorPosition(position);
      setNewMessage(value);
  
      // Check for colon trigger - open picker
      if (value.charAt(position - 1) === ':' && position > 0) {
        setShowEmojiPicker(true);
      }
      
      // Close picker if colon is erased or not present
      if (!value.includes(':')) {
        setShowEmojiPicker(false);
      }
  
      if (!socketConnected) return;
  
      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        if (typing) {
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, 2000);
    };

    const handleEmojiSelect = (emojiObject) => {
      const beforeCursor = newMessage.substring(0, cursorPosition);
      const afterCursor = newMessage.substring(cursorPosition);
      
      // If emoji picker was opened by colon, replace the colon
      let newBeforeCursor = beforeCursor;
      if (beforeCursor.endsWith(':')) {
        newBeforeCursor = beforeCursor.slice(0, -1);
      }
      
      const newText = newBeforeCursor + emojiObject.emoji + afterCursor;
      setNewMessage(newText);
      
      // Set cursor position after emoji
      setTimeout(() => {
        if (inputRef.current) {
          const newPosition = newBeforeCursor.length + emojiObject.emoji.length;
          inputRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
          inputRef.current.focus();
        }
      }, 0);
      
      setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
      if (!showEmojiPicker) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };

    // Close emoji picker when clicking outside - Optimized
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false);
        }
      };

      if (showEmojiPicker) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [showEmojiPicker]);

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));  
      
      // Cleanup function
      return () => {
        if (socket) {
          socket.disconnect();
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      fetchMessages(); 
      selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // Optimized message received handler with dependency array
    useEffect(() => {
      const handleMessageReceived = (newMessageRecieved) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages(prevMessages => [...prevMessages, newMessageRecieved]);
        }
      };

      socket.on("message recieved", handleMessageReceived);
      
      return () => {
        socket.off("message recieved", handleMessageReceived);
      };
    }, [notification, fetchAgain, setFetchAgain, setNotification]);

    return (
    <>
        {selectedChat ? (
            <>
             <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "flex-start" }}
            alignItems="center"
          >
            <Box
                as="i"
                className="fa-solid fa-arrow-left fa-sm"
                cursor="pointer"
                marginTop="5px"
                marginRight="10px"
                display={{ base: "flex", md: "none" }}
                onClick={() => setSelectedChat("")}
            />
            {(!selectedChat.isGroupChat ? (
                <>
                  <Button variant="ghost" size="m" px="20px" onClick={() => setIsProfileOpen(true)} _hover={{ bg: "transparent" }} borderRadius="50%">
                      <Avatar.Root size="md" cursor="pointer" _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" }}>
                          <Avatar.Image src={getSenderFull(user, selectedChat.users).pic} />
                      </Avatar.Root>
                  </Button>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} 
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain} 
                  />
                </>
              ))}
            </Text>
            <Toaster position="top-center" />
            <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            bgAttachment="fixed" bgImage={`url(${chatBackground})`} bgSize="cover" bgRepeat="no-repeat"
          >
            {loading ? (
              <Spinner size="xl" width="20" height="20" alignSelf="center" margin="auto"/>
            ): (
              <>
              <div className="messages" style={{ height: "100vh" }}>
                <ScrollableChat messages={messages} isGroupChat={selectedChat.isGroupChat}/>
              </div>
              </>
            )}
          </Box>
          {isTyping ? (
            <Box w="100%" background="transparent">
                <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
              </Box>
              ) : (
                <></>
              )}
            
            {/* Message Input with Emoji Picker and Send Button */}
            <Box position="relative" mt={3} mb={2} w="100%">
              {/* Conditionally render Emoji Picker only when needed */}
              {showEmojiPicker && (
                <Box
                  ref={emojiPickerRef}
                  position="absolute"
                  bottom="70px"
                  left="0"
                  zIndex={1000}
                  boxShadow="lg"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    width={300}
                    height={300}
                    searchDisabled={true}
                    previewConfig={{
                      showPreview: false
                    }}
                    skinTonesDisabled={true}
                    lazyLoadEmojis={true}
                    emojiStyle="native"
                  />
                </Box>
              )}
              
              {/* Input Container */}
              <Flex alignItems="center" gap={3} w="100%">
                <Box position="relative" flex={1} w="100%">
                  <Input
                    ref={inputRef}
                    onKeyDown={sendMessage}
                    variant="filled"
                    background="#E0E0E0"
                    value={newMessage}
                    placeholder="Enter a message..."
                    onChange={typingHandler}
                    onSelect={(e) => setCursorPosition(e.target.selectionStart)}
                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                    paddingRight="55px"
                    paddingLeft="15px"
                    borderRadius="25px"
                    border="1px solid #ddd"
                    height="50px"
                    fontSize="16px"
                    w="100%"
                    _focus={{
                      borderColor: "#25D366",
                      boxShadow: "0 0 0 1px #25D366"
                    }}
                    _placeholder={{
                      color: "#8696a0"
                    }}
                  />
                  
                  {/* Emoji Button */}
                  <Box
                    position="absolute"
                    right="15px"
                    top="50%"
                    transform="translateY(-50%)"
                    cursor="pointer"
                    onClick={toggleEmojiPicker}
                    fontSize="24px"
                    color="#8696a0"
                    _hover={{ color: "#25D366" }}
                    transition="color 0.2s"
                    zIndex={1}
                  >
                    <i className="fa-regular fa-face-smile"></i>
                  </Box>
                </Box>
                
                {/* Send Button */}
                <Button
                  size="lg"
                  borderRadius="50%"
                  bg="#25D366"
                  color="white"
                  _hover={{ bg: "#128C7E" }}
                  _active={{ bg: "#075e54" }}
                  onClick={sendMessageHandler}
                  isDisabled={!newMessage.trim()}
                  minW="50px"
                  h="50px"
                  p={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                  </svg>
                </Button>
              </Flex>
            </Box>
            
            </>
        ) : (
            <Box display="flex" border="none" alignItems="center" bgAttachment="fixed" bgImage={`url(${background})`} bgSize="cover" bgRepeat="no-repeat" justifyContent="center" bgColor="rgba(0, 0, 0, 0.6)" bgBlendMode="overlay" h="100%" width="100%">
              <Text fontSize="5xl" fontFamily="Work sans" color="white" fontWeight="bold">
            Click on a user to start chatting
          </Text>
        </Box>
        )}
    </>
  );
}

export default SingleChat