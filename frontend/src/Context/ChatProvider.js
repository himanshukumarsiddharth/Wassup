import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats,setChats] = useState();
    const [notification, setNotification] = useState([]);
    // const [isTyping, setIsTyping] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        setUser(userInfo);
    
        if (!userInfo) navigate("/");
    }, [navigate]);

    return (
        <ChatContext.Provider
          value={{
            selectedChat,
            setSelectedChat,
            user,
            setUser,
            notification,
            setNotification,
            chats,
            setChats,
            // isTyping, 
            // setIsTyping
          }}
        >
          {children}
        </ChatContext.Provider>
      );
}

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;