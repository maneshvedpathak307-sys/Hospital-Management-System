package com.hms.service;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;

import org.springframework.stereotype.Service;

import com.hms.entity.Bill;

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
public class InvoiceService {


    /* =========================================
       DECIMAL FORMAT
    ========================================= */

    private final DecimalFormat decimalFormat =
            new DecimalFormat("0.00");


    /* =========================================
       GENERATE INVOICE PDF
    ========================================= */

    public byte[] generateInvoice(Bill bill) {

        try {

            /*
             * Store PDF in memory.
             * Nothing is saved permanently
             * on the server.
             */

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();


            /* =================================
               DOCUMENT
            ================================= */

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


            /* =================================
               FONTS
            ================================= */

            Font hospitalFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            20,
                            Font.BOLD
                    );


            Font invoiceFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            16,
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


            /* =================================
               HOSPITAL NAME
            ================================= */

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


            /* =================================
               HOSPITAL SUBTITLE
            ================================= */

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


            /* =================================
               INVOICE TITLE
            ================================= */

            Paragraph invoiceTitle =
                    new Paragraph(
                            "PATIENT BILL INVOICE",
                            invoiceFont
                    );

            invoiceTitle.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(
                    invoiceTitle
            );


            document.add(
                    new Paragraph(" ")
            );


            /* =================================
               INVOICE INFORMATION
            ================================= */

            PdfPTable invoiceInfo =
                    new PdfPTable(2);

            invoiceInfo.setWidthPercentage(100);


            /* =================================
               INVOICE NUMBER
            ================================= */

            addInfoRow(
                    invoiceInfo,
                    "Invoice Number",
                    "INV-" + bill.getId(),
                    boldFont,
                    normalFont
            );


            /* =================================
               BILL DATE
            ================================= */

            addInfoRow(
                    invoiceInfo,
                    "Bill Date",
                    bill.getBillDate() != null
                            ? bill.getBillDate().toString()
                            : "-",
                    boldFont,
                    normalFont
            );


            document.add(
                    invoiceInfo
            );


            document.add(
                    new Paragraph(" ")
            );


            /* =================================
               PATIENT INFORMATION
            ================================= */

            Paragraph patientTitle =
                    new Paragraph(
                            "PATIENT INFORMATION",
                            boldFont
                    );

            patientTitle.setSpacingAfter(6);

            document.add(
                    patientTitle
            );


            PdfPTable patientTable =
                    new PdfPTable(2);

            patientTable.setWidthPercentage(100);


            /* =================================
               PATIENT NAME
            ================================= */

            String patientName =
                    bill.getPatient() != null
                            ? bill.getPatient().getPatientName()
                            : "-";


            /* =================================
               PATIENT PHONE
            ================================= */

            String patientPhone =
                    bill.getPatient() != null
                            ? bill.getPatient().getPhone()
                            : "-";


            /* =================================
               PATIENT EMAIL
            ================================= */

            String patientEmail =
                    bill.getPatient() != null
                            ? bill.getPatient().getEmail()
                            : "-";


            /* =================================
               DOCTOR NAME
            ================================= */

            String doctorName =
                    bill.getDoctor() != null
                            ? bill.getDoctor().getDoctorName()
                            : "-";


            /* =================================
               PATIENT NAME
            ================================= */

            addInfoRow(
                    patientTable,
                    "Patient Name",
                    patientName,
                    boldFont,
                    normalFont
            );


            /* =================================
               PATIENT PHONE
            ================================= */

            addInfoRow(
                    patientTable,
                    "Patient Phone",
                    patientPhone,
                    boldFont,
                    normalFont
            );


            /* =================================
               PATIENT EMAIL
            ================================= */

            addInfoRow(
                    patientTable,
                    "Patient Email",
                    patientEmail,
                    boldFont,
                    normalFont
            );


            /* =================================
               DOCTOR
            ================================= */

            addInfoRow(
                    patientTable,
                    "Doctor",
                    doctorName,
                    boldFont,
                    normalFont
            );


            /* =================================
            TREATMENT
         ================================= */

         addInfoRow(
                 patientTable,
                 "Treatment",
                 safeValue(
                         bill.getTreatment()
                 ),
                 boldFont,
                 normalFont
         );


         /* =================================
            PAYMENT METHOD
         ================================= */

         String paymentMethod =
                 bill.getPaymentMethod();

         if (paymentMethod == null ||
                 paymentMethod.trim().isEmpty()) {

             paymentMethod = "-";

         } else {

             paymentMethod =
                     paymentMethod
                             .trim()
                             .toUpperCase();
         }


         /* =================================
            PAYMENT METHOD ROW
         ================================= */

         addInfoRow(
                 patientTable,
                 "Payment Method",
                 paymentMethod,
                 boldFont,
                 normalFont
         );


         /* =================================
            ADD PATIENT TABLE
         ================================= */

         document.add(
                 patientTable
         );


         document.add(
                 new Paragraph(" ")
         );

            /* =================================
               BILL DETAILS
            ================================= */

            Paragraph billDetailsTitle =
                    new Paragraph(
                            "BILL DETAILS",
                            boldFont
                    );

            billDetailsTitle.setSpacingAfter(6);

            document.add(
                    billDetailsTitle
            );


            PdfPTable billTable =
                    new PdfPTable(2);

            billTable.setWidthPercentage(100);


            billTable.setWidths(
                    new float[]{
                            3f,
                            1.5f
                    }
            );


            /* =================================
               TABLE HEADER
            ================================= */

            PdfPCell descriptionHeader =
                    new PdfPCell(
                            new Phrase(
                                    "Description",
                                    boldFont
                            )
                    );

            descriptionHeader.setPadding(8);

            descriptionHeader.setHorizontalAlignment(
                    Element.ALIGN_LEFT
            );


            PdfPCell amountHeader =
                    new PdfPCell(
                            new Phrase(
                                    "Amount",
                                    boldFont
                            )
                    );

            amountHeader.setPadding(8);

            amountHeader.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );


