-- Seed Data for ToyTrack Pro
-- Password for admin is: admin123 (BCrypt hash used below)

-- 1. Users
INSERT INTO users (username, email, password_hash, role, is_active, is_pending, created_at) 
VALUES ('admin', 'admin@toytrack.ma', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'admin', 1, 0, NOW());

-- 2. Categories
INSERT INTO categories (name, description) VALUES 
('Jeux de Société', 'Jeux de plateau et cartes pour toute la famille'),
('Jouets en Bois', 'Jouets durables, traditionnels et écologiques'),
('Figurines', 'Super-héros, personnages de films et figurines articulées');

-- 3. Suppliers
INSERT INTO suppliers (name, contact_name, email, phone, address) VALUES 
('ToyDistri Maroc', 'Yassine', 'contact@toydistri.ma', '0522000000', 'Quartier Industriel, Casablanca'),
('PlayWorld Int', 'Sarah', 'sales@playworld.com', '+331000000', 'Paris, France');

-- 4. Products (IDs assume auto-increment starting at 1)
INSERT INTO products (name, reference, purchase_price, sale_price, quantity, min_stock_threshold, category_id, supplier_id) VALUES 
('Monopoly Classique', 'MON-001', 200.0, 299.0, 50, 10, 1, 1),
('Train en Bois', 'WOOD-TR-01', 100.0, 150.0, 5, 10, 2, 2),
('Puzzle 1000 pièces', 'PUZ-1000', 80.0, 120.0, 20, 5, 1, 1),
('Batman Figurine', 'BAT-FIG-01', 50.0, 89.0, 100, 15, 3, 2),
('Jeu d\'échecs Luxe', 'CHESS-LX', 300.0, 450.0, 2, 5, 1, 1);

-- 5. Stock Movements (IDs assume user admin is 1 and products are 1-5)
INSERT INTO stock_movements (product_id, user_id, type, quantity, reason, created_at) VALUES 
(1, 1, 'entry', 20, 'Stock initial', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(1, 1, 'exit', 5, 'Vente magasin', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2, 1, 'entry', 10, 'Réception commande', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 1, 'entry', 50, 'Arrivage nouveau', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 1, 'exit', 30, 'Vente en ligne', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 1, 'entry', 15, 'Réassort', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 1, 'exit', 1, 'Vente client VIP', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 1, 'exit', 10, 'Vente magasin', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 1, 'exit', 20, 'Vente flash', NOW());
