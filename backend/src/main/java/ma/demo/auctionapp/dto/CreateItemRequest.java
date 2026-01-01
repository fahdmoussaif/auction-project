package ma.demo.auctionapp.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateItemRequest {
    private String title;
    private BigDecimal startingPrice;
    private Long ownerId;
    private Integer durationInHours;
    private String imageUrl;
}