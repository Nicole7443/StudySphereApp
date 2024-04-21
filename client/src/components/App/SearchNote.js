import React from 'react';
import { Button, Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function SearchNotes({ handleSearchClick, handleSearchTitleChange, handleSearchAuthorChange, 
    handleSearchProgramChange, handleSearchCourseChange, handleFilterButtonClick, searchTitle, searchAuthor, searchProgram, searchCourse, programs, courses }) {
    return (
        <div>
            <Stack direction="row" spacing={2}>
                <TextField
                    label="Search By Title"
                    variant="standard"
                    sx={{ width: '50%' }}
                    value={searchTitle}
                    onChange={handleSearchTitleChange}
                />
                <TextField
                    label="Search By Author"
                    variant="standard"
                    sx={{ width: '50%' }}
                    value={searchAuthor}
                    onChange={handleSearchAuthorChange}
                />
                <Button 
                    variant="contained"
                    onClick={handleSearchClick}
                >
                    Search
                </Button>
            </Stack>
            <Stack direction="row" spacing={2} marginTop={2}>
                <FormControl variant="outlined" sx={{ width: '50%' }}>
                    <InputLabel id="program-select-label" sx={{ color: 'primary.main' }}>Select Program</InputLabel>
                    <Select
                        labelId="program-select-label"
                        id="program-select"
                        value={searchProgram}
                        onChange={handleSearchProgramChange}
                    >
                        <MenuItem value="">All Programs</MenuItem>
                        {programs.map(program => (
                            <MenuItem key={program} value={program}>{program}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ width: '50%' }}>
                    <InputLabel id="course-select-label" sx={{ color: 'primary.main' }}>Select Course</InputLabel>
                    <Select
                        labelId="course-select-label"
                        id="course-select"
                        value={searchCourse}
                        onChange={handleSearchCourseChange}
                    >
                        <MenuItem value="">All Courses</MenuItem>
                        {courses.map(course => (
                            <MenuItem key={course} value={course}>{course}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={handleFilterButtonClick}
                    sx={{ backgroundColor: 'grey', color: 'white' }}
                >
                    Filter
                </Button>
            </Stack>
        </div>
    );
}
