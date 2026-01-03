package com.project.order.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class ProductClient {

    @Autowired
    private RestTemplate restTemplate;

    private String productServiceUrl = "http://product-service:8081/api/products";

    public boolean checkStock(Long productId, Integer quantity, String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> request = new HashMap<>();
            request.put("productId", productId);
            request.put("quantity", quantity);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<Boolean> response = restTemplate.postForEntity(
                productServiceUrl + "/check-stock",
                entity,
                Boolean.class
            );

            return response.getBody() != null && response.getBody();
        } catch (Exception e) {
            return false;
        }
    }

    public void reduceStock(Long productId, Integer quantity, String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> request = new HashMap<>();
            request.put("productId", productId);
            request.put("quantity", quantity);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            restTemplate.postForEntity(
                productServiceUrl + "/reduce-stock",
                entity,
                Void.class
            );
        } catch (Exception e) {
            System.err.println("Error reducing stock: " + e.getMessage());
        }
    }
}
