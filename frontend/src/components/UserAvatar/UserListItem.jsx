import { Avatar,Box, Text } from "@chakra-ui/react";
//import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ user,handleFunction }) => {
 //const { user:loggedUser } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar mr={2} size="sm" cursor="pointer" name={user.name || user.username} src={user.pic} />
      <Box>
      <Text>{user.name || user.username}</Text>
       
      </Box>
    </Box>
  );
};

export default UserListItem;