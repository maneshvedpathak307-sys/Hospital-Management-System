package com.hms.dto;

public class MedicineResponse {

    private Long id;

    private String medicineName;

    private String genericName;

    private String category;

    public MedicineResponse() {
    }

    public MedicineResponse(
            Long id,
            String medicineName,
            String genericName,
            String category) {

        this.id = id;
        this.medicineName = medicineName;
        this.genericName = genericName;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(
            String medicineName) {

        this.medicineName = medicineName;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(
            String genericName) {

        this.genericName = genericName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(
            String category) {

        this.category = category;
    }
}