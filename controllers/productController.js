import pool from "../config/db.js";

// GET ALL PRODUCTS (PÚBLICO)
export const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM products ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
};

// CREATE PRODUCT (PROTEGIDO)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body || {};

        if (!name || !price) {
            if (!name || !price) return res.status(400).json({ message: "Datos incompletos" });
        }

        const newProduct = await pool.query(
            `INSERT INTO products (name, description, price, image, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [name, description, price, image, category]
        );

        res.status(201).json(newProduct.rows[0]);
    } catch (error) {
        console.error("PG ERROR:", error.message);
        console.error("DETAIL:", error.detail);
        console.error("CODE:", error.code);
        res.status(500).json({ message: error.message, detail: error.detail, code: error.code });
    }
    //console.error(error);
    //res.status(500).json({ message: "Error al crear producto" });
}
;
