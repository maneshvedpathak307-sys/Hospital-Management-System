package com.hms.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.dto.PrescriptionMedicineRequest;
import com.hms.dto.PrescriptionMedicineResponse;
import com.hms.dto.PrescriptionRequest;
import com.hms.dto.PrescriptionResponse;
import com.hms.entity.Appointment;
import com.hms.entity.AppointmentStatus;
import com.hms.entity.Doctor;
import com.hms.entity.Medicine;
import com.hms.entity.Patient;
import com.hms.entity.Prescription;
import com.hms.entity.PrescriptionMedicine;
import com.hms.entity.User;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.MedicineRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.PrescriptionRepository;
import com.hms.repository.UserRepository;

@Service
@Transactional
public class PrescriptionServiceImpl
        implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    private final AppointmentRepository appointmentRepository;

    private final DoctorRepository doctorRepository;

    private final PatientRepository patientRepository;

    private final UserRepository userRepository;

    private final MedicineRepository medicineRepository;

    private final PrescriptionPdfService prescriptionPdfService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PrescriptionServiceImpl(
            PrescriptionRepository prescriptionRepository,
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            UserRepository userRepository,
            MedicineRepository medicineRepository,
            PrescriptionPdfService prescriptionPdfService) {

        this.prescriptionRepository =
                prescriptionRepository;

        this.appointmentRepository =
                appointmentRepository;

        this.doctorRepository =
                doctorRepository;

        this.patientRepository =
                patientRepository;

        this.userRepository =
                userRepository;

        this.medicineRepository =
                medicineRepository;

        this.prescriptionPdfService =
                prescriptionPdfService;
    }


    // =====================================================
    // DOCTOR - CREATE PRESCRIPTION
    // =====================================================

    @Override
    public PrescriptionResponse createPrescription(
            PrescriptionRequest request,
            Authentication authentication) {

        Doctor doctor =
                getLoggedInDoctor(authentication);


        // =================================================
        // FIND APPOINTMENT
        // =================================================

        Appointment appointment =
                appointmentRepository
                        .findById(
                                request.getAppointmentId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );


        // =================================================
        // CHECK APPOINTMENT DOCTOR
        // =================================================

        if (appointment.getDoctor() == null ||
                !appointment.getDoctor()
                        .getId()
                        .equals(doctor.getId())) {

            throw new RuntimeException(
                    "You are not authorized for this appointment"
            );
        }


        // =================================================
        // CHECK APPOINTMENT STATUS
        // =================================================

        if (appointment.getStatus()
                != AppointmentStatus.COMPLETED) {

            throw new RuntimeException(
                    "Prescription can be created only for completed appointments"
            );
        }


        // =================================================
        // CHECK DUPLICATE PRESCRIPTION
        // =================================================

        if (prescriptionRepository
                .existsByAppointmentId(
                        appointment.getId()
                )) {

            throw new RuntimeException(
                    "Prescription already exists for this appointment"
            );
        }


        // =================================================
        // CREATE PRESCRIPTION
        // =================================================

        Prescription prescription =
                new Prescription();


        prescription.setAppointment(
                appointment
        );


        prescription.setPatient(
                appointment.getPatient()
        );


        prescription.setDoctor(
                doctor
        );


        prescription.setDiagnosis(
                request.getDiagnosis()
        );


        prescription.setInstructions(
                request.getInstructions()
        );


        prescription.setPrescriptionDate(
                LocalDate.now()
        );


        prescription.setPatientDeleted(
                false
        );


        // =================================================
        // ADD MEDICINES
        // =================================================

        addMedicinesToPrescription(
                prescription,
                request.getMedicines()
        );


        // =================================================
        // SAVE
        // =================================================

        Prescription savedPrescription =
                prescriptionRepository.save(
                        prescription
                );


        return convertToResponse(
                savedPrescription
        );
    }


    // =====================================================
    // DOCTOR - UPDATE PRESCRIPTION
    // =====================================================

    @Override
    public PrescriptionResponse updatePrescription(
            Long prescriptionId,
            PrescriptionRequest request,
            Authentication authentication) {

        Doctor doctor =
                getLoggedInDoctor(authentication);


        // =================================================
        // FIND PRESCRIPTION
        // =================================================

        Prescription prescription =
                prescriptionRepository
                        .findById(prescriptionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Prescription not found"
                                )
                        );


        // =================================================
        // SECURITY CHECK
        // =================================================

        if (prescription.getDoctor() == null ||
                !prescription.getDoctor()
                        .getId()
                        .equals(doctor.getId())) {

            throw new RuntimeException(
                    "You are not authorized to update this prescription"
            );
        }


        // =================================================
        // CHECK REQUEST APPOINTMENT
        // =================================================

        if (request.getAppointmentId() == null) {

            throw new RuntimeException(
                    "Appointment ID is required"
            );
        }


        // =================================================
        // VERIFY ORIGINAL APPOINTMENT
        // =================================================

        if (prescription.getAppointment() == null ||
                !prescription.getAppointment()
                        .getId()
                        .equals(request.getAppointmentId())) {

            throw new RuntimeException(
                    "Prescription appointment cannot be changed"
            );
        }


        // =================================================
        // CHECK MEDICINES
        // =================================================

        if (request.getMedicines() == null ||
                request.getMedicines().isEmpty()) {

            throw new RuntimeException(
                    "At least one medicine is required"
            );
        }


        // =================================================
        // UPDATE DIAGNOSIS
        // =================================================

        prescription.setDiagnosis(
                request.getDiagnosis()
        );


        // =================================================
        // UPDATE GENERAL INSTRUCTIONS
        // =================================================

        prescription.setInstructions(
                request.getInstructions()
        );


        // =================================================
        // REMOVE OLD MEDICINES
        // =================================================
        //
        // orphanRemoval = true in Prescription entity
        // means old PrescriptionMedicine records are
        // removed from the database.
        //
        // =================================================

        prescription
                .getPrescriptionMedicines()
                .clear();


        // =================================================
        // ADD UPDATED MEDICINES
        // =================================================

        addMedicinesToPrescription(
                prescription,
                request.getMedicines()
        );


        // =================================================
        // SAVE UPDATED PRESCRIPTION
        // =================================================

        Prescription updatedPrescription =
                prescriptionRepository.save(
                        prescription
                );


        return convertToResponse(
                updatedPrescription
        );
    }


    // =====================================================
    // ADD MEDICINES HELPER
    // =====================================================

    private void addMedicinesToPrescription(
            Prescription prescription,
            List<PrescriptionMedicineRequest> medicines) {

        if (medicines == null) {
            return;
        }


        for (
                PrescriptionMedicineRequest medicineRequest :
                medicines
        ) {

            if (medicineRequest.getMedicineId() == null) {

                throw new RuntimeException(
                        "Medicine ID is required"
                );
            }


            Medicine medicine =
                    medicineRepository
                            .findById(
                                    medicineRequest
                                            .getMedicineId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Medicine not found: "
                                                    + medicineRequest
                                                    .getMedicineId()
                                    )
                            );


            PrescriptionMedicine
                    prescriptionMedicine =
                    new PrescriptionMedicine();


            prescriptionMedicine.setMedicine(
                    medicine
            );


            prescriptionMedicine.setDosage(
                    medicineRequest.getDosage()
            );


            prescriptionMedicine.setFrequency(
                    medicineRequest.getFrequency()
            );


            prescriptionMedicine.setDuration(
                    medicineRequest.getDuration()
            );


            prescriptionMedicine.setInstructions(
                    medicineRequest.getInstructions()
            );


            prescription.addPrescriptionMedicine(
                    prescriptionMedicine
            );
        }
    }


    // =====================================================
    // DOCTOR - GET TODAY'S PRESCRIPTIONS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponse>
    getDoctorPrescriptions(
            Authentication authentication) {

        Doctor doctor =
                getLoggedInDoctor(authentication);


        LocalDate today =
                LocalDate.now();


        List<Prescription> prescriptions =
                prescriptionRepository
                        .findByDoctorIdAndPrescriptionDateAndPatientDeletedFalseOrderByCreatedAtDesc(
                                doctor.getId(),
                                today
                        );


        List<PrescriptionResponse> response =
                new ArrayList<>();


        for (
                Prescription prescription :
                prescriptions
        ) {

            response.add(
                    convertToResponse(
                            prescription
                    )
            );
        }


        return response;
    }


    // =====================================================
    // DOCTOR - GET SINGLE PRESCRIPTION
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public PrescriptionResponse getDoctorPrescriptionById(
            Long prescriptionId,
            Authentication authentication) {

        Doctor doctor =
                getLoggedInDoctor(authentication);


        Prescription prescription =
                prescriptionRepository
                        .findById(prescriptionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Prescription not found"
                                )
                        );


        // =================================================
        // SECURITY CHECK
        // =================================================

        if (prescription.getDoctor() == null ||
                !prescription.getDoctor()
                        .getId()
                        .equals(doctor.getId())) {

            throw new RuntimeException(
                    "You are not authorized to view this prescription"
            );
        }


        return convertToResponse(
                prescription
        );
    }


    // =====================================================
    // PATIENT - GET MY PRESCRIPTIONS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponse>
    getPatientPrescriptions(
            Authentication authentication) {

        Patient patient =
                getLoggedInPatient(authentication);


        List<Prescription> prescriptions =
                prescriptionRepository
                        .findByPatientIdAndPatientDeletedFalseOrderByCreatedAtDesc(
                                patient.getId()
                        );


        List<PrescriptionResponse> response =
                new ArrayList<>();


        for (
                Prescription prescription :
                prescriptions
        ) {

            response.add(
                    convertToResponse(
                            prescription
                    )
            );
        }


        return response;
    }


    // =====================================================
    // PATIENT - DOWNLOAD PDF
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public byte[] generatePatientPrescriptionPdf(
            Long prescriptionId,
            Authentication authentication) {

        Patient patient =
                getLoggedInPatient(authentication);


        Prescription prescription =
                prescriptionRepository
                        .findById(prescriptionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Prescription not found"
                                )
                        );


        // =================================================
        // SECURITY CHECK
        // =================================================

        if (prescription.getPatient() == null ||
                !prescription.getPatient()
                        .getId()
                        .equals(patient.getId())) {

            throw new RuntimeException(
                    "You are not authorized to download this prescription"
            );
        }


        // =================================================
        // CHECK IF HIDDEN BY PATIENT
        // =================================================

        if (prescription.isPatientDeleted()) {

            throw new RuntimeException(
                    "This prescription has been removed from your prescription list"
            );
        }


        return prescriptionPdfService
                .generatePrescriptionPdf(
                        prescription
                );
    }


 // =====================================================
 // PATIENT - REMOVE PRESCRIPTION
 // =====================================================

    @Override
    public void deletePatientPrescription(
            Long prescriptionId,
            Authentication authentication) {

        // =====================================================
        // GET LOGGED-IN PATIENT
        // =====================================================

        Patient patient =
                getLoggedInPatient(
                        authentication
                );

        // =====================================================
        // FIND PRESCRIPTION
        // =====================================================

        Prescription prescription =
                prescriptionRepository
                        .findById(prescriptionId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Prescription not found"
                                        )
                        );

        // =====================================================
        // SECURITY
        // Patient can delete ONLY their own prescription
        // =====================================================

        if (prescription.getPatient() == null
                || !prescription.getPatient()
                        .getId()
                        .equals(patient.getId())) {

            throw new RuntimeException(
                    "You are not authorized to remove this prescription"
            );
        }

        // =====================================================
        // ONLY PREVIOUS PRESCRIPTIONS
        // =====================================================

        LocalDate today =
                LocalDate.now();

        if (prescription.getPrescriptionDate() == null
                || !prescription.getPrescriptionDate()
                        .isBefore(today)) {

            throw new RuntimeException(
                    "Only previous prescriptions can be removed"
            );
        }

        // =====================================================
        // ALREADY REMOVED
        // =====================================================

        if (prescription.isPatientDeleted()) {

            throw new RuntimeException(
                    "Prescription is already removed"
            );
        }

        // =====================================================
        // SOFT DELETE
        // =====================================================

        prescription.setPatientDeleted(
                true
        );

        prescriptionRepository.save(
                prescription
        );
    }

    // =====================================================
    // CONVERT ENTITY -> DTO
    // =====================================================

    private PrescriptionResponse convertToResponse(
            Prescription prescription) {

        PrescriptionResponse dto =
                new PrescriptionResponse();


        // =================================================
        // PRESCRIPTION ID
        // =================================================

        dto.setId(
                prescription.getId()
        );


        // =================================================
        // APPOINTMENT
        // =================================================

        if (prescription.getAppointment() != null) {

            dto.setAppointmentId(
                    prescription
                            .getAppointment()
                            .getId()
            );


            dto.setAppointmentDate(
                    prescription
                            .getAppointment()
                            .getAppointmentDate()
            );


            dto.setAppointmentTime(
                    prescription
                            .getAppointment()
                            .getAppointmentTime()
            );
        }


        // =================================================
        // PATIENT
        // =================================================

        if (prescription.getPatient() != null) {

            dto.setPatientId(
                    prescription
                            .getPatient()
                            .getId()
            );


            dto.setPatientName(
                    prescription
                            .getPatient()
                            .getPatientName()
            );
        }


        // =================================================
        // DOCTOR
        // =================================================

        if (prescription.getDoctor() != null) {

            dto.setDoctorId(
                    prescription
                            .getDoctor()
                            .getId()
            );


            dto.setDoctorName(
                    prescription
                            .getDoctor()
                            .getDoctorName()
            );


            if (prescription.getDoctor()
                    .getDepartment() != null) {

                dto.setDepartmentName(
                        prescription
                                .getDoctor()
                                .getDepartment()
                                .getDepartmentName()
                );
            }
        }


        // =================================================
        // PRESCRIPTION DETAILS
        // =================================================

        dto.setDiagnosis(
                prescription.getDiagnosis()
        );


        dto.setInstructions(
                prescription.getInstructions()
        );


        dto.setPrescriptionDate(
                prescription.getPrescriptionDate()
        );


        dto.setCreatedAt(
                prescription.getCreatedAt()
        );


        // =================================================
        // MEDICINES
        // =================================================

        List<PrescriptionMedicineResponse>
                medicineResponses =
                new ArrayList<>();


        if (prescription.getPrescriptionMedicines()
                != null) {

            for (
                    PrescriptionMedicine pm
                    : prescription
                            .getPrescriptionMedicines()
            ) {

                PrescriptionMedicineResponse
                        medicineResponse =
                        new PrescriptionMedicineResponse();


                medicineResponse.setId(
                        pm.getId()
                );


                if (pm.getMedicine() != null) {

                    medicineResponse.setMedicineId(
                            pm.getMedicine().getId()
                    );


                    medicineResponse.setMedicineName(
                            pm.getMedicine()
                                    .getMedicineName()
                    );


                    medicineResponse.setGenericName(
                            pm.getMedicine()
                                    .getGenericName()
                    );


                    medicineResponse.setCategory(
                            pm.getMedicine()
                                    .getCategory()
                    );
                }


                medicineResponse.setDosage(
                        pm.getDosage()
                );


                medicineResponse.setFrequency(
                        pm.getFrequency()
                );


                medicineResponse.setDuration(
                        pm.getDuration()
                );


                medicineResponse.setInstructions(
                        pm.getInstructions()
                );


                medicineResponses.add(
                        medicineResponse
                );
            }
        }


        dto.setMedicines(
                medicineResponses
        );


        return dto;
    }


    // =====================================================
    // GET LOGGED-IN DOCTOR
    // =====================================================

    private Doctor getLoggedInDoctor(
            Authentication authentication) {

        if (authentication == null) {

            throw new RuntimeException(
                    "Authentication required"
            );
        }


        String loginEmail =
                authentication.getName();


        if (loginEmail == null ||
                loginEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Login email not found"
            );
        }


        User user =
                userRepository
                        .findByLoginEmail(
                                loginEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return doctorRepository
                .findByUserId(
                        user.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor profile not found"
                        ));
    }


    // =====================================================
    // GET LOGGED-IN PATIENT
    // =====================================================

    private Patient getLoggedInPatient(
            Authentication authentication) {

        if (authentication == null) {

            throw new RuntimeException(
                    "Authentication required"
            );
        }


        String loginEmail =
                authentication.getName();


        if (loginEmail == null ||
                loginEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Login email not found"
            );
        }


        User user =
                userRepository
                        .findByLoginEmail(
                                loginEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return patientRepository
                .findByUserId(
                        user.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient profile not found"
                        ));
    }
}