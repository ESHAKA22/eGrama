import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useHistory for react-router-dom@5

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [loading, setLoading] = useState(true);

  const history = useNavigate(); // Use useHistory instead of useNavigate

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    console.log('User Info from sessionStorage:', userInfo);
    setUser(userInfo);
    setLoading(false);

    if (!userInfo) 
      history("/");
    
  }, [history]);

  //useEffect(() => {
    //const handleStorageChange = (event) => {
    //  if (event.key === "userInfo") {
     //   console.log("localStorage userInfo changed in another tab:", event.newValue);
     //   const newUserInfo = JSON.parse(event.newValue);
      //  setUser(newUserInfo);

      //  if (!newUserInfo) {
        //  history.push("/");
      //  }
     // }
   // };

   // window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener on component unmount
  //  return () => {
   //   window.removeEventListener("storage", handleStorageChange);
   // };
  //}, [history]);

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
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;