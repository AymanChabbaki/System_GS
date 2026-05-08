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
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Product> create(@RequestPart("product") String productStr, @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        Product product = new ObjectMapper().readValue(productStr, Product.class);
        if (image != null && !image.isEmpty()) { product.setImageUrl(cloudinaryService.uploadFile(image)); }
        return ResponseEntity.ok(productService.saveProduct(product));
    }
    @GetMapping("/{id}") public ResponseEntity<Product> getById(@PathVariable Long id) { return ResponseEntity.ok(productService.getProductById(id)); }
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id) { productService.deleteProduct(id); return ResponseEntity.ok().build(); }
}
