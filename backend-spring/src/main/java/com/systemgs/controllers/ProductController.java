package com.systemgs.controllers;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.systemgs.entities.Product;
import com.systemgs.services.CloudinaryService;
import com.systemgs.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired private ProductService productService;
    @Autowired private CloudinaryService cloudinaryService;
    @GetMapping public List<Product> getAll() { return productService.getAllProducts(); }
    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> create(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("purchasePrice") Double purchasePrice,
            @RequestParam("salePrice") Double salePrice,
            @RequestParam("quantity") Integer quantity,
            @RequestParam(value = "minStockThreshold", required = false) Integer minStockThreshold,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "file", required = false) MultipartFile file) throws Exception {
        
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPurchasePrice(purchasePrice);
        product.setSalePrice(salePrice);
        product.setQuantity(quantity);
        product.setMinStockThreshold(minStockThreshold != null ? minStockThreshold : 10);
        
        // Handle category
        com.systemgs.entities.Category category = new com.systemgs.entities.Category();
        category.setId(categoryId);
        product.setCategory(category);

        if (file != null && !file.isEmpty()) { 
            product.setImageUrl(cloudinaryService.uploadFile(file)); 
        }
        
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> update(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("purchasePrice") Double purchasePrice,
            @RequestParam("salePrice") Double salePrice,
            @RequestParam("quantity") Integer quantity,
            @RequestParam(value = "minStockThreshold", required = false) Integer minStockThreshold,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "file", required = false) MultipartFile file) throws Exception {
        
        Product product = productService.getProductById(id);
        product.setName(name);
        product.setDescription(description);
        product.setPurchasePrice(purchasePrice);
        product.setSalePrice(salePrice);
        product.setQuantity(quantity);
        product.setMinStockThreshold(minStockThreshold != null ? minStockThreshold : 10);
        
        com.systemgs.entities.Category category = new com.systemgs.entities.Category();
        category.setId(categoryId);
        product.setCategory(category);

        if (file != null && !file.isEmpty()) { 
            product.setImageUrl(cloudinaryService.uploadFile(file)); 
        }
        
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @GetMapping("/{id}") public ResponseEntity<Product> getById(@PathVariable Long id) { return ResponseEntity.ok(productService.getProductById(id)); }
    
    @DeleteMapping("/{id}") 
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) { 
        productService.deleteProduct(id); 
        return ResponseEntity.ok().build(); 
    }
}
