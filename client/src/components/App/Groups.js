import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function CreateGroup() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [openMyGroups, setOpenMyGroups] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [groups, setGroups] = useState([]);
  const [searchResultsGroup, setSearchResultsGroup] = useState([]);
  const [searchInputGroup, setSearchInputGroup] = useState('');
  const handleCloseMyGroups = () => setOpenMyGroups(false);
  const handleOpenMyGroups = () => {
    fetchGroups();
    setOpenMyGroups(true);
  };
  

  const [formData, setFormData] = useState({
    program: '',
    courses: '',
    schoolYear: '',
    desiredNumberOfMembers: '',
    details: '',
    members: [],
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchInputGroupChange = (e) => {
    setSearchInputGroup(e.target.value);
  };

  const fetchGroups = () => {
    fetch('/api/getGroups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log("Fetched groups data:", JSON.parse(data.express)); 
      setGroups(JSON.parse(data.express));
    })
    .catch(error => {
      console.error('Error fetching groups:', error);
    });
  };
  
  useEffect(() => {
    fetchGroups();
  }, []);
  

  const handleSearch = () => {
    console.log('searching for people:', searchInput);
    fetch('/api/searchpeople', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchInput,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.data);
      setSearchResults(data.data);
      setShowNotFoundMessage(data.data.length === 0);
    })
    .catch(error => {
      console.error('Error searching people:', error);
      setShowNotFoundMessage(false);
    });
  };


  const handleSubmit = () => {
    console.log('Creating group:', formData);
  
    fetch('/api/create-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      fetchGroups();
      setOpenCreate(false);
    })
    .catch(error => {
      console.error('Error creating group:', error);
    });
  };

  const handlegroupsearch = () => {
    console.log('searching for group:', searchInputGroup);
    fetch('/api/searchGroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchInputGroup,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.data);
      setSearchResultsGroup(data.data);
    })
    .catch(error => {
      console.error('Error searching group:', error);
    });
  };

  const handleCreateGroup = () => {
    setOpenCreate(true);
  };

  const handleJoinGroup = () => {
    setOpenJoin(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleCloseJoin = () => {
    setOpenJoin(false);
  };

  const handleAddMember = (member) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      members: [...prevFormData.members, member]
    }));
  };

  const JoinGroup = (group) => {
    console.log('Joining group:', group);
  }

  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
   
        <Box sx={{ mt: 1 }}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#9c27b0', color: 'white', '&hover': {backgroundColor: '#7e57c2'}, }}
            onClick={handleCreateGroup}
          >
            Create Group
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#9c27b0', color: 'white', '&hover': {backgroundColor: '#7e57c2'}, }}
            onClick={handleJoinGroup}
          >
            Join a Group
          </Button>
          <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: '#9c27b0', color: 'white', '&hover': {backgroundColor: '#7e57c2'}, }}
          onClick={handleOpenMyGroups}
        >
          My Groups
          </Button>
        </Box>
      </Box>

      {/* create group */}
      <Dialog open={openCreate} onClose={handleCloseCreate}>
        <DialogTitle>Create a New Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="program"
            label="Program"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="courses"
            label="Courses"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="schoolYear"
            label="School Year"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="desiredNumberOfMembers"
            label="Desired Number of Group Members"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="details"
            label="Details"
            type="text"
            multiline
            rows={4}
            fullWidth
            variant="standard"
            onChange={handleInputChange}
          />
          {/* search for members */}
          <TextField
            margin="dense"
            id="searchMembers"
            label="Search Members"
            type="text"
            fullWidth
            variant="standard"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <Button onClick={handleSearch}>Search User</Button>
          <List>
          {searchResults.length > 0 ? (
          searchResults.map((member, index) => (
          <ListItem key={index}>
          <Button onClick={() => handleAddMember(member)}>Add</Button>
        <ListItemText primary={`Email: ${member.email}`} secondary={`Fname: ${member.firstname}, Lname: ${member.lastname}`} />
      </ListItem>
    ))
  ) : (
    showNotFoundMessage && (
      <Typography variant="body2" color="textSecondary" align="center">
        No members found.
      </Typography>
    )
  )}
</List>        
</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    {/* Join Group */}
    <Dialog open={openJoin} onClose={handleCloseJoin}>
        <DialogTitle>Join a Group</DialogTitle>
        <DialogContent>
          {/* Search Group */}
          <TextField
            autoFocus
            margin="dense"
            id="search"
            label="Search by Program/Course"
            type="text"
            fullWidth
            variant="standard"
            value={searchInputGroup}
            onChange={handleSearchInputGroupChange}
          />
          <Button onClick={handlegroupsearch}>Search</Button>
          {/* Display Search Results */}
          <List>
            {searchResultsGroup.map((group, index) => (
              <div key={index}>
                <ListItem>
                  <Button onClick={() => JoinGroup(group)}>Join</Button>
                  <ListItemText primary={group.GroupID} secondary={`Program: ${group.Program}, Courses: ${group.Courses}`} />
                </ListItem>
              </div>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJoin}>Close</Button>
        </DialogActions>
      </Dialog>          



      {/* display my groups*/}
      <Dialog open={openMyGroups} onClose={handleCloseMyGroups}>
  <DialogTitle>My Groups</DialogTitle>
  <DialogContent>
    <List>
      {Array.isArray(groups) && groups.map((group, index) =>  (
        <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', mb: 2 }}>
          <ListItemText 
            primary={`Program: ${group.Program || 'N/A'}`} 
            secondary={`
              Courses: ${group.Courses || 'N/A'}, 
              School Year: ${group.SchoolYear || 'N/A'}, 
              Desired Members: ${group.DesiredNumberOfMembers || 'N/A'}, 
              Details: ${group.Details || 'N/A'}`} 
          />
          <Box sx={{ display: 'flex', mt: 1 }}>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mr: 1 }}
        
            >
              Message Group
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              sx={{ mr: 1 }}
              
            >
              Edit Members
            </Button>

            <Button
              variant="outlined"
              color="secondary"
            
            >
              Leave Group
            </Button>
          </Box>
        </ListItem>
      ))}
    </List>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseMyGroups}>Close</Button>
  </DialogActions>
</Dialog>
    </Container>
  );
}
