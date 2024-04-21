import mysql from 'mysql';
import config from './config.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

// Adding sign up profiles to database
app.post('/api/sendProfile', (req, res) => {
	const { userId, firstName, lastName, email } = req.body;
  
	let connection = mysql.createConnection(config);
  
	const sql = `INSERT INTO Users (uid, firstName, lastName, email) 
				 VALUES (?, ?, ?, ?)`;
  
	const data = [userId, firstName, lastName, email];
  
	connection.query(sql, data, (error, results, fields) => {
	  if (error) {
		console.error("Error adding profile:", error.message);
		return res.status(500).json({ error: "Error adding profile to the database" });
	  }
  
	  return res.status(200).json({ success: true, message: "Profile added successfully" });
	});
	connection.end();
  });

// Getting profiles from database
app.post('/api/getProfile', (req, res) => {
const { uid } = req.body;

let connection = mysql.createConnection(config);

const sql = `SELECT email, firstname, lastname, program FROM Users WHERE uid = ?`;

const data = [uid];

connection.query(sql, data, (error, results, fields) => {
	if (error) {
		return console.error(error.message);
	}
	res.send(results);
});
connection.end();
});

// Updating profiles from site
app.post('/api/updateProfile', (req, res) => {
	const { firstname, lastname, program, uid } = req.body;
	
	let connection = mysql.createConnection(config);
	
	const sql = `UPDATE Users SET firstname = ?, lastname = ?, program = ? WHERE uid = ?`;
	
	const data = [firstname, lastname, program, uid];
	
	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		res.send(results);
	});
	connection.end();
	});

//Nicole - API to get notes from the database
app.post('/api/getNotes', (req, res) => {
	let connection = mysql.createConnection(config);
	const sql = `SELECT n.uid, n.id, n.title, n.program, n.course, DATE_FORMAT(n.createdAt, '%Y-%m-%d') AS created_at, n.link, CONCAT(u.firstname, ' ', u.lastname) as author 
	FROM Notes n, Users u
	WHERE n.uid=u.uid`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});

// Get notes by GroupID
app.post('/api/getNotesByGroupID', (req, res) => {
	const { id } = req.body;
	
	let connection = mysql.createConnection(config);
	
	const sql = `SELECT n.*, u.firstname, u.lastname
    FROM Notes n
    JOIN Group_notes gn ON n.id = gn.note_id
    JOIN Users u ON n.uid = u.uid
    WHERE gn.group_id = ?`;
	
	const data = [id];
	
	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		res.send(results);
	});
	connection.end();
	});

//Nicole - Unique program results
app.post('/api/getUniquePrograms', (req, res) => {
    let connection = mysql.createConnection(config);

    const sql = `SELECT DISTINCT program FROM Notes`;

    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        res.send(results);
    });

    connection.end();
});

//Nicole - Unique courses results
app.post('/api/getUniqueCourses', (req, res) => {
    let connection = mysql.createConnection(config);

    const sql = `SELECT DISTINCT course FROM Notes`;

    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        res.send(results);
    });

    connection.end();
});

//Nicole - delete notes
app.delete('/api/deleteNote', (req, res) => {
    const { noteId } = req.body;
    let connection = mysql.createConnection(config);
    const sql = `DELETE FROM Notes WHERE id = ?`;
    const data = [noteId];
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    });
    connection.end();
});

// Delete note in groups
app.delete('/api/deleteNoteByGroup', (req, res) => {
    const { noteId, groupId } = req.body;
    let connection = mysql.createConnection(config);
    const sql = `DELETE FROM Group_notes WHERE note_id = ? AND group_id = ?`;
    const data = [noteId, groupId];
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    });
    connection.end();
});

//Nicole - Note search results
app.post('/api/getNoteSearchResults', (req, res) => {
	let connection = mysql.createConnection(config);
	let title = req.body.title;
	let author = req.body.authorName;
	
	let sql = 
		`SELECT n.title, n.uid, n.link, u.uid, CONCAT(u.firstname, ' ', u.lastname) as author
		FROM Notes n, Users u
		WHERE u.uid=n.uid`
	
		let data =[];

		if (title) {
			sql = sql + ` AND n.title = ?`
			data.push(title);
		}
		if (author){
			sql = sql + ` CONCAT(u.firstname, ' ', u.lastname) = ?`;
			data.push(author);
		}

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});

//Nicole - API to add new note to database
app.post('/api/addNote', (req, res) => {
	let connection = mysql.createConnection(config);
	let title = req.body.title;
	let link = req.body.link;
	let uid = req.body.uid;
	let program = req.body.program;
	let course = req.body.course;
  
	let sql = `INSERT INTO Notes (title, link, uid, createdAt, program, course) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`;
	let data = [title, link, uid, program, course];
  
	connection.query(sql, data, (error, results, fields) => {
	  if (error) {
		return console.error(error.message);
	  }
		let noteId = results.insertId;
		res.send({ noteId: noteId });
	});
	connection.end();
});


app.post('/api/addNoteByGroup', (req, res) => {
	let connection = mysql.createConnection(config);
	const { noteId, groupId } = req.body;

	let sql = `INSERT INTO Group_notes (note_id, group_id) VALUES (?, ?)`;
	let data = [noteId, groupId];
  
	connection.query(sql, data, (error, results, fields) => {
	  if (error) {
		return console.error(error.message);
	  }
  
	  let string = JSON.stringify(results);
	  res.send({ express: string });
	});
	connection.end();
});

