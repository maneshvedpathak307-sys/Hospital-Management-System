package com.hms.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentRequest {

    @NotBlank
    private String paymentMethod;

    public PaymentRequest() {
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}