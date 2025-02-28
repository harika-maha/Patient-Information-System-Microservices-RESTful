exports.departmentMiddleware = (departments) => (request, response, next) => {
    if (!departments.includes(request.user.department)) {
      return response.status(403).json({ message: 'Access forbidden: Unauthorized department' });
    }
    next();
  };
  