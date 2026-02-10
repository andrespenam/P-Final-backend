import pool from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo productos" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE featured = true ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo productos destacados" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, featured } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, description, price, image, category, featured)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, image, category, featured ?? false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creando producto" });
  }
};