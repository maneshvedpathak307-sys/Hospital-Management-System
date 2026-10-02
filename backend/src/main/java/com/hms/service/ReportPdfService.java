package com.hms.service;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;

import org.springframework.stereotype.Service;

import com.hms.dto.DailyReportResponse;
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
public class ReportPdfService {

    private final DecimalFormat decimalFormat =
            new DecimalFormat("0.00");


    // =====================================================
    // GENERATE DAILY REPORT PDF
    // =====================================================

    public byte[] generateDailyReportPdf(
            DailyReportResponse report) {

        try {

            // -------------------------------------------------
            // PDF OUTPUT STREAM
            // -------------------------------------------------

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();


            // -------------------------------------------------
            // DOCUMENT
            // -------------------------------------------------

            Document document =
                    new Document(
                            PageSize.A4,
                            40,
                            40,
                            40,
                            40
                    );


            // -------------------------------------------------
            // PDF WRITER
            // -------------------------------------------------

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


            Font sectionFont =
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

            PdfPTable dateTable =
                    new PdfPTable(2);

            dateTable.setWidthPercentage(100);


            addInfoRow(
                    dateTable,
                    "Report Date",
                    report.getReportDate() != null
                            ? report.getReportDate().toString()
                            : "-",
                    boldFont,
                    normalFont
            );


            document.add(
                    dateTable
            );


            document.add(
                    new Paragraph(" ")
            );


            // =================================================
            // HOSPITAL STATISTICS
            // =================================================

            Paragraph statisticsTitle =
                    new Paragraph(
                            "HOSPITAL STATISTICS",
                            sectionFont
                    );

            statisticsTitle.setSpacingAfter(8);

            document.add(
                    statisticsTitle
            );


            PdfPTable statisticsTable =
                    new PdfPTable(2);

            statisticsTable.setWidthPercentage(100);


            statisticsTable.setWidths(
                    new float[]{
                            3f,
                            1.5f
                    }
            );


            // -------------------------------------------------
            // TABLE HEADER
            // -------------------------------------------------

            PdfPCell descriptionHeader =
                    new PdfPCell(
                            new Phrase(
                                    "Description",
                                    boldFont
                            )
                    );

            descriptionHeader.setPadding(8);


            PdfPCell valueHeader =
                    new PdfPCell(
                            new Phrase(
                                    "Value",
                                    boldFont
                            )
                    );

            valueHeader.setPadding(8);

            valueHeader.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );


            statisticsTable.addCell(
                    descriptionHeader
            );

            statisticsTable.addCell(
                    valueHeader
            );


            // -------------------------------------------------
            // DOCTORS
            // -------------------------------------------------

            addReportRow(
                    statisticsTable,
                    "Doctors with appointments",
                    String.valueOf(
                            report.getTotalDoctors()
                    ),
                    normalFont
            );


            // -------------------------------------------------
            // PATIENTS
            // -------------------------------------------------

            addReportRow(
                    statisticsTable,
                    "Patients with appointments",
                    String.valueOf(
                            report.getTotalPatients()
                    ),
                    normalFont
            );


            // -------------------------------------------------
            // APPOINTMENTS
            // -------------------------------------------------

            addReportRow(
                    statisticsTable,
                    "Total appointments",
                    String.valueOf(
                            report.getTotalAppointments()
                    ),
                    normalFont
            );


            // -------------------------------------------------
            // BILLS
            // -------------------------------------------------

            addReportRow(
                    statisticsTable,
                    "Bills generated",
                    String.valueOf(
                            report.getTotalBills()
                    ),
                    normalFont
            );


            // -------------------------------------------------
            // REVENUE
            // -------------------------------------------------

            addReportRow(
                    statisticsTable,
                    "Total revenue",
                    "₹ " +
                    decimalFormat.format(
                            report.getTotalRevenue()
                    ),
                    normalFont
            );


            document.add(
                    statisticsTable
            );


            document.add(
                    new Paragraph(" ")
            );


            // =================================================
            // SUMMARY
            // =================================================

            Paragraph summaryTitle =
                    new Paragraph(
                            "REPORT SUMMARY",
                            sectionFont
                    );

            summaryTitle.setSpacingAfter(8);

            document.add(
                    summaryTitle
            );


            PdfPTable summaryTable =
                    new PdfPTable(2);

            summaryTable.setWidthPercentage(100);


            addInfoRow(
                    summaryTable,
                    "Report Date",
                    report.getReportDate() != null
                            ? report.getReportDate().toString()
                            : "-",
                    boldFont,
                    normalFont
            );


            addInfoRow(
                    summaryTable,
                    "Total Doctors",
                    String.valueOf(
                            report.getTotalDoctors()
                    ),
                    boldFont,
                    normalFont
            );


            addInfoRow(
                    summaryTable,
                    "Total Patients",
                    String.valueOf(
                            report.getTotalPatients()
                    ),
                    boldFont,
                    normalFont
            );


            addInfoRow(
                    summaryTable,
                    "Total Appointments",
                    String.valueOf(
                            report.getTotalAppointments()
                    ),
                    boldFont,
                    normalFont
            );


            addInfoRow(
                    summaryTable,
                    "Total Bills",
                    String.valueOf(
                            report.getTotalBills()
                    ),
                    boldFont,
                    normalFont
            );


            addInfoRow(
                    summaryTable,
                    "Total Revenue",
                    "₹ " +
                    decimalFormat.format(
                            report.getTotalRevenue()
                    ),
                    boldFont,
                    normalFont
            );


            document.add(
                    summaryTable
            );


            document.add(
                    new Paragraph(" ")
            );


            // =================================================
            // INFORMATION
            // =================================================

            Paragraph information =
                    new Paragraph(
                            "This report contains the hospital " +
                            "activity recorded for the selected " +
                            "date, including doctors, patients, " +
                            "appointments, bills and revenue.",
                            smallFont
                    );

            information.setSpacingBefore(15);

            information.setSpacingAfter(20);

            document.add(
                    information
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

            document.add(
                    footer
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
    // ADD INFORMATION ROW
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


        table.addCell(
                labelCell
        );

        table.addCell(
                valueCell
        );
    }


    // =====================================================
    // ADD REPORT TABLE ROW
    // =====================================================

    private void addReportRow(
            PdfPTable table,
            String description,
            String value,
            Font font) {


        PdfPCell descriptionCell =
                new PdfPCell(
                        new Phrase(
                                description,
                                font
                        )
                );

        descriptionCell.setPadding(8);


        PdfPCell valueCell =
                new PdfPCell(
                        new Phrase(
                                value != null
                                        ? value
                                        : "-",
                                font
                        )
                );

        valueCell.setPadding(8);

        valueCell.setHorizontalAlignment(
                Element.ALIGN_RIGHT
        );


        table.addCell(
                descriptionCell
        );

        table.addCell(
                valueCell
        );
    }
}