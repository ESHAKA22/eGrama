import React, { useState } from 'react';
import { ChatState } from "../Context/ChatProvider.jsx";
import SideDrawer from "../components/miscellaneous/SideDrawer.jsx";
import MyChats from "../components/MyChats.jsx";
import { Box } from "@chakra-ui/react";
import ChatBox from '../components/ChatBox.jsx';
const ChatPage = () => {
  const { user } = ChatState(); 
const[fetchAgain,setFetchAgain] = useState(false);
if (!user) {
  return null; // Or you can return a loading spinner: <div>Loading...</div>
}
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        flexDir={{ base: "column", sm: "row" }}
        justifyContent="space-between"
        w="100%"
        h="100vh" // Full viewport height
        p="10px"
        bg="#c7d2ed"
        overflow="hidden" // Prevent page-level scrolling
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;