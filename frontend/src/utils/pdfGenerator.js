import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const downloadInvoicePDF = (payment) => {
  const doc = new jsPDF();
  
  // Header
  // Set blue theme color
  doc.setTextColor(21, 101, 192); // similar to a primary brand color
  doc.setFontSize(22);
  doc.text("Rent Invoice", 14, 22);

  // Divider
  doc.setDrawColor(21, 101, 192);
  doc.line(14, 26, 196, 26);

  // Reset text color to black/grey for metadata
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  
  // Metadata Section
  const invoiceNo = payment.invoice_no || `INV-${Math.floor(Math.random()*1000)}`;
  const dateStr = new Date().toLocaleDateString('en-GB');
  doc.text(`Invoice No: ${invoiceNo}`, 14, 35);
  doc.text(`Issue Date: ${dateStr}`, 14, 42);
  
  doc.text(`Tenant: ${payment.TenantName || 'Current Resident'}`, 120, 35);
  doc.text(`Property: House ${payment.houseCode || 'N/A'}`, 120, 42);

  const dueDateStr = payment.due_date ? new Date(payment.due_date).toLocaleDateString('en-GB') : '-';
  const amountStr = `Rs. ${parseFloat(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  // Payment Table
  doc.autoTable({
    startY: 55,
    theme: 'striped',
    headStyles: { fillColor: [21, 101, 192] },
    head: [['Description', 'Due Date', 'Status', 'Amount']],
    body: [
      [`Monthly Rent for House ${payment.houseCode || 'Unit'}`, dueDateStr, payment.status || 'Pending', amountStr],
    ],
  });

  // Footer & Late Payment Clause
  const finalY = doc.lastAutoTable.finalY + 25;
  
  // Warning Box
  doc.setFillColor(255, 245, 245);
  doc.setDrawColor(224, 49, 49);
  doc.roundedRect(14, finalY - 5, 182, 25, 3, 3, "FD");

  doc.setTextColor(224, 49, 49);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text("Late Payment Details & Penalties", 18, finalY + 1);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("A 5% late fee will be dynamically applied for payments received after the stipulated due date.", 18, finalY + 8);
  doc.text("Please settle the outstanding balance promptly via the official portal to avoid account penalties.", 18, finalY + 14);

  // End Notes
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text("This is a system-generated document. No signature is required.", 105, 280, { align: 'center' });

  // Save PDF natively
  doc.save(`${invoiceNo}.pdf`);
};
