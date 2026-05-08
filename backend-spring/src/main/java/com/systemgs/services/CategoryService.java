package com.systemgs.services;
import com.systemgs.entities.Category;
import com.systemgs.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class CategoryService {
    @Autowired private CategoryRepository categoryRepository;
    public List<Category> getAllCategories() { return categoryRepository.findAll(); }
    public Category createCategory(Category category) { return categoryRepository.save(category); }
    public Category updateCategory(Long id, Category details) {
        Category category = categoryRepository.findById(id).orElseThrow();
        category.setName(details.getName());
        category.setDescription(details.getDescription());
        return categoryRepository.save(category);
    }
    public void deleteCategory(Long id) { categoryRepository.deleteById(id); }
}
