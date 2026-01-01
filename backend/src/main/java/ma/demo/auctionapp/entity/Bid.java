package ma.demo.auctionapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;

    @CreationTimestamp
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id") // DB column is user_id
    @JsonIgnoreProperties({"bids", "password"}) // Stop recursion: Don't load the User's bids or password
    private User bidder; // Field name MUST be 'bidder' to match 'findByBidderId'

    @ManyToOne
    @JoinColumn(name = "item_id")
    @JsonIgnoreProperties("bids") // Stop recursion: Don't load the Item's bid list again
    private AuctionItem item;
}