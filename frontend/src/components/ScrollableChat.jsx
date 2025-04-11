import { Avatar } from "@chakra-ui/react";
import { Tooltip ,Box, Text} from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics.jsx";
import { ChatState } from "../Context/ChatProvider.jsx";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

 // const safeMessages = Array.isArray(messages) ? messages : [];
 const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
  return (
    <ScrollableFeed>
      {messages && messages.length > 0 ? (
        messages.map((m, i) => {
          // Validate that the message object has the required properties
          if (!m || !m._id || !m.content || !m.sender || !m.sender._id) {
            console.warn("Invalid message object:", m);
            return null; // Skip rendering this message
          }
          const isBot = m.sender._id === "ai-bot" || m.sender.name === "AI Assistant"; // Adjust based on actual bot ID
          return (
            <Box d="flex" key={m._id} justifyContent={m.sender._id === user._id ? "flex-end" : "flex-start"} mb={2}>
              <Box d="flex" flexDir="column" alignItems={m.sender._id === user._id ? "flex-end" : "flex-start"}>
                {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                  <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}
                <Box
                  backgroundColor={isBot ? "#ff9999" : m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}
                  marginLeft={isSameSenderMargin(messages, m, i, user._id)}
                  marginTop={isSameUser(messages, m, i) ? 3 : 10}
                  borderRadius="20px"
                  padding="5px 15px"
                  maxWidth="75%"
                >
                  <Text>{m.sender.name || "Unknown"}: {m.content}</Text>
                  <Text fontSize="xs" color="gray.600" mt={1}>
                    {formatTime(m.createdAt)}
                  </Text>
                </Box>
              </Box>
            </Box>
          );
        })
      ) : (
        <div>No messages to display</div>
      )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;