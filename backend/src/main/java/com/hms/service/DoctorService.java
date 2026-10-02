package com.hms.service;

import com.hms.dto.DoctorCreateRequest;

public interface DoctorService {

    String createDoctor(DoctorCreateRequest request);
}