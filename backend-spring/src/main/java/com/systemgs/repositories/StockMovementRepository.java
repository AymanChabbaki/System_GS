package com.systemgs.repositories;
import com.systemgs.entities.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByCreatedAtAfter(LocalDateTime date);
}
