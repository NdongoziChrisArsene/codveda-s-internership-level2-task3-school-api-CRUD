function validateCourse(data) {
  const errors = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  if (data.credits !== undefined && (isNaN(data.credits) || data.credits < 1 || data.credits > 6)) {
    errors.push('Credits must be a number between 1 and 6');
  }

  return errors;
}

module.exports = { validateCourse };