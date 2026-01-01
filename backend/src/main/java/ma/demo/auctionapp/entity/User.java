package ma.demo.auctionapp.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "app_user") // "User" is a reserved keyword in H2
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String username;
    private String password;

    @OneToMany(mappedBy = "owner")
    @JsonIgnore
    private List<AuctionItem> itemsForSale;

    @OneToMany(mappedBy = "bidder")
    @JsonIgnore
    private List<Bid> bids;
}