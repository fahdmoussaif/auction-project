 package  ma.demo.auctionapp.config;

import ma.demo.auctionapp.entity.AuctionItem;
import ma.demo.auctionapp.entity.User;
import ma.demo.auctionapp.repository.AuctionItemRepository;
import lombok.RequiredArgsConstructor;
import ma.demo.auctionapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class LoadDummyData implements CommandLineRunner {

    private final UserRepository userRepo;
    private final AuctionItemRepository itemRepo;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Users ONLY if they don't exist
        User alice = createUserIfNotFound("alice", "password123");
        User bob = createUserIfNotFound("bob", "password123");

        // 2. Create Auction Item (Check if empty to avoid duplicates)
        if (itemRepo.count() == 0) {
            AuctionItem item = new AuctionItem();
            item.setTitle("Gaming Laptop 2024");
            item.setStartingPrice(new BigDecimal("1000.00"));
            item.setEndTime(LocalDateTime.now().plusDays(2));
            item.setOwner(alice);
            item.setImageUrl("https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80");
            itemRepo.save(item);
            System.out.println("--- DUMMY DATA LOADED ---");
        }
    }

    private User createUserIfNotFound(String username, String password) {
        return userRepo.findByUsername(username)
                .orElseGet(() -> {
                    User user = new User();
                    user.setUsername(username);
                    user.setPassword(password);
                    return userRepo.save(user);
                });
    }
}