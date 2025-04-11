import React, { useState } from "react";
import {
  Button,
  Input,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Tooltip,
  Avatar,
  useDisclosure,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"; // Import icons from @chakra-ui/icons
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading.jsx";
import ProfileModal from "./ProfileModel.jsx";
import { getSender } from "../../config/ChatLogics.jsx";
import UserListItem from "../UserAvatar/UserListItem.jsx";
import { ChatState } from "../../Context/ChatProvider.jsx";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  
  //if(!user){
//return  null;
  //}

  const toast = useToast();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const history = useNavigate();

  const logoutHandler = () => {
    window.dispatchEvent(new Event("logout"));
    sessionStorage.removeItem("userInfo");
    history("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/users/search?search=${search}`, config);
      //const updateData = data.map((user) => ({
        setLoading(false);
        setSearchResult(
          data.map((user) => ({
        ...user,
        name: user.name || user.username,
       email: user.email || 'No email provided',
      })));

      //setLoading(false);
      //setSearchResult(data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid, redirect to login
            toast({
              title: "Session Expired",
              description: "Please log in again.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
            sessionStorage.removeItem("userInfo");
            history("/");
            return;
          }
          toast({
            title: "Error Occurred!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setLoading(false);
        
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onDrawerClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#5D3FD3 "
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onDrawerOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px={4} >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          e - Connect
        </Text>
        <div>
          <Menu>
            <MenuButton p={1} position="relative">
              {notification.length > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="-1"
                  right="-1"
                  fontSize="0.8em"
                 
                >
                  {notification.length}
                </Badge>
              )}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={{ ...user, isOpen: isModalOpen, onClose: onModalClose }}>
                <MenuItem onClick={onModalOpen}>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onDrawerClose} isOpen={isDrawerOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;