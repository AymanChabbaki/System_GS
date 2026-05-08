package com.systemgs.config;

import com.systemgs.entities.*;
import com.systemgs.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SupplierRepository supplierRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private StockMovementRepository movementRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return; // Already seeded

        // 1. Seed Admin
        User admin = User.builder()
                .username("admin")
                .email("admin@toytrack.ma")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.admin)
                .isActive(true)
                .isPending(false)
                .build();
        userRepository.save(admin);

        // 2. Seed Categories
        Category cat1 = Category.builder().name("Jeux de Société").description("Jeux de plateau et cartes").build();
        Category cat2 = Category.builder().name("Jouets en Bois").description("Jouets durables et écologiques").build();
        Category cat3 = Category.builder().name("Figurines").description("Super-héros et personnages").build();
        categoryRepository.saveAll(Arrays.asList(cat1, cat2, cat3));

        // 3. Seed Suppliers
        Supplier sup1 = Supplier.builder().name("ToyDistri Maroc").email("contact@toydistri.ma").phone("0522000000").build();
        Supplier sup2 = Supplier.builder().name("PlayWorld Int").email("sales@playworld.com").phone("+331000000").build();
        supplierRepository.saveAll(Arrays.asList(sup1, sup2));

        // 4. Seed Products
        Product p1 = Product.builder().name("Monopoly Classique").purchasePrice(java.math.BigDecimal.valueOf(200.0)).salePrice(java.math.BigDecimal.valueOf(299.0)).quantity(50).category(cat1).supplier(sup1).build();
        Product p2 = Product.builder().name("Train en Bois").purchasePrice(java.math.BigDecimal.valueOf(100.0)).salePrice(java.math.BigDecimal.valueOf(150.0)).quantity(5).category(cat2).supplier(sup2).build();
        Product p3 = Product.builder().name("Puzzle 1000 pièces").purchasePrice(java.math.BigDecimal.valueOf(80.0)).salePrice(java.math.BigDecimal.valueOf(120.0)).quantity(20).category(cat1).supplier(sup1).build();
        Product p4 = Product.builder().name("Batman Figurine").purchasePrice(java.math.BigDecimal.valueOf(50.0)).salePrice(java.math.BigDecimal.valueOf(89.0)).quantity(100).category(cat3).supplier(sup2).build();
        Product p5 = Product.builder().name("Jeu d'échecs Luxe").purchasePrice(java.math.BigDecimal.valueOf(300.0)).salePrice(java.math.BigDecimal.valueOf(450.0)).quantity(2).category(cat1).supplier(sup1).build();
        productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));

        // 5. Seed Stock Movements (for the chart)
        LocalDateTime now = LocalDateTime.now();
        
        // Monday
        createMovement(p1, admin, StockMovement.MovementType.entry, 20, now.minusDays(6));
        createMovement(p1, admin, StockMovement.MovementType.exit, 5, now.minusDays(6));
        
        // Tuesday
        createMovement(p2, admin, StockMovement.MovementType.entry, 10, now.minusDays(5));
        
        // Wednesday
        createMovement(p4, admin, StockMovement.MovementType.entry, 50, now.minusDays(4));
        createMovement(p4, admin, StockMovement.MovementType.exit, 30, now.minusDays(4));
        
        // Thursday
        createMovement(p3, admin, StockMovement.MovementType.entry, 15, now.minusDays(3));
        
        // Friday
        createMovement(p5, admin, StockMovement.MovementType.exit, 1, now.minusDays(2));
        
        // Saturday
        createMovement(p1, admin, StockMovement.MovementType.exit, 10, now.minusDays(1));
        
        // Sunday (Today)
        createMovement(p4, admin, StockMovement.MovementType.exit, 20, now);

        System.out.println(">>> Sample data seeded successfully!");
    }

    private void createMovement(Product p, User u, StockMovement.MovementType type, Integer qty, LocalDateTime date) {
        StockMovement m = StockMovement.builder()
                .product(p)
                .user(u)
                .type(type)
                .quantity(qty)
                .createdAt(date)
                .reason("Données de test")
                .build();
        movementRepository.save(m);
    }
}
