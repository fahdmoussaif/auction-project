package ma.demo.auctionapp.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class AuctionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private BigDecimal startingPrice;
    private BigDecimal currentBid;
    private LocalDateTime endTime;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    @OneToMany(mappedBy = "item")
    @JsonIgnore
    private List<Bid> bids;

    @JsonProperty("highestBidderName")
    public String getHighestBidderName() {
        if (bids == null || bids.isEmpty()) {
            return "No bids yet";
        }
        return bids.stream()
                .max(Comparator.comparing(Bid::getAmount))
                .map(bid -> bid.getBidder().getUsername())
                .orElse("No bids yet");
    }
    @JsonProperty("ownerName")
    public String getOwnerName() {
        if (owner == null) {
            return "Unknown";
        }
        return owner.getUsername();
    }
}