function validateEnrollment(data) {
  const errors = [];

  if (!data.studentId || isNaN(Number(data.studentId))) {
    errors.push('A valid studentId is required');
  }
  if (!data.courseId || isNaN(Number(data.courseId))) {
    errors.push('A valid courseId is required');
  }
  if (data.grade && !['A', 'B', 'C', 'D', 'F'].includes(data.grade.toUpperCase())) {
    errors.push('Grade must be one of: A, B, C, D, F');
  }

  return errors;
}

module.exports = { validateEnrollment };