            billTable.addCell(
                    descriptionHeader
            );


            billTable.addCell(
                    amountHeader
            );


            /* =================================
               CONSULTATION FEE
            ================================= */

            addAmountRow(
                    billTable,
                    "Consultation Fee",
                    bill.getConsultationFee(),
                    normalFont
            );


            /* =================================
               MEDICINE CHARGE
            ================================= */

            addAmountRow(
                    billTable,
                    "Medicine Charge",
                    bill.getMedicineCharge(),
                    normalFont
            );


            /* =================================
               TEST CHARGE
            ================================= */

            addAmountRow(
                    billTable,
                    "Test Charge",
                    bill.getTestCharge(),
                    normalFont
            );


            /* =================================
               TOTAL AMOUNT
            ================================= */

            PdfPCell totalLabel =
                    new PdfPCell(
                            new Phrase(
                                    "TOTAL AMOUNT",
                                    boldFont
                            )
                    );

            totalLabel.setPadding(8);


            PdfPCell totalValue =
                    new PdfPCell(
                            new Phrase(
                                    "₹ " +
                                    decimalFormat.format(
                                            bill.getTotalAmount()
                                    ),
                                    boldFont
                            )
                    );

            totalValue.setPadding(8);

            totalValue.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );


            billTable.addCell(
                    totalLabel
            );


            billTable.addCell(
                    totalValue
            );


            document.add(
                    billTable
            );


            document.add(
                    new Paragraph(" ")
            );


            /* =================================
               SIGNATURE / SEAL AREA
            ================================= */

            PdfPTable signatureTable =
                    new PdfPTable(2);

            signatureTable.setWidthPercentage(100);

            signatureTable.setSpacingBefore(25);


            /* =================================
               AUTHORIZED SIGNATURE
            ================================= */

            PdfPCell signatureCell =
                    new PdfPCell();

            signatureCell.setBorder(
                    PdfPCell.NO_BORDER
            );


            Paragraph signatureText =
                    new Paragraph(
                            "\n\n____________________________\n" +
                            "Authorized Signature",
                            normalFont
                    );

            signatureText.setAlignment(
                    Element.ALIGN_CENTER
            );


            signatureCell.addElement(
                    signatureText
            );


            /* =================================
               HOSPITAL SEAL
            ================================= */

            PdfPCell sealCell =
                    new PdfPCell();

            sealCell.setBorder(
                    PdfPCell.NO_BORDER
            );


            Paragraph sealText =
                    new Paragraph(
                            "\n\n____________________________\n" +
                            "Hospital Seal",
                            normalFont
                    );

            sealText.setAlignment(
                    Element.ALIGN_CENTER
            );


            sealCell.addElement(
                    sealText
            );


            signatureTable.addCell(
                    signatureCell
            );


            signatureTable.addCell(
                    sealCell
            );


            document.add(
                    signatureTable
            );


            document.add(
                    new Paragraph(" ")
            );


            /* =================================
               FOOTER
            ================================= */

            Paragraph footer =
                    new Paragraph(
                            "Thank you for choosing our Hospital.",
                            boldFont
                    );

            footer.setAlignment(
                    Element.ALIGN_CENTER
            );


            document.add(
                    footer
            );


            /* =================================
               GET WELL SOON
            ================================= */

            Paragraph getWell =
                    new Paragraph(
                            "Get Well Soon!",
                            smallFont
                    );

            getWell.setAlignment(
                    Element.ALIGN_CENTER
            );


            document.add(
                    getWell
            );


            /* =================================
               CLOSE DOCUMENT
            ================================= */

            document.close();


            return outputStream.toByteArray();


        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to generate invoice PDF.",
                    e
            );

        }

    }


    /* =========================================
       ADD INFORMATION ROW
    ========================================= */

    private void addInfoRow(
            PdfPTable table,
            String label,
            String value,
            Font labelFont,
            Font valueFont) {


        /* =================================
           LABEL CELL
        ================================= */

        PdfPCell labelCell =
                new PdfPCell(
                        new Phrase(
                                label,
                                labelFont
                        )
                );

        labelCell.setPadding(6);

        labelCell.setBorder(
                PdfPCell.NO_BORDER
        );


        /* =================================
           VALUE CELL
        ================================= */

        PdfPCell valueCell =
                new PdfPCell(
                        new Phrase(
                                safeValue(value),
                                valueFont
                        )
                );

        valueCell.setPadding(6);

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


    /* =========================================
       ADD AMOUNT ROW
    ========================================= */

    private void addAmountRow(
            PdfPTable table,
            String description,
            double amount,
            Font font) {


        /* =================================
           DESCRIPTION
        ================================= */

        PdfPCell descriptionCell =
                new PdfPCell(
                        new Phrase(
                                description,
                                font
                        )
                );

        descriptionCell.setPadding(8);


        /* =================================
           AMOUNT
        ================================= */

        PdfPCell amountCell =
                new PdfPCell(
                        new Phrase(
                                "₹ " +
                                decimalFormat.format(
                                        amount
                                ),
                                font
                        )
                );

        amountCell.setPadding(8);

        amountCell.setHorizontalAlignment(
                Element.ALIGN_RIGHT
        );


        table.addCell(
                descriptionCell
        );


        table.addCell(
                amountCell
        );

    }


    /* =========================================
       SAFE STRING
    ========================================= */

    private String safeValue(
            String value) {

        if (
                value == null ||
                value.trim().isEmpty()
        ) {

            return "-";

        }


        return value;

    }

}