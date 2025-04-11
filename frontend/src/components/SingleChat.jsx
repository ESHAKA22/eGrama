import { FormControl } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModel.jsx";
import ScrollableChat from "./ScrollableChat.jsx";
import "./styles.css";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { Badge } from "@chakra-ui/react";//
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal.jsx";
import { ChatState } from "../Context/ChatProvider.jsx";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]); // Track online users
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    console.log("Fetching messages for chat ID:", selectedChat._id);
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
      console.log("Messages fetched:", data);
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Unexpected response format:", data);
        setMessages([]); // Reset to empty array to avoid rendering issues
        toast({
          title: "Error Occurred!",
          description: "Unexpected response format from server",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
  
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Error fetching messages:", error.response?.data || error.message);
      setMessages([]); // Reset to empty array on error
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  //if (Array.isArray(data)) {
   // setMessages(data);
  //} else {
    // If the response is not an array, log it and show a toast
    //console.error("Unexpected response format:", data);
   // toast({
    //  title: "Error Occurred!",
    //  description: "Unexpected response format from server",
    //  status: "error",
     // duration: 5000,
     // isClosable: true,
     // position: "bottom",
   // });
   // setMessages([]); // Reset messages to an empty array to avoid rendering issues
  //}

 // setLoading(false);
 // socket.emit("join chat", selectedChat._id);
//} catch (error) {
  //console.error("Error fetching messages:", error.response?.data || error.message);
  //toast({
  //  title: "Error Occurred!",
   // description: error.response?.data?.message || "Failed to Load the Messages",
   // status: "error",
   // duration: 5000,
   // isClosable: true,
  //  position: "bottom",
 // });
 // setMessages([]); // Reset messages to an empty array on error
 // setLoading(false);
//}
//};

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
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
            chatId: selectedChat._id,
          },
          config
        );
        console.log("Message sent:", data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket.id);
      setSocketConnected(true);
    });
    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
    });
    socket.emit("setup", user);
    socket.on("connected", () => {
      console.log("User connected via Socket.IO");
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.disconnect();
      console.log("Socket.IO disconnected");
    };
  }, [user]);


  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("Message received via Socket.IO:", newMessageRecieved);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });

    return () => {
      socket.off("message recieved");
    };
  }, [messages]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const isAdminOnline = () => {
    const admin = selectedChat.users.find(u => u.isAdmin);
    return admin && onlineUsers.includes(admin._id);
  };
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
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <Box display="flex" justifyContent="space-between" alignItems="center" w="100%">
                  <Text>{selectedChat.chatName.toUpperCase()}</Text>
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </Box>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            //justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
           overflowY="hidden"
          >
         <Box
    flex="1"
    overflowY="auto"
    mb={3}
    maxH="calc(100% - 120px)"
    >

            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            </Box>

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
             mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;