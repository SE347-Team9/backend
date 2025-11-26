// Chuẩn hóa response thành công
exports.successResponse = (res, data, message = 'Thành công', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Chuẩn hóa response lỗi
exports.errorResponse = (res, message = 'Có lỗi xảy ra', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

// Response cho pagination
exports.paginatedResponse = (res, data, page, limit, total) => {
  return res.status(200).json({
    success: true,
    count: data.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data,
  });
};
