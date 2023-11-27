const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const students = [
  { id: 10, firstName: "Marty", lastName: "McFly", group: 101, rate: 9.5 },
  { id: 11, firstName: "Squidward", lastName: "Tentakles", group: 102, rate: 6.1 },
  { id: 12, firstName: "Donald", lastName: "Duck", group: 102, rate: 7.2 },
  { id: 13, firstName: "Sarah", lastName: "Connor", group: 101, rate: 8.3 },
  { id: 14, firstName: "Yugin", lastName: "Krabbs", group: 102, rate: 6.8 }
];

app.get('/students', (req, res) => {
  const sortBy = req.query.sortBy;
  if (sortBy === 'group') {
    students.sort((a, b) => a.group - b.group);
  } else if (sortBy === 'rate') {
    students.sort((a, b) => b.rate - a.rate);
  }

  const limit = parseInt(req.query.limit) || students.length;
  const offset = parseInt(req.query.offset) || 0;

  const paginatedStudents = students.slice(offset, offset + limit);

  res.json(paginatedStudents);
});

app.post('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { firstName, lastName, group, rate } = req.body;

  if (!firstName || !lastName) {
    res.status(400).json({ error: 'firstName and lastName are required fields' });
    return;
  }

  const newStudent = { id, firstName, lastName, group, rate };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  res.json(student);
});

app.put('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { firstName, lastName, group, rate } = req.body;

  if (!firstName || !lastName) {
    res.status(400).json({ error: 'firstName and lastName are required fields' });
    return;
  }

  const studentIndex = students.findIndex(s => s.id === id);

  if (studentIndex === -1) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  students[studentIndex] = { id, firstName, lastName, group, rate };
  res.json(students[studentIndex]);
});

app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(s => s.id === id);

  if (studentIndex === -1) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }
  students.splice(studentIndex, 1);
  res.sendStatus(204);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
