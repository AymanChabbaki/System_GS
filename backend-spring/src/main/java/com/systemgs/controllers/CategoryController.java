package com.systemgs.controllers;
import com.systemgs.entities.Category;
import com.systemgs.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired private CategoryService categoryService;
    @GetMapping public List<Category> getAll() { return categoryService.getAllCategories(); }
    @PostMapping public Category create(@RequestBody Category category) { return categoryService.createCategory(category); }
    @PutMapping("/{id}") public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category details) {
        return ResponseEntity.ok(categoryService.updateCategory(id, details));
    }
    @DeleteMapping("/{id}") public ResponseEntity<?> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id); return ResponseEntity.ok().build();
    }
}
