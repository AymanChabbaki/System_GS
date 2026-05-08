package com.systemgs.controllers;
import com.systemgs.entities.StockMovement;
import com.systemgs.repositories.CategoryRepository;
import com.systemgs.repositories.ProductRepository;
import com.systemgs.repositories.StockMovementRepository;
import com.systemgs.repositories.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired private ProductRepository productRepo;
    @Autowired private CategoryRepository categoryRepo;
    @Autowired private SupplierRepository supplierRepo;
    @Autowired private StockMovementRepository movementRepo;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productRepo.count());
        stats.put("totalCategories", categoryRepo.count());
        stats.put("totalSuppliers", supplierRepo.count());
        stats.put("lowStockCount", productRepo.findByQuantityLessThanEqual(5).size());
        return stats;
    }

    @GetMapping("/chart")
    public List<Map<String, Object>> getChartData() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<StockMovement> movements = movementRepo.findByCreatedAtAfter(sevenDaysAgo);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("E", Locale.FRENCH);
        
        // Group by day of week
        Map<String, Map<String, Integer>> grouped = movements.stream()
            .collect(Collectors.groupingBy(
                m -> m.getCreatedAt().format(formatter),
                Collectors.groupingBy(
                    m -> m.getType().name(),
                    Collectors.summingInt(StockMovement::getQuantity)
                )
            ));

        // Ensure all last 7 days are present
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            String day = LocalDateTime.now().minusDays(i).format(formatter);
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("day", day);
            Map<String, Integer> types = grouped.getOrDefault(day, new HashMap<>());
            dayData.put("entries", types.getOrDefault("entry", 0));
            dayData.put("exits", types.getOrDefault("exit", 0));
            result.add(dayData);
        }
        
        return result;
    }

    @GetMapping("/categories-distribution")
    public List<Map<String, Object>> getCategoriesDistribution() {
        return categoryRepo.findAll().stream().map(cat -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", cat.getName());
            map.put("count", productRepo.findByCategoryId(cat.getId()).size());
            return map;
        }).collect(Collectors.toList());
    }
}
