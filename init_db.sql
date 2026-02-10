-- ===============================
-- 1️⃣ Crear usuario y base de datos
-- ===============================
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_user WHERE usename = 'panaderia_user') THEN
      CREATE USER panaderia_user WITH PASSWORD '123456';
   END IF;
END
$$;

DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'panaderia') THEN
      CREATE DATABASE panaderia OWNER panaderia_user;
   END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE panaderia TO panaderia_user;

-- ===============================
-- 2️⃣ Conectarse a la base de datos
-- ===============================
\c panaderia;

-- ===============================
-- 3️⃣ Crear tablas
-- ===============================

-- Usuarios
CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productos
CREATE TABLE IF NOT EXISTS "Products" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    image VARCHAR(255),
    stock INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos
CREATE TABLE IF NOT EXISTS "Orders" (
    id SERIAL PRIMARY KEY,
    "UserId" INT REFERENCES "Users"(id),
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia Orders-Products
CREATE TABLE IF NOT EXISTS "OrderProducts" (
    "OrderId" INT REFERENCES "Orders"(id),
    "ProductId" INT REFERENCES "Products"(id),
    quantity INT DEFAULT 1,
    PRIMARY KEY ("OrderId","ProductId")
);

-- ===============================
-- 4️⃣ Datos de prueba
-- ===============================

-- Usuarios
INSERT INTO "Users" (name, email, password, role)
VALUES 
('Admin', 'admin@dpieri.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8H.6JMGHhW5v.mq0y6ZHQORV5kmhFa', 'admin'),
('Juan', 'juan@dpieri.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8H.6JMGHhW5v.mq0y6ZHQORV5kmhFa', 'user');

-- Nota: el password de ejemplo es "123456" hasheado con bcrypt

-- Productos
INSERT INTO "Products" (name, description, price, stock, image)
VALUES
('Pan de molde', 'Pan blanco suave y fresco', 1500, 50, '/images/pan1.jpg'),
('Croissant', 'Delicioso croissant mantecoso', 1200, 30, '/images/croissant.jpg'),
('Baguette', 'Baguette francesa crujiente', 1800, 20, '/images/baguette.jpg');

-- Pedidos de prueba
INSERT INTO "Orders" ("UserId", total, status)
VALUES (2, 2700, 'pending');

-- Relación OrderProducts
INSERT INTO "OrderProducts" ("OrderId", "ProductId", quantity)
VALUES (1, 1, 1),
       (1, 2, 1);
