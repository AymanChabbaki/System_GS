package com.systemgs.controllers;
import com.systemgs.entities.StockMovement;
import com.systemgs.repositories.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/movements")
public class StockMovementController {
    @Autowired private StockMovementRepository repository;
    @GetMapping public List<StockMovement> getAll() { return repository.findAll(); }
    @PostMapping public StockMovement create(@RequestBody StockMovement movement) { return repository.save(movement); }
}
