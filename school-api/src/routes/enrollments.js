const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { validateEnrollment } = require('../validators/enrollmentValidator');

router.get('/', async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: { student: true, course: true },
      orderBy: { enrolledAt: 'desc' },
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

router.post('/', async (req, res) => {
  const errors = validateEnrollment(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(req.body.studentId),
        courseId: Number(req.body.courseId),
        grade: req.body.grade?.toUpperCase() || null,
      },
      include: { student: true, course: true },
    });
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Student is already enrolled in this course' });
    }
    if (error.code === 'P2003') {
      return res.status(404).json({ error: 'Student or course not found' });
    }
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

router.patch('/:id/grade', async (req, res) => {
  if (!req.body.grade || !['A', 'B', 'C', 'D', 'F'].includes(req.body.grade.toUpperCase())) {
    return res.status(400).json({ error: 'Grade must be one of: A, B, C, D, F' });
  }
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: Number(req.params.id) },
      data: { grade: req.body.grade.toUpperCase() },
      include: { student: true, course: true },
    });
    res.json(enrollment);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Enrollment not found' });
    res.status(500).json({ error: 'Failed to update grade' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.enrollment.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Enrollment removed successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Enrollment not found' });
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
});

module.exports = router;