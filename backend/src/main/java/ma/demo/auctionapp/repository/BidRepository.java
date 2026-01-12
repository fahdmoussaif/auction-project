package ma.demo.auctionapp.repository;

import ma.demo.auctionapp.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByBidderId(Long bidderId);
    List<Bid> findByItemId(Long itemId);
}