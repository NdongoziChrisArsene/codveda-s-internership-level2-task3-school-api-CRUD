const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { validateStudent } = require('../validators/studentValidator');

router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { enrollments: { include: { course: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(req.params.id) },
      include: { enrollments: { include: { course: true } } },
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

router.post('/', async (req, res) => {
  const errors = validateStudent(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const student = await prisma.student.create({
      data: {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.toLowerCase().trim(),
      },
    });
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create student' });
  }
});

router.put('/:id', async (req, res) => {
  const errors = validateStudent(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const student = await prisma.student.update({
      where: { id: Number(req.params.id) },
      data: {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.toLowerCase().trim(),
      },
    });
    res.json(student);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(500).json({ error: 'Failed to update student' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;