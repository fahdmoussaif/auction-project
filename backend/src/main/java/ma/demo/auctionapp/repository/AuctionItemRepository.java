package ma.demo.auctionapp.repository;

import ma.demo.auctionapp.entity.AuctionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuctionItemRepository extends JpaRepository<AuctionItem, Long> {
    List<AuctionItem> findByOwnerId(Long ownerId);
}