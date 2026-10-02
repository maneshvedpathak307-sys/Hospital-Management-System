package com.hms.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.hms.entity.Prescription;
import com.hms.entity.PrescriptionMedicine;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PrescriptionPdfService {

    // =====================================================
    // GENERATE PRESCRIPTION PDF
    // =====================================================

    public byte[] generatePrescriptionPdf(
            Prescription prescription) {

        try {

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            Document document =
                    new Document(
                            PageSize.A4,
                            40,
                            40,
                            40,
                            40
                    );

            PdfWriter.getInstance(
                    document,
                    outputStream
            );

            document.open();

            // =================================================
            // FONTS
            // =================================================

            Font hospitalFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            20,
                            Font.BOLD
                    );

            Font titleFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            16,
                            Font.BOLD
                    );

            Font headingFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            12,
                            Font.BOLD
                    );

            Font normalFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA,
                            10,
                            Font.NORMAL
                    );

            Font boldFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            10,
                            Font.BOLD
                    );

            Font smallFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA,
                            9,
                            Font.NORMAL
                    );

            // =================================================
            // HOSPITAL HEADER
            // =================================================

            Paragraph hospitalName =
                    new Paragraph(
                            "HOSPITAL MANAGEMENT SYSTEM",
                            hospitalFont
                    );

            hospitalName.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(hospitalName);

            Paragraph subtitle =
                    new Paragraph(
                            "Secure Healthcare Management",
                            smallFont
                    );

            subtitle.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(subtitle);

            document.add(
                    new Paragraph(" ")
            );

            // =================================================
            // TITLE
            // =================================================

            Paragraph title =
                    new Paragraph(
                            "MEDICAL PRESCRIPTION",
                            titleFont
                    );

            title.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(title);

            document.add(
                    new Paragraph(" ")
            );

            // =================================================
            // PRESCRIPTION INFORMATION
            //
            // IMPORTANT:
            // Prescription ID REMOVED
            // Patient ID REMOVED
            // =================================================

            PdfPTable informationTable =
                    new PdfPTable(2);

            informationTable.setWidthPercentage(100);

            // -------------------------------------------------
            // PRESCRIPTION DATE
            // -------------------------------------------------

            addInfoRow(
                    informationTable,
                    "Prescription Date",
                    prescription.getPrescriptionDate()
                            != null
                            ? prescription
                                .getPrescriptionDate()
                                .format(
                                    DateTimeFormatter.ofPattern(
                                            "dd-MM-yyyy"
                                    )
                                )
                            : "-",
                    boldFont,
                    normalFont
            );

            // -------------------------------------------------
            // PATIENT NAME
            // -------------------------------------------------

            addInfoRow(
                    informationTable,
                    "Patient",
                    prescription.getPatient()
                            != null
                            ? prescription
                                .getPatient()
                                .getPatientName()
                            : "-",
                    boldFont,
                    normalFont
            );

            // -------------------------------------------------
            // DOCTOR
            // -------------------------------------------------

            addInfoRow(
                    informationTable,
                    "Doctor",
                    prescription.getDoctor()
                            != null
                            ? prescription
                                .getDoctor()
                                .getDoctorName()
                            : "-",
                    boldFont,
                    normalFont
            );

            // -------------------------------------------------
            // DEPARTMENT
            // -------------------------------------------------

            if (prescription.getDoctor() != null
                    && prescription.getDoctor()
                            .getDepartment() != null) {

                addInfoRow(
                        informationTable,
                        "Department",
                        prescription
                                .getDoctor()
                                .getDepartment()
                                .getDepartmentName(),
                        boldFont,
                        normalFont
                );
            }

            document.add(
                    informationTable
            );

            document.add(
                    new Paragraph(" ")
            );

            // =================================================
            // DIAGNOSIS
            // =================================================

            Paragraph diagnosisTitle =
                    new Paragraph(
                            "DIAGNOSIS",
                            headingFont
                    );

            diagnosisTitle.setSpacingAfter(6);

            document.add(
                    diagnosisTitle
            );

            Paragraph diagnosis =
                    new Paragraph(
                            prescription.getDiagnosis()
                                    != null
                                    ? prescription
                                        .getDiagnosis()
                                    : "-",
                            normalFont
                    );

            diagnosis.setLeading(15);

            document.add(diagnosis);

            document.add(
                    new Paragraph(" ")
            );

            // =================================================
            // MEDICINES
            // =================================================

            Paragraph medicineTitle =
                    new Paragraph(
                            "MEDICINES",
                            headingFont
                    );

            medicineTitle.setSpacingAfter(8);

            document.add(
                    medicineTitle
            );

            PdfPTable medicineTable =
                    new PdfPTable(5);

            medicineTable.setWidthPercentage(100);

            medicineTable.setWidths(
                    new float[]{
                            2.5f,
                            1.5f,
                            1.5f,
                            1.5f,
                            2.5f
                    }
            );

            // -------------------------------------------------
            // TABLE HEADERS
            // -------------------------------------------------

            addHeader(
                    medicineTable,
                    "Medicine",
                    boldFont
            );

            addHeader(
                    medicineTable,
                    "Dosage",
                    boldFont
            );

            addHeader(
                    medicineTable,
                    "Frequency",
                    boldFont
            );

            addHeader(
                    medicineTable,
                    "Duration",
                    boldFont
            );

            addHeader(
                    medicineTable,
                    "Instructions",
                    boldFont
            );

            // -------------------------------------------------
            // MEDICINE DATA
            // -------------------------------------------------

            if (prescription.getPrescriptionMedicines()
                    != null) {

                for (
                        PrescriptionMedicine pm
                        : prescription
                            .getPrescriptionMedicines()
                ) {

                    addMedicineCell(
                            medicineTable,
                            pm.getMedicine() != null
                                    ? pm.getMedicine()
                                        .getMedicineName()
                                    : "-",
                            normalFont
                    );

                    addMedicineCell(
                            medicineTable,
                            pm.getDosage(),
                            normalFont
                    );

                    addMedicineCell(
                            medicineTable,
                            pm.getFrequency(),
                            normalFont
                    );

                    addMedicineCell(
                            medicineTable,
                            pm.getDuration(),
                            normalFont
                    );

                    addMedicineCell(
                            medicineTable,
                            pm.getInstructions(),
                            normalFont
                    );
                }
            }

            document.add(
                    medicineTable
            );

            document.add(
                    new Paragraph(" ")
            );

            // =================================================
            // GENERAL INSTRUCTIONS
            // =================================================

            if (prescription.getInstructions() != null
                    && !prescription.getInstructions()
                            .trim()
                            .isEmpty()) {

                Paragraph instructionsTitle =
                        new Paragraph(
                                "GENERAL INSTRUCTIONS",
                                headingFont
                        );

                instructionsTitle.setSpacingAfter(6);

                document.add(
                        instructionsTitle
                );

                Paragraph instructions =
                        new Paragraph(
                                prescription
                                    .getInstructions(),
                                normalFont
                        );

                instructions.setLeading(15);

                document.add(
                        instructions
                );

                document.add(
                        new Paragraph(" ")
                );
            }

            // =================================================
            // FOOTER
            // =================================================

            Paragraph footer =
                    new Paragraph(
                            "Generated by Hospital Management System",
                            smallFont
                    );

            footer.setAlignment(
                    Element.ALIGN_CENTER
            );

            footer.setSpacingBefore(20);

            document.add(footer);

            Paragraph thankYou =
                    new Paragraph(
                            "Please keep this prescription for your records.",
                            smallFont
                    );

            thankYou.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(thankYou);

            // =================================================
            // CLOSE DOCUMENT
            // =================================================

            document.close();

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to generate prescription PDF.",
                    e
            );
        }
    }

    // =====================================================
    // INFORMATION ROW
    // =====================================================

    private void addInfoRow(
            PdfPTable table,
            String label,
            String value,
            Font labelFont,
            Font valueFont) {

        PdfPCell labelCell =
                new PdfPCell(
                        new Phrase(
                                label,
                                labelFont
                        )
                );

        labelCell.setPadding(7);

        labelCell.setBorder(
                PdfPCell.NO_BORDER
        );

        PdfPCell valueCell =
                new PdfPCell(
                        new Phrase(
                                value != null
                                        ? value
                                        : "-",
                                valueFont
                        )
                );

        valueCell.setPadding(7);

        valueCell.setBorder(
                PdfPCell.NO_BORDER
        );

        table.addCell(labelCell);

        table.addCell(valueCell);
    }

    // =====================================================
    // TABLE HEADER
    // =====================================================

    private void addHeader(
            PdfPTable table,
            String value,
            Font font) {

        PdfPCell cell =
                new PdfPCell(
                        new Phrase(
                                value,
                                font
                        )
                );

        cell.setPadding(7);

        cell.setHorizontalAlignment(
                Element.ALIGN_CENTER
        );

        table.addCell(cell);
    }

    // =====================================================
    // MEDICINE CELL
    // =====================================================

    private void addMedicineCell(
            PdfPTable table,
            String value,
            Font font) {

        PdfPCell cell =
                new PdfPCell(
                        new Phrase(
                                value != null
                                        ? value
                                        : "-",
                                font
                        )
                );

        cell.setPadding(7);

        table.addCell(cell);
    }
}