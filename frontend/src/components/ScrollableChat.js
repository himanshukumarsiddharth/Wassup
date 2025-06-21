// import React, { useEffect, useRef, useState } from 'react';
// import './styles.css';
// import { Avatar } from "@chakra-ui/react";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "../config/ChatLogics";
// import { ChatState } from "../Context/ChatProvider";

// const ScrollableChat = ({ messages, isGroupChat }) => {
//   const { user } = ChatState();
//   const containerRef = useRef(null);
//   const bottomRef = useRef(null);
//   const [showButton, setShowButton] = useState(false);

//   // Auto-scroll on new message
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'auto' });
//   }, [messages]);

//   // Show "jump to bottom" only if user scrolls up
//   useEffect(() => {
//     const handleScroll = () => {
//       const c = containerRef.current;
//       const nearBottom = c.scrollHeight - c.scrollTop <= c.clientHeight + 20;
//       setShowButton(!nearBottom);
//     };

//     const c = containerRef.current;
//     c.addEventListener('scroll', handleScroll);
//     return () => c.removeEventListener('scroll', handleScroll);
//   }, []);

//   const scrollToBottom = () => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="chat-wrapper">
//       <div className="scroll-container" ref={containerRef}>
//          {messages &&
//         messages.map((m, i) => (
//           <div style={{ display: "flex" }} key={m._id}>
//             {isGroupChat && (isSameSender(messages, m, i, user._id) ||
//               isLastMessage(messages, i, user._id)) && (
//               // <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
//                 <Avatar.Root
//                   mt="7px"
//                   mr={1}
//                   size="sm"
//                   cursor="pointer"
//                 >
//                    <Avatar.Image src={m.sender.pic} />
//                 </Avatar.Root>
//               // </Tooltip>
//             )}
//             <span
//               style={{
//                 backgroundColor: `${
//                   m.sender._id === user._id ? "#A5C99C" : "#F9F6EE" 
//                 }`,
//                 marginLeft: isSameSenderMargin(messages, m, i, user._id, isGroupChat),
//                 marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
//                 borderRadius: "20px",
//                 padding: "5px 15px",
//                 maxWidth: "75%",
//               }}
//             >
//               {m.content}
//             </span>
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       {showButton && (
//         <button
//           className="scroll-button"
//           onClick={scrollToBottom}
//           title="Jump to bottom"
//         >
//           <i className="fa-solid fa-arrow-down" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default ScrollableChat;


import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { Avatar } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages, isGroupChat }) => {
  const { user } = ChatState();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [showButton, setShowButton] = useState(false);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  // Show "jump to bottom" only if user scrolls up
  useEffect(() => {
    const handleScroll = () => {
      const c = containerRef.current;
      const nearBottom = c.scrollHeight - c.scrollTop <= c.clientHeight + 20;
      setShowButton(!nearBottom);
    };

    const c = containerRef.current;
    c.addEventListener('scroll', handleScroll);
    return () => c.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (hours === 24 || hours === 0) hours = '00';
  else hours = hours.toString().padStart(2, '0');

  return `${hours}:${minutes}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare dates only
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (messageDate.getTime() === todayDate.getTime()) {
      return "Today";
    } else if (messageDate.getTime() === yesterdayDate.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };

  // Helper function to check if we need to show date separator
  const shouldShowDateSeparator = (messages, currentIndex) => {
    if (currentIndex === 0) return true;
    
    const currentDate = new Date(messages[currentIndex].createdAt).toDateString();
    const previousDate = new Date(messages[currentIndex - 1].createdAt).toDateString();
    
    return currentDate !== previousDate;
  };

  return (
    <div className="chat-wrapper">
      <div className="scroll-container" ref={containerRef}>
        {messages &&
          messages.map((m, i) => (
            <React.Fragment key={m._id}>
              {/* Date Separator */}
              {shouldShowDateSeparator(messages, i) && formatDate(m.createdAt) && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '20px 0 10px 0'
                }}>
                  <div style={{
                    backgroundColor: '#000',
                    color: '#fff',
                    padding: '5px 15px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {formatDate(m.createdAt)}
                  </div>
                </div>
              )}

              {/* Message */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "6px"}}>
              {isGroupChat && m.sender._id !== user._id && (
                  <Avatar.Root
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                  >
                    <Avatar.Image src={m.sender.pic} />
                  </Avatar.Root>
                )}
                <div
                  style={{
                    backgroundColor: `${m.sender._id === user._id ? "#A5C99C" : "#F9F6EE"}`,
                    // marginLeft: isSameSenderMargin(messages, m, i, user._id, isGroupChat),
                    marginLeft: m.sender._id === user._id ? "auto" : 0,
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    position: "relative",
                    wordWrap: "break-word",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "8px"
                  }}
                >
                  <span style={{ flex: 1 }}>{m.content}</span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: m.sender._id === user._id ? "#2d5016" : "#666",
                      opacity: 0.8,
                      lineHeight: "1",
                      flexShrink: 0,
                      alignSelf: "flex-end"
                    }}
                  >
                    {formatTime(m.createdAt)}
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        <div ref={bottomRef} />
      </div>

      {showButton && (
        <button
          className="scroll-button-wrapper"
          onClick={scrollToBottom}
          title="Jump to bottom"
        >
          <i className="fa-solid fa-arrow-down custom-down-arrow" />
        </button>
      )}
    </div>
  );
};

export default ScrollableChat;


// import React, { useEffect, useRef, useState } from 'react';
// import './styles.css';
// import { Avatar } from "@chakra-ui/react";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "../config/ChatLogics";
// import { ChatState } from "../Context/ChatProvider";

// const ScrollableChat = ({ messages, isGroupChat }) => {
//   const { user } = ChatState();
//   const containerRef = useRef(null);
//   const bottomRef = useRef(null);
//   const [showButton, setShowButton] = useState(false);

//   // Auto-scroll on new message
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'auto' });
//   }, [messages]);

//   // Show "jump to bottom" only if user scrolls up
//   useEffect(() => {
//     const handleScroll = () => {
//       const c = containerRef.current;
//       const nearBottom = c.scrollHeight - c.scrollTop <= c.clientHeight + 20;
//       setShowButton(!nearBottom);
//     };

//     const c = containerRef.current;
//     c.addEventListener('scroll', handleScroll);
//     return () => c.removeEventListener('scroll', handleScroll);
//   }, []);

//   const scrollToBottom = () => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="chat-wrapper">
//       <div className="scroll-container" ref={containerRef}>
//          {messages &&
//         messages.map((m, i) => (
//           <div style={{ display: "flex" }} key={m._id}>
//             {isGroupChat && (isSameSender(messages, m, i, user._id) ||
//               isLastMessage(messages, i, user._id)) && (
//               // <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
//                 <Avatar.Root
//                   mt="7px"
//                   mr={1}
//                   size="sm"
//                   cursor="pointer"
//                 >
//                    <Avatar.Image src={m.sender.pic} />
//                 </Avatar.Root>
//               // </Tooltip>
//             )}
//             <span
//               style={{
//                 backgroundColor: `${
//                   m.sender._id === user._id ? "#A5C99C" : "#F9F6EE" 
//                 }`,
//                 marginLeft: isSameSenderMargin(messages, m, i, user._id, isGroupChat),
//                 marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
//                 borderRadius: "20px",
//                 padding: "5px 15px",
//                 maxWidth: "75%",
//               }}
//             >
//               {m.content}
//             </span>
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       {showButton && (
//         <button
//           className="scroll-button"
//           onClick={scrollToBottom}
//           title="Jump to bottom"
//         >
//           <i className="fa-solid fa-arrow-down" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default ScrollableChat;

