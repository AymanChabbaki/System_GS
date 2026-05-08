package com.systemgs.controllers;
import com.systemgs.entities.Product;
import com.systemgs.entities.User;
import com.systemgs.entities.StockMovement;
import com.systemgs.repositories.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/movements")
public class StockMovementController {
    @Autowired private StockMovementRepository repository;
    @Autowired private com.systemgs.repositories.ProductRepository productRepository;
    @Autowired private com.systemgs.repositories.UserRepository userRepository;
    @Autowired private com.systemgs.services.EmailService emailService;
    @org.springframework.beans.factory.annotation.Value("${app.admin.email}") private String adminEmail;

    @GetMapping     @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public List<StockMovement> getAll() { return repository.findAll(); }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload, Principal principal) {
        try {
            Long productId = Long.valueOf(payload.get("productId").toString());
            Integer quantity = Integer.valueOf(payload.get("quantity").toString());
            String typeStr = payload.get("type").toString().toLowerCase();
            String reason = payload.get("reason") != null ? payload.get("reason").toString() : "";

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            StockMovement movement = StockMovement.builder()
                    .product(product)
                    .user(user)
                    .type(StockMovement.MovementType.valueOf(typeStr))
                    .quantity(quantity)
                    .reason(reason)
                    .build();

            // Update product quantity
            if (movement.getType() == StockMovement.MovementType.entry) {
                product.setQuantity(product.getQuantity() + quantity);
            } else {
                if (product.getQuantity() < quantity) {
                    return ResponseEntity.badRequest().body("Stock insuffisant");
                }
                product.setQuantity(product.getQuantity() - quantity);
            }
            productRepository.save(product);
            
            // Notification logic
            if (product.getQuantity() <= product.getMinStockThreshold()) {
                try {
                    String subject = "🚨 Alerte Stock Bas: " + product.getName();
                    String text = "L'article " + product.getName() + " (Réf: " + product.getId() + ") a atteint un niveau critique.\n" +
                                 "Stock actuel: " + product.getQuantity() + " " + (product.getQuantity() <= 1 ? "unité" : "unités") + ".\n" +
                                 "Seuil configuré: " + product.getMinStockThreshold() + " unités.\n\n" +
                                 "Veuillez réapprovisionner dès que possible.";
                    emailService.sendSimpleMessage(adminEmail, subject, text);
                } catch (Exception e) {
                    System.err.println("Erreur envoi email: " + e.getMessage());
                }
            }
            
            return ResponseEntity.ok(repository.save(movement));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Erreur: " + e.getMessage());
        }
    }
}
