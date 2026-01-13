package ma.demo.auctionapp.controller;


import ma.demo.auctionapp.dto.CreateItemRequest;
import ma.demo.auctionapp.entity.*;
import ma.demo.auctionapp.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuctionController {

    private final AuctionItemRepository itemRepo;
    private final BidRepository bidRepo;
    private final UserRepository userRepo;

    @GetMapping
    public List<AuctionItem> getAllItems() {
        return itemRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionItem> getItem(@PathVariable Long id) {
        return itemRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{itemId}/bid")
    public ResponseEntity<String> placeBid(@PathVariable Long itemId, @RequestBody BidRequest request) {

        AuctionItem item = itemRepo.findById(itemId)
                .orElse(null);
        if (item == null) return ResponseEntity.badRequest().body("Item not found");

        User bidder = userRepo.findById(request.getUserId())
                .orElse(null);
        if (bidder == null) return ResponseEntity.badRequest().body("User not found");

        if (LocalDateTime.now().isAfter(item.getEndTime())) {
            return ResponseEntity.badRequest().body("Auction has ended");
        }

        BigDecimal highestBid = (item.getCurrentBid() == null) ? item.getStartingPrice() : item.getCurrentBid();

        if (request.getAmount().compareTo(highestBid) <= 0) {
            return ResponseEntity.badRequest().body("Bid must be higher than " + highestBid);
        }

        Bid newBid = new Bid();
        newBid.setAmount(request.getAmount());
        newBid.setTimestamp(LocalDateTime.now());
        newBid.setBidder(bidder);
        newBid.setItem(item);
        bidRepo.save(newBid);

        item.setCurrentBid(request.getAmount());
        itemRepo.save(item);

        return ResponseEntity.ok("Bid placed successfully!");
    }

    @PostMapping
    public ResponseEntity<AuctionItem> createAuction(@RequestBody CreateItemRequest request) {
        User owner = userRepo.findById(request.getOwnerId())
                .orElse(null);
        if (owner == null) return ResponseEntity.badRequest().build();

        AuctionItem item = new AuctionItem();
        item.setTitle(request.getTitle());
        item.setStartingPrice(request.getStartingPrice());
        item.setOwner(owner);
        item.setImageUrl(request.getImageUrl());
        item.setEndTime(LocalDateTime.now().plusHours(request.getDurationInHours()));

        return ResponseEntity.ok(itemRepo.save(item));
    }
    @GetMapping("/{id}/bids")
    public ResponseEntity<List<Bid>> getItemBids(@PathVariable Long id) {
        return ResponseEntity.ok(bidRepo.findByItemId(id));
    }
}

@Data
class BidRequest {
    private Long userId;
    private BigDecimal amount;
}

