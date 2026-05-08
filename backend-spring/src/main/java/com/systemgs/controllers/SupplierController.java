package com.systemgs.controllers;
import com.systemgs.entities.Supplier;
import com.systemgs.services.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    @Autowired private SupplierService service;
    @GetMapping public List<Supplier> getAll() { return service.getAll(); }
    @PostMapping 
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public Supplier create(@RequestBody Supplier s) { return service.save(s); }
    
    @DeleteMapping("/{id}") 
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
