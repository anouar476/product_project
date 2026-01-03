package com.project.order.dto;

import com.project.order.model.Order;
import com.project.order.model.OrderItem;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    private Long id;
    private String userId;
    private String username;
    private LocalDateTime dateCommande;
    private String statut;
    private Double montantTotal;
    private List<OrderItem> items;

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.userId = order.getUserId();
        this.username = order.getUsername();
        this.dateCommande = order.getDateCommande();
        this.statut = order.getStatut();
        this.montantTotal = order.getMontantTotal();
        this.items = order.getItems();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getDateCommande() {
        return dateCommande;
    }

    public void setDateCommande(LocalDateTime dateCommande) {
        this.dateCommande = dateCommande;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Double getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(Double montantTotal) {
        this.montantTotal = montantTotal;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}
