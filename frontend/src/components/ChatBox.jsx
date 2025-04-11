import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat.jsx";
import { ChatState } from "../Context/ChatProvider.jsx";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
 // if (!user) {
   // return null; // Or a loading spinner
  //}

  return (
    <Box
    display={{ base: selectedChat ? "flex" : "none", sm: "flex" }} // Always display, no toggle
    
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", sm: "60%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      h="91.5vh" // Set a fixed height relative to the viewport
      overflow="hidden" // Prevent the ChatBox itself from scrolling
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;