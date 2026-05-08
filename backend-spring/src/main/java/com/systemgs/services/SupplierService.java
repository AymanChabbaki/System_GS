package com.systemgs.services;
import com.systemgs.entities.Supplier;
import com.systemgs.repositories.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class SupplierService {
    @Autowired private SupplierRepository supplierRepository;
    public List<Supplier> getAll() { return supplierRepository.findAll(); }
    public Supplier save(Supplier s) { return supplierRepository.save(s); }
    public void delete(Long id) { supplierRepository.deleteById(id); }
}
