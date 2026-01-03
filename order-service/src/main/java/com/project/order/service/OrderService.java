package com.project.order.service;

import com.project.order.client.ProductClient;
import com.project.order.model.Order;
import com.project.order.model.OrderItem;
import com.project.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductClient productClient;

    public Order createOrder(Order order, String userId, String username, String token) {
        order.setUserId(userId);
        order.setUsername(username);

        for(OrderItem item : order.getItems()) {
            boolean available = productClient.checkStock(item.getProductId(), item.getQuantite(), token);
            if(!available) {
                throw new RuntimeException("Product not available: " + item.getProductId());
            }
        }

        order.calculateTotal();
        Order savedOrder = orderRepository.save(order);

        for(OrderItem item : order.getItems()) {
            productClient.reduceStock(item.getProductId(), item.getQuantite(), token);
        }

        savedOrder.setStatut("CONFIRMED");
        return orderRepository.save(savedOrder);
    }

    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
}
