import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast, Avatar } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics.jsx";
import ChatLoading from "./ChatLoading.jsx";
import GroupChatModal from "./miscellaneous/GroupChatModal.jsx";
import { ChatState } from "../Context/ChatProvider.jsx";
import { useNavigate } from "react-router-dom";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const history = useNavigate();
  const toast = useToast();

  const getSenderUser = (loggedUser, users) => {
    if (!loggedUser || !users || users.length < 2) {
      return { pic: "", name: "", username: "Unknown User" };
    }
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  const fetchChats = async () => {
   // if (!user) return; // Avoid fetching if user is not set

    //console.log("Fetching chats for user:", user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log("[MyChats] Fetched Chats:", data);
      setChats(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        localStorage.removeItem("userInfo");
        history("/");
        return;
      }

      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (!userInfo) {
      history("/");
      return;
    }
    console.log("[MyChats] User Info from sessionStorage:", userInfo);
    setLoggedUser(userInfo);
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", sm: "flex" }}// Always display, no toggle
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", sm: "40%", md: "31%" }} // Adjust width for small screens
      h="91.5vh" // Ensure it takes full height
      overflowY="auto"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >

        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              console.log("[MyChats] Chat:", chat);
              console.log("[MyChats] Logged User:", loggedUser);
              console.log("[MyChats] Chat Users:", chat.users);
              const sender = getSender(loggedUser, chat.users);
              console.log("[MyChats] Sender for chat", chat._id, ":", sender);
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  display="flex"
                  alignItems="center"
                >
                  <Avatar
                    mr={2}
                    size="sm"
                    name={chat.isGroupChat ? chat.chatName : sender}
                    src={chat.isGroupChat ? undefined : getSenderUser(loggedUser, chat.users).pic}
                  />
                  <Box flex="1">
                    <Text color={selectedChat === chat ? "white" : "black"} fontWeight="bold">
                      {!chat.isGroupChat
                        ? sender
                        : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name || chat.latestMessage.sender.username} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;