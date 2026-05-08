const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { validateCourse } = require('../validators/courseValidator');

router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { enrollments: { include: { student: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(req.params.id) },
      include: { enrollments: { include: { student: true } } },
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

router.post('/', async (req, res) => {
  const errors = validateCourse(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const course = await prisma.course.create({
      data: {
        title: req.body.title.trim(),
        description: req.body.description?.trim() || null,
        credits: Number(req.body.credits) || 3,
      },
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.put('/:id', async (req, res) => {
  const errors = validateCourse(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const course = await prisma.course.update({
      where: { id: Number(req.params.id) },
      data: {
        title: req.body.title.trim(),
        description: req.body.description?.trim() || null,
        credits: Number(req.body.credits) || 3,
      },
    });
    res.json(course);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Course not found' });
    res.status(500).json({ error: 'Failed to update course' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Course not found' });
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;