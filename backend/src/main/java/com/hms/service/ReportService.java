package com.hms.service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hms.dto.DailyReportResponse;
import com.hms.entity.Appointment;
import com.hms.entity.Bill;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.BillRepository;

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
public class ReportService {

    private final AppointmentRepository appointmentRepository;

    private final BillRepository billRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ReportService(
            AppointmentRepository appointmentRepository,
            BillRepository billRepository) {

        this.appointmentRepository =
                appointmentRepository;

        this.billRepository =
                billRepository;
    }


    // =====================================================
    // GENERATE DAILY REPORT DATA
    // =====================================================

    public DailyReportResponse generateDailyReport(
            LocalDate date) {

        // =================================================
        // 1. GET APPOINTMENTS FOR SELECTED DATE
        // =================================================

        List<Appointment> appointments =
                appointmentRepository
                        .findByAppointmentDateOrderByAppointmentTimeAsc(
                                date
                        );


        // =================================================
        // 2. COUNT UNIQUE PATIENTS
        // =================================================

        long totalPatients =
                appointments.stream()
                        .filter(appointment ->
                                appointment.getPatient() != null
                        )
                        .map(appointment ->
                                appointment.getPatient().getId()
                        )
                        .distinct()
                        .count();


        // =================================================
        // 3. COUNT UNIQUE DOCTORS
        // =================================================

        long totalDoctors =
                appointments.stream()
                        .filter(appointment ->
                                appointment.getDoctor() != null
                        )
                        .map(appointment ->
                                appointment.getDoctor().getId()
                        )
                        .distinct()
                        .count();


        // =================================================
        // 4. TOTAL APPOINTMENTS
        // =================================================

        long totalAppointments =
                appointments.size();


        // =================================================
        // 5. GET BILLS FOR SELECTED DATE
        // =================================================

        List<Bill> bills =
                billRepository.findByBillDate(date);


        // =================================================
        // 6. TOTAL BILLS
        // =================================================

        long totalBills =
                bills.size();


        // =================================================
        // 7. CALCULATE TOTAL REVENUE
        // =================================================

        double totalRevenue =
                bills.stream()
                        .mapToDouble(Bill::getTotalAmount)
                        .sum();


        // =================================================
        // 8. CREATE RESPONSE
        // =================================================

        DailyReportResponse response =
                new DailyReportResponse();


        response.setReportDate(date);

        response.setTotalDoctors(
                totalDoctors
        );

        response.setTotalPatients(
                totalPatients
        );

        response.setTotalAppointments(
                totalAppointments
        );

        response.setTotalBills(
                totalBills
        );

        response.setTotalRevenue(
                totalRevenue
        );


        // =================================================
        // 9. RETURN REPORT
        // =================================================

        return response;
    }


    // =====================================================
    // GENERATE DAILY REPORT PDF
    // =====================================================

