// middleware/errorMiddleware.js
export const notFound = (req, res, next) => {
  res.status(404).json({
    ok: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(status).json({
    ok: false,
    message: err.message || "Error interno",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};