package ma.demo.auctionapp.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    private BigDecimal currentBid; // Cache highest bid for easy access
    private LocalDateTime endTime;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonIgnore // Prevent recursion
    private User owner;

    @OneToMany(mappedBy = "item")
    @JsonIgnore // Prevent recursion
    private List<Bid> bids;
}