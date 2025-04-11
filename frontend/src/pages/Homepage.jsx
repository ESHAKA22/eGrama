import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useHistory instead of useNavigate
import { debounce } from 'lodash';
import { Box, Button, FormControl, FormLabel, Input, Text, useToast, Spinner } from '@chakra-ui/react';


const Homepage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/register', { username, password });
      console.log('Registration successful:', response.data);
      setError('');
      setIsRegister(false);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', { username, password });
      console.log('Login successful:', response.data);
      sessionStorage.setItem('userInfo', JSON.stringify(response.data));
      setError('');
      navigate('/chats'); // Use history.push instead of navigate
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  const searchUsers = async (query) => {
    if (!query) {
      setSearchResults([]);
      setSearchError('');
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const response = await axios.get(`/api/users/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${user?.token || ''}`,
        },
      });
      setSearchResults(response.data);
      setSearchError('');
    } catch (err) {
      setSearchError('Failed to search users. Please try again.');
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  const debouncedSearch = debounce(searchUsers, 500);

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [setSearchQuery, debouncedSearch]
  );

  const startChat = async (userId) => {
    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      if (!user || !user.token) {
        setError('Please log in to start a chat');
        return;
      }

      const response = await axios.post(
        '/api/chat/',
        { userId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log('Chat started:', response.data);
      navigate(`/chats/${response.data._id}`); // Use history.push instead of navigate
    } catch (err) {
      console.error('Error starting chat:', err);
      setError(
        err.response?.data?.message || 'Failed to start chat. Please try again.'
      );
    }
  };

  return (
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    bg="gray.100"
    //p={4}
  >
    <Box
      bg="white"
      p={8}
      borderRadius="lg"
      boxShadow="lg"
      width="100%"
      maxWidth="400px"
    >
      <Text fontSize="2xl" textAlign="center" fontWeight="bold" mb={4}>
        {isRegister ? 'Register' : 'Login'}
      </Text>

      {error && (
        <Text color="red.500" fontSize="sm" textAlign="center" mb={4}>
          {error}
        </Text>
      )}

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          <FormControl mb={4} isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              borderColor="gray.300"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <FormControl mb={6} isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              borderColor="gray.300"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            isLoading={loading}
            loadingText={isRegister ? 'Registering' : 'Logging In'}
            _hover={{ bg: "blue.600" }}
          >
            {isRegister ? 'Register' : 'Login'}
          </Button>
        </form>
      
        <Box mt={4} textAlign="center">
          <Text fontSize="sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setUsername('');
                setPassword('');
              }}
            >
              {isRegister ? 'Login' : 'Register'}
            </Button>
          </Text>
        </Box>
        </Box>
        </Box>
        
      
   
  );
};

export default Homepage;