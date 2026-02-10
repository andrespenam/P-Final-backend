import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("name, email y password son requeridos");
    }

    const emailNorm = email.trim().toLowerCase();

    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [emailNorm]
    );

    if (exists.rowCount > 0) {
      res.status(400);
      throw new Error("Usuario ya existe");
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, emailNorm, hashed, "user"]
    );

    const user = result.rows[0];
    const token = signToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email y password requeridos");
    }

    const emailNorm = email.trim().toLowerCase();

    const result = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = $1",
      [emailNorm]
    );

    if (result.rowCount === 0) {
      res.status(401);
      throw new Error("Credenciales inválidas");
    }

    const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401);
      throw new Error("Credenciales inválidas");
    }

    const token = signToken(user);

    // ✅ Esto hace que tu test pase: token en login
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};