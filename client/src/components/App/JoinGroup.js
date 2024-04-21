import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../Firebase/context';

export default function JoinGroup() {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const { user } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    handleGroupSearch();
  }, [])

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleGroupSearch = () => {
    setIsSearched(true); 
    console.log('Searching for group:', searchInput);
    fetch('/api/searchGroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: searchInput, uid: user.uid }), 
    })
    .then(response => response.json())
    .then(data => {
      console.log('Search results:', data);
      setSearchResults(data.data);
    })
    .catch(error => {
      console.error('Error searching for groups:', error);
    });
  };

  const handleJoinGroup = async (groupId) => {
    fetch('/api/addGroupMember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupId: groupId, uid: user.uid }), 
    })
    .then(response => {
      const updatedSearchResults = searchResults.map(group => {
        if (group.GroupID === groupId) {
          return { ...group, joined: true };
        }
        return group;
      });
      setSearchResults(updatedSearchResults);
      if (!response.ok) {
        throw new Error('Failed to join group');
      }
      return response.json();
    })
    .then(() => {
      navigate(`/group/${groupId}`);
    })
    .catch(error => {
      console.error('Error joining group:', error);
    });
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginLeft: 3, marginTop: 3 }}>Join a Group</Typography>
      <Stack direction="row" spacing={2} sx={{ marginLeft: 3 }}>
        <TextField
          id="searchGroup"
          sx={{ width: '400px' }}
          label="Search for a study group"
          type="text"
          variant="filled"
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <Button onClick={handleGroupSearch} variant="contained" style={{ width: '100px', height: '50px' }}>
          Search
        </Button>
      </Stack>
      {isSearched && searchResults.length === 0 ? (
        <Typography sx={{ margin: 3 }}>No groups found. Try a different search term.</Typography>
      ) : (
        <List>
          {searchResults.map((group, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemText
                primary={group.group_name}
                secondary={`Courses: ${group.Courses}`}
              />
              {group.joined ?
                <Button disabled style={{ color: "gray" }}>Joined</Button> :
                <Button onClick={() => handleJoinGroup(group.GroupID)}>Join</Button>
              }
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}
