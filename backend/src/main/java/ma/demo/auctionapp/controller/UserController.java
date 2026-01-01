package ma.demo.auctionapp.controller;


import ma.demo.auctionapp.dto.LoginRequest;
import ma.demo.auctionapp.dto.UserRequest;
import ma.demo.auctionapp.entity.AuctionItem;
import ma.demo.auctionapp.entity.Bid;
import ma.demo.auctionapp.entity.User;
import ma.demo.auctionapp.repository.AuctionItemRepository;
import ma.demo.auctionapp.repository.BidRepository;
import ma.demo.auctionapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepo;
    private final AuctionItemRepository itemRepo; // <--- MAKE SURE THIS IS HERE
    private final BidRepository bidRepo;          // <--- MAKE SURE THIS IS HERE

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRequest request) {
        if (userRepo.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        return ResponseEntity.ok(userRepo.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        Optional<User> user = userRepo.findByUsername(request.getUsername());
        if (user.isPresent() && user.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).build();
    }

    // --- THESE ARE THE NEW METHODS YOU LIKELY MISS ---

    @GetMapping("/{id}/items")
    public ResponseEntity<List<AuctionItem>> getUserItems(@PathVariable Long id) {
        return ResponseEntity.ok(itemRepo.findByOwnerId(id));
    }

    @GetMapping("/{id}/bids")
    public ResponseEntity<List<Bid>> getUserBids(@PathVariable Long id) {
        return ResponseEntity.ok(bidRepo.findByBidderId(id));
    }
}