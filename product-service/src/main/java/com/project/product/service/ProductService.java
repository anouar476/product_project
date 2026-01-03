package com.project.product.service;

import com.project.product.model.Product;
import com.project.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setNom(productDetails.getNom());
        product.setDescription(productDetails.getDescription());
        product.setPrix(productDetails.getPrix());
        product.setQuantite(productDetails.getQuantite());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public boolean checkStock(Long id, Integer quantity) {
        Optional<Product> product = productRepository.findById(id);
        if(product.isPresent()) {
            return product.get().getQuantite() >= quantity;
        }
        return false;
    }

    public void reduceStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setQuantite(product.getQuantite() - quantity);
        productRepository.save(product);
    }
}