app.post('/api/create-group', (req, res) => {
	const {courses, schoolYear, desiredNumberOfMembers, details, groupName} = req.body;
  
	let connection = mysql.createConnection(config);
  
	const sql = `INSERT INTO GroupDetails (Courses, SchoolYear, DesiredNumberOfMembers, Details, group_name) 
				 VALUES (?, ?, ?, ?, ?)`;
  
	const data = [courses, schoolYear, desiredNumberOfMembers, details, groupName];
  
	connection.query(sql, data, (error, results, fields) => {
	  if (error) {
		console.error("Error creating group:", error.message);
		res.status(500).json({ error: "Error creating group in the database" });
	  } else {
		res.status(200).json({ groupId: results.insertId });
	  }
	  connection.end();
	});
})

// Add a user to a group
app.post('/api/addGroupMember', (req, res) => {
	const { uid, groupId } = req.body; 

	let connection = mysql.createConnection(config);

	const sql = 'INSERT INTO User_groups (uid, group_id) VALUES (?, ?)';
	const data = [uid, groupId];

	connection.query(sql, data, (error, results) => {
	  connection.end();

	  if (error) {
		console.error('Error adding user to group:', error.message);
		res.status(500).json({ error: 'Error adding user to group' });
		return;
	  }

	  res.status(200).json({ message: 'User added to group successfully' });
	});
  });

// Check if a member is apart of a group
app.post('/api/getGroupMember', (req, res) => {
const { uid, groupId } = req.body; 

let connection = mysql.createConnection(config);

const sql = `SELECT * FROM User_groups WHERE uid = ? AND group_id = ?`;
const data = [uid, groupId];

connection.query(sql, data, (error, results) => {
	connection.end();

	if (error) {
	console.error('Error getting group member:', error.message);
	res.status(500).json({ error: 'Error getting group member' });
	return;
	}
	if (results.length > 0) {
		res.status(200).json({ isMember: true });
	} else {
		res.status(200).json({ isMember: false });
	}
});
});

app.delete('/api/removeGroupMember', (req, res) => {
const { uid, groupId } = req.body; 

let connection = mysql.createConnection(config);

const sql = 'DELETE FROM User_groups WHERE uid = ? AND group_id = ?';
const data = [uid, groupId];

connection.query(sql, data, (error, results) => {
	connection.end();
	if (error) {
	console.error('Error removing user from group:', error.message);
	res.status(500).json({ error: 'Error removing user from group' });
	return;
	}
	res.status(200).json({ message: 'User removed from group successfully' });
});
});

app.post('/api/getUserGroups', (req, res) => {
	const { uid } = req.body;
		let connection = mysql.createConnection(config);

	const sql = `SELECT gd.* 
	FROM GroupDetails gd
	JOIN User_groups ug ON gd.GroupID = ug.group_id
	WHERE ug.uid = ?;
	`;

	const data = [uid];

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});

// Get a group's details (including members)
app.post('/api/getGroupDetails', (req, res) => {
    const { id } = req.body;
  
    let connection = mysql.createConnection(config);
  
    const sql = `SELECT 
        gd.*,
        u.firstname,
        u.lastname
    FROM 
        GroupDetails gd
    LEFT JOIN 
        User_groups ug ON gd.GroupID = ug.group_id
    LEFT JOIN 
        Users u ON ug.uid = u.uid
    WHERE 
        gd.GroupID = ?`;
  
    const data = [id];
  
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error("Error querying group:", error.message);
            res.status(500).json({ error: "Error querying group from the database" });
            return; 
        }

        if (results.length === 0) {
    
            res.status(404).json({ error: "Group not found" });
            return;
        }

        const groupDetails = results.reduce((acc, current) => {
            if (!acc.group) {
                acc.group = { ...current };
                delete acc.group.firstname;
                delete acc.group.lastname;
                acc.group.members = []; 
            }
        
            if (current.firstname && current.lastname) {
                acc.group.members.push(current.firstname + ' ' + current.lastname);
            }
            return acc;
        }, { group: null });

        res.json(groupDetails.group); 
        connection.end();
    });
});



// search a group by program and course and return id
app.post('/api/searchGroup', (req, res) => {
    console.log('Searching for group:', req.body);

    const { uid, query } = req.body;
    let connection = mysql.createConnection(config);

	const sql = `SELECT gd.*, CASE WHEN ug.group_id IS NOT NULL THEN TRUE ELSE FALSE END AS joined
		FROM GroupDetails gd
		LEFT JOIN User_groups ug ON gd.GroupID = ug.group_id AND ug.uid = ?
		WHERE gd.group_name LIKE ?;`

    const data = [uid, `%${query}%`];

    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error(error.message);
            res.status(500).send('Server error occurred');
            return;
        }
        res.send({ data: results });
    });

    connection.end();
});

// search by firstname from users
app.post('/api/searchpeople', (req, res) => {

	console.log('searching for people:', req.body);
	
	const { query } = req.body;
	let connection = mysql.createConnection(config);

	const sql = `SELECT * FROM Users WHERE firstname LIKE ? or lastname LIKE ? or email LIKE ?`;

	const data = [`%${query}%`, `%${query}%`, `%${query}%`];
	
	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		res.send({ data: results });
	});
	
	
	connection.end();
	
	}
);



app.listen(port, () => console.log(`Listening on port ${port}`))
