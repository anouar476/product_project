package com.project.order.controller;

import com.project.order.model.Order;
import com.project.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Order> createOrder(@RequestBody Order order, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getSubject();
        String username = jwt.getClaimAsString("preferred_username");
        String token = jwt.getTokenValue();

        try {
            Order created = orderService.createOrder(order, userId, username, token);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('CLIENT')")
    public List<Order> getMyOrders(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getSubject();
        return orderService.getUserOrders(userId);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getSubject();

        return orderService.getOrderById(id)
                .map(order -> {
                    if(order.getUserId().equals(userId) || authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.ok(order);
                    }
                    return ResponseEntity.status(403).<Order>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
