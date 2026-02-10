import pool from "../config/db.js";

// Crear orden (con transacción y total calculado en backend)
export const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Orden vacía" });
    }

    await client.query("BEGIN");

    let total = 0;

    // Validar items + obtener precio real
    for (const item of items) {
      if (!item.product_id || !item.quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Item inválido" });
      }

      const prod = await client.query(
        "SELECT id, price FROM products WHERE id = $1",
        [item.product_id]
      );

      if (prod.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: `Producto ${item.product_id} no existe` });
      }

      const price = Number(prod.rows[0].price);
      const qty = Number(item.quantity);

      total += price * qty;
      item._price = price; // guardamos el precio real
    }

    // Crear orden (si tu columna status tiene default, igual sirve)
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id",
      [userId, total, "pending"]
    );

    const orderId = orderResult.rows[0].id;

    // Insertar detalles
    for (const item of items) {
      await client.query(
        `INSERT INTO order_details (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item._price]
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ message: "Orden creada", orderId, total });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ message: "Error al crear orden" });
  } finally {
    client.release();
  }
};

// Obtener órdenes del usuario (protegido)
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return res.json(orders.rows);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return res.status(500).json({ message: "Error al obtener órdenes" });
  }
};

export const getOrders = getUserOrders;