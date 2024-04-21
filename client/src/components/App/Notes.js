import * as React from 'react';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import {Grid} from '@mui/material';
import { useFirebase } from '../Firebase/context';
import Note from './Note';
import AddNote from './AddNote';
import SearchNotes from './SearchNote';

const serverURL = "";

export default function Notes() {

    const { user } = useFirebase();
    const [notes, setNotes] = React.useState([]);
    const [programs, setPrograms] = React.useState([]);
    const [courses, setCourses] = React.useState([]);
    const [searchTitle, setSearchTitle] = React.useState('');
    const [searchAuthor, setSearchAuthor] = React.useState('');
    const [searchProgram, setSearchProgram] = React.useState('');
    const [searchCourse, setSearchCourse] = React.useState('');
    const [searchNoteResults, setNoteSearchResults] = React.useState([]);
    const [isSearchClicked, setIsSearchClicked] = React.useState(false);
    const [TitleDupe, setErrorTitleDupe] = React.useState(false);
    const [LinkDupe, setErrorLinkDupe] = React.useState(false);
    const [addTitle, setNoteTitle] = React.useState('');
    const [addLink, setNoteLink] = React.useState('');
    const [addProgram, setNoteProgram] = React.useState('');
    const [addCourse, setNoteCourse] = React.useState('');
    const [addConfirm, setAddConfirm] = React.useState(false);
    const [emptyAdd, setEmptyAdd] = React.useState(false);

    const handleDeleteNote = async (noteId) => {
      try {
        const response = await fetch(`${serverURL}/api/deleteNote`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ noteId }),
        });
        if (response.status === 200) {
          getNotes();
        } else {
          console.error('Failed to delete note');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    };    

    const handleSearchProgramChange = (event) => {
      setSearchProgram(event.target.value);
    };

    const handleSearchCourseChange = (event) => {
      setSearchCourse(event.target.value);
    };

    const handleFilterButtonClick = () => {
      const isProgramEmpty = searchProgram === '';
      const isCourseEmpty = searchCourse === '';
      const isTitleEmpty = searchTitle === '';
      const isAuthorEmpty = searchAuthor === '';
  
      if (isProgramEmpty && isCourseEmpty && isTitleEmpty && isAuthorEmpty) {
        setNotes(notes);
        return;
      }
    
      const filtered = notes.filter(note => {
        const titleMatch = !searchTitle || (note.title && note.title.toLowerCase().includes(searchTitle.toLowerCase()));
        const authorMatch = !searchAuthor || (note.author && note.author.toLowerCase().includes(searchAuthor.toLowerCase()));
        const programMatch = !searchProgram || searchProgram === '' || (note.program && note.program === searchProgram);
        const courseMatch = !searchCourse || searchCourse === '' || (note.course && note.course === searchCourse);
        return titleMatch && authorMatch && programMatch && courseMatch;
      });
      setNotes(filtered);
    };    

    const checkForNoteDuplicates = () => {
      const isTitleDupe = notes.some((note) => note.title === addTitle);
      const isLinkDupe = notes.some((note) => note.link === addLink);
      setErrorTitleDupe(isTitleDupe);
      setErrorLinkDupe(isLinkDupe);
      return (isTitleDupe || isLinkDupe);
    };

    const handleAddNoteTitleChange = (event) => {
      setNoteTitle(event.target.value);
    };

    const handleAddLinkChange = (event) => {
      setNoteLink(event.target.value);
    };

    const handleAddNoteProgramChange = (event) => {
      setNoteProgram(event.target.value);
    };

    const handleAddNoteCourseChange = (event) => {
      setNoteCourse(event.target.value);
    };

    const handleAddClick = async () => {
      if (!addTitle.trim() || !addLink.trim()) {
        setEmptyAdd(true);
        setAddConfirm(false);
        setErrorTitleDupe(false);
        setErrorLinkDupe(false);
        return;
      }
      if (checkForNoteDuplicates()) {
        setEmptyAdd(false);
        setAddConfirm(false);
        return;
      }
      try {
        await callAddNote();
        getNotes();
        setAddConfirm(true);
        setErrorTitleDupe(false);
        setErrorLinkDupe(false);
        setEmptyAdd(false);
        setNoteTitle('');
        setNoteLink('');
        setNoteProgram('');
        setNoteCourse('');
      } catch (error) {
        console.error('Error adding note:', error);
      }
    };
    
    const handleSearchTitleChange = (event) => {
      setSearchTitle(event.target.value);
      setIsSearchClicked(false);
    };

    const handleSearchAuthorChange = (event) => {
      setSearchAuthor(event.target.value);
      setIsSearchClicked(false);
    };

    const handleSearchClick = (event) => {
      setIsSearchClicked(true);
      if (searchTitle || searchAuthor) {
        getNoteSearch();
      }
    }
  
    const callAddNote = async () => {
      try {
        const url = serverURL + "/api/addNote";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: addTitle,
            link: addLink,
            program: addProgram,
            course: addCourse,
            uid: user.uid,
          })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        setNoteTitle('');
        setNoteLink('');
        return body;
      } catch (error) {
        console.error('Error adding note:', error);
        throw error;
      }
    };

    const getNoteSearch = () => {
      callGetNoteSearchResults()
        .then(res => {
          var parsed = JSON.parse(res.express);
          setNoteSearchResults(parsed);
        })
    }
  
    const callGetNoteSearchResults = async () => {
      const url = serverURL + "/api/getNoteSearchResults";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: searchTitle,
          author: searchAuthor,
        }),
      });
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
    }

    const getNotes = () => {
      if (isSearchClicked && searchTitle) {
        getNoteSearch(); 
      } else {
        callApiGetNotes().then((res) => {
          var parsed = JSON.parse(res.express);
          setNotes(parsed); 
        });
      }
    };
    
    useEffect(() => {
      getNotes();
    }, [isSearchClicked, searchTitle, searchAuthor]);

    useEffect(() => {
      fetch(`${serverURL}/api/getUniquePrograms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
            const programList = data.map((item) => item.program);
            setPrograms(programList);
        })
        .catch((error) => {
            console.error('Error fetching unique programs:', error);
        });
    }, [addConfirm]);

    useEffect(() => {
      fetch(`${serverURL}/api/getUniqueCourses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
            const courseList = data.map((item) => item.course);
            setCourses(courseList);
        })
        .catch((error) => {
            console.error('Error fetching unique courses:', error);
        });
    }, [addConfirm]);

  const callApiGetNotes = async () => {
    const url = serverURL + "/api/getNotes";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

    return (
      <div>
        <Typography variant='h4' color="primary" sx={{ marginLeft: 3, marginTop: 5}}>
          <strong>My Notes</strong>
        </Typography>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5} sx={{ marginLeft: 3 }}>
            <AddNote 
              handleAddClick={handleAddClick}
              TitleDupe={TitleDupe}
              LinkDupe={LinkDupe}
              emptyAdd={emptyAdd}
              addTitle={addTitle}
              addLink={addLink}
              addProgram={addProgram}
              addCourse={addCourse}
              addConfirm={addConfirm}
              handleAddNoteTitleChange={handleAddNoteTitleChange}
              handleAddLinkChange={handleAddLinkChange}
              handleAddNoteProgramChange={handleAddNoteProgramChange}
              handleAddNoteCourseChange={handleAddNoteCourseChange}
            />
          </Grid>
          <Grid item xs={12} md={6} >
            <Typography variant="h4">Search Notes</Typography>
              <SearchNotes
                handleSearchClick={handleSearchClick}
                handleSearchTitleChange={handleSearchTitleChange}
                handleSearchAuthorChange={handleSearchAuthorChange}
                handleSearchProgramChange={handleSearchProgramChange}
                handleSearchCourseChange={handleSearchCourseChange}
                handleFilterButtonClick={handleFilterButtonClick}
                searchTitle={searchTitle}
                searchAuthor={searchAuthor}
                searchProgram={searchProgram}
                searchCourse={searchCourse}
                programs={programs}
                courses={courses}
              />
            <Typography variant="h4" marginTop={'15px'}>
              Results
            </Typography>
            <Divider />
            <div style={{ marginTop: '10px' }}></div>
            {notes.filter(note => {
              const titleMatch = !searchTitle || (note.title && note.title.toLowerCase().includes(searchTitle.toLowerCase()));
              const authorMatch = !searchAuthor || (note.author && note.author.toLowerCase().includes(searchAuthor.toLowerCase()));
              return titleMatch && authorMatch && note.uid === user.uid;
            }).length > 0 ? 
              notes.filter(note => {
                const titleMatch = !searchTitle || (note.title && note.title.toLowerCase().includes(searchTitle.toLowerCase()));
                const authorMatch = !searchAuthor || (note.author && note.author.toLowerCase().includes(searchAuthor.toLowerCase()));
                return titleMatch && authorMatch && note.uid === user.uid;
              }).map((note, index) => (
                <div key={index}>
                  <Note note={note} handleDeleteNote={handleDeleteNote} />
                </div>
              ))
              :
              <Typography variant="body1">No search results found.</Typography>
            }
          </Grid>
        </Grid>
      </div>
    </div>
  );
}