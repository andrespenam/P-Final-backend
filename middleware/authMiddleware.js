import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("No autorizado");
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userRes = await pool.query(
      "SELECT id, email, role FROM users WHERE id = $1",
      [decoded.id]
    );

    if (userRes.rowCount === 0) {
      res.status(401);
      throw new Error("No autorizado");
    }

    req.user = userRes.rows[0];
    next();
  } catch (err) {
    res.status(401);
    next(new Error("No autorizado"));
  }
};