    public byte[] generateDailyReportPdf(
            LocalDate date) {

        try {

            // =================================================
            // GET REPORT DATA
            // =================================================

            DailyReportResponse report =
                    generateDailyReport(date);


            // =================================================
            // PDF OUTPUT STREAM
            // =================================================

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();


            // =================================================
            // DOCUMENT
            // =================================================

            Document document =
                    new Document(
                            PageSize.A4,
                            40,
                            40,
                            40,
                            40
                    );


            // =================================================
            // PDF WRITER
            // =================================================

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
            // HOSPITAL NAME
            // =================================================

            Paragraph hospitalName =
                    new Paragraph(
                            "HOSPITAL MANAGEMENT SYSTEM",
                            hospitalFont
                    );


            hospitalName.setAlignment(
                    Element.ALIGN_CENTER
            );


            document.add(
                    hospitalName
            );


            // =================================================
            // SUBTITLE
            // =================================================

            Paragraph subtitle =
                    new Paragraph(
                            "Secure Healthcare Management",
                            smallFont
                    );


            subtitle.setAlignment(
                    Element.ALIGN_CENTER
            );


            document.add(
                    subtitle
            );


            document.add(
                    new Paragraph(" ")
            );


            // =================================================
            // REPORT TITLE
            // =================================================

            Paragraph reportTitle =
                    new Paragraph(
                            "DAILY HOSPITAL REPORT",
                            titleFont
                    );


            reportTitle.setAlignment(
                    Element.ALIGN_CENTER
            );


            document.add(
                    reportTitle
            );


            document.add(
                    new Paragraph(" ")
            );


            // =================================================
            // REPORT DATE
            // =================================================
            // REPORT DATE IS DISPLAYED ONLY HERE
            // =================================================

            Paragraph reportDate =
                    new Paragraph(
                            "Report Date: "
                                    + report.getReportDate(),
                            headingFont
                    );


            reportDate.setAlignment(
                    Element.ALIGN_CENTER
            );


            document.add(
                    reportDate
            );


            document.add(
                    new Paragraph(" ")
            );


            // =================================================
            // HOSPITAL ACTIVITY SUMMARY
            // =================================================

            Paragraph summaryTitle =
                    new Paragraph(
                            "HOSPITAL ACTIVITY SUMMARY",
                            headingFont
                    );


            summaryTitle.setSpacingAfter(
                    8
            );


            document.add(
                    summaryTitle
            );


            // =================================================
            // REPORT TABLE
            // =================================================

            PdfPTable reportTable =
                    new PdfPTable(2);


            reportTable.setWidthPercentage(
                    100
            );


            reportTable.setWidths(
                    new float[]{
                            3f,
                            2f
                    }
            );


            // =================================================
            // TABLE HEADER
            // =================================================

            PdfPCell descriptionHeader =
                    new PdfPCell(
                            new Phrase(
                                    "Description",
                                    boldFont
                            )
                    );


            descriptionHeader.setPadding(
                    8
            );


            PdfPCell valueHeader =
                    new PdfPCell(
                            new Phrase(
                                    "Value",
                                    boldFont
                            )
                    );


            valueHeader.setPadding(
                    8
            );


            valueHeader.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );


            reportTable.addCell(
                    descriptionHeader
            );


            reportTable.addCell(
                    valueHeader
            );


            // =================================================
            // TOTAL DOCTORS
            // =================================================

            addReportRow(
                    reportTable,
                    "Total Doctors",
                    String.valueOf(
                            report.getTotalDoctors()
                    ),
                    normalFont
            );


            // =================================================
            // TOTAL PATIENTS
            // =================================================

            addReportRow(
                    reportTable,
                    "Total Patients",
                    String.valueOf(
                            report.getTotalPatients()
                    ),
                    normalFont
            );


            // =================================================
            // TOTAL APPOINTMENTS
            // =================================================

            addReportRow(
                    reportTable,
                    "Total Appointments",
                    String.valueOf(
                            report.getTotalAppointments()
                    ),
                    normalFont
            );


            // =================================================
            // TOTAL BILLS
            // =================================================

            addReportRow(
                    reportTable,
                    "Total Bills",
                    String.valueOf(
                            report.getTotalBills()
                    ),
                    normalFont
            );


            // =================================================
            // TOTAL REVENUE
            // =================================================

            addReportRow(
                    reportTable,
                    "Total Revenue",
                    "₹ "
                            + String.format(
                                    "%.2f",
                                    report.getTotalRevenue()
                            ),
                    boldFont
            );


            // =================================================
            // ADD REPORT TABLE
            // =================================================

            document.add(
                    reportTable
            );


            document.add(
                    new Paragraph(" ")
            );


            // =================================================
            // REPORT INFORMATION
            // =================================================

            Paragraph informationTitle =
                    new Paragraph(
                            "REPORT INFORMATION",
                            headingFont
                    );


            informationTitle.setSpacingAfter(
                    8
            );


            document.add(
                    informationTitle
            );


            Paragraph information =
                    new Paragraph(
                            "This daily report contains hospital "
                                    + "activity recorded for the selected "
                                    + "date, including doctors, patients, "
                                    + "appointments, bills and total revenue.",
                            normalFont
                    );


            information.setLeading(
                    16
            );


            document.add(
                    information
            );


            document.add(
                    new Paragraph(" ")
            );


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


            footer.setSpacingBefore(
                    20
            );


            document.add(
                    footer
            );


            // =================================================
            // THANK YOU
            // =================================================

            Paragraph thankYou =
                    new Paragraph(
                            "Thank you.",
                            smallFont
                    );


            thankYou.setAlignment(
                    Element.ALIGN_CENTER
            );


            document.add(
                    thankYou
            );


            // =================================================
            // CLOSE DOCUMENT
            // =================================================

            document.close();


            // =================================================
            // RETURN PDF BYTES
            // =================================================

            return outputStream.toByteArray();


        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to generate daily report PDF.",
                    e
            );
        }
    }


    // =====================================================
    // ADD REPORT TABLE ROW
    // =====================================================

    private void addReportRow(
            PdfPTable table,
            String label,
            String value,
            Font font) {


        // =================================================
        // LABEL
        // =================================================

        PdfPCell labelCell =
                new PdfPCell(
                        new Phrase(
                                label,
                                font
                        )
                );


        labelCell.setPadding(
                8
        );


        // =================================================
        // VALUE
        // =================================================

        PdfPCell valueCell =
                new PdfPCell(
                        new Phrase(
                                value,
                                font
                        )
                );


        valueCell.setPadding(
                8
        );


        valueCell.setHorizontalAlignment(
                Element.ALIGN_RIGHT
        );


        // =================================================
        // ADD CELLS
        // =================================================

        table.addCell(
                labelCell
        );


        table.addCell(
                valueCell
        );
    }
}