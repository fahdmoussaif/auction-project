package ma.demo.auctionapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"bids", "password"})
    private User bidder;

    @ManyToOne
    @JoinColumn(name = "item_id")
    @JsonIgnoreProperties("bids")
    private AuctionItem item;

    @JsonProperty("bidderName")
    public String getBidderName() {
        return bidder != null ? bidder.getUsername() : "Unknown";
    }
}