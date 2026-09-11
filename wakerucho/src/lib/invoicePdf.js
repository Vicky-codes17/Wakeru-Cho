import { jsPDF } from 'jspdf'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function drawLine(doc, x1, y1, x2, y2, color = [233, 228, 223]) {
  doc.setDrawColor(...color)
  doc.line(x1, y1, x2, y2)
}

export function downloadInvoicePdf(invoice) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  const accent = [121, 224, 177]
  const dark = [17, 17, 17]
  const muted = [106, 100, 96]

  doc.setFillColor(245, 243, 241)
  doc.rect(0, 0, pageWidth, 46, 'F')

  doc.setFillColor(...accent)
  doc.roundedRect(margin, 14, 18, 18, 6, 6, 'F')
  doc.setTextColor(...dark)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('W', margin + 6.2, 26)

  doc.setFontSize(20)
  doc.text('WakeruCho', margin + 24, 22)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...muted)
  doc.text('Freelance invoice and client management', margin + 24, 28)

  doc.setTextColor(...dark)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text('Invoice', pageWidth - margin, 24, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...muted)
  doc.text(`Invoice #${invoice.invoice_number || invoice.id}`, pageWidth - margin, 30, { align: 'right' })

  const client = invoice.client || {}
  let y = 56

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...muted)
  doc.text('Bill To', margin, y)
  doc.text('Invoice Details', pageWidth - margin - 58, y)

  y += 6
  doc.setTextColor(...dark)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text(client.name || 'Unnamed Client', margin, y)
  doc.text(invoice.status || 'Draft', pageWidth - margin, y, { align: 'right' })

  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...muted)
  doc.text(client.company || 'Independent client', margin, y)
  doc.text(`Issue date: ${invoice.issue_date || '—'}`, pageWidth - margin, y, { align: 'right' })
  y += 5
  doc.text(client.email || 'No email', margin, y)
  doc.text(`Due date: ${invoice.due_date || '—'}`, pageWidth - margin, y, { align: 'right' })
  y += 5
  doc.text(client.phone || 'No phone', margin, y)

  y += 10
  drawLine(doc, margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...muted)
  doc.text('Description', margin, y)
  doc.text('Qty', 116, y, { align: 'right' })
  doc.text('Rate', 150, y, { align: 'right' })
  doc.text('Amount', pageWidth - margin, y, { align: 'right' })

  y += 4
  drawLine(doc, margin, y, pageWidth - margin, y)
  y += 7

  ;(invoice.items || []).forEach((item) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...dark)
    doc.setFontSize(10)
    const descriptionLines = doc.splitTextToSize(item.description || 'Line item', 82)
    doc.text(descriptionLines, margin, y)
    const itemHeight = Math.max(descriptionLines.length * 5, 5)
    doc.text(String(item.quantity || 1), 116, y, { align: 'right' })
    doc.text(formatCurrency(item.rate), 150, y, { align: 'right' })
    doc.text(formatCurrency(item.amount), pageWidth - margin, y, { align: 'right' })
    y += itemHeight + 4
  })

  y += 2
  drawLine(doc, margin, y, pageWidth - margin, y)
  y += 8

  const summaryX = pageWidth - margin - 68
  const summaryRows = [
    ['Subtotal', invoice.subtotal],
    [`Tax${invoice.tax_rate ? ` (${invoice.tax_rate}%)` : ''}`, invoice.tax_amount],
    ['Discount', invoice.discount_amount],
    ['Total', invoice.total],
  ]

  summaryRows.forEach(([label, value], index) => {
    doc.setFont('helvetica', index === summaryRows.length - 1 ? 'bold' : 'normal')
    doc.setFontSize(index === summaryRows.length - 1 ? 12 : 10)
    doc.setTextColor(...index === summaryRows.length - 1 ? dark : muted)
    doc.text(label, summaryX, y)
    doc.text(formatCurrency(value), pageWidth - margin, y, { align: 'right' })
    y += index === summaryRows.length - 1 ? 8 : 6
  })

  if (invoice.notes) {
    y += 6
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...muted)
    doc.text('Notes', margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...dark)
    const noteLines = doc.splitTextToSize(invoice.notes, pageWidth - margin * 2)
    doc.text(noteLines, margin, y)
    y += noteLines.length * 5
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...muted)
  doc.text('Generated from WakeruCho', margin, 284)
  doc.save(`${invoice.invoice_number || 'invoice'}.pdf`)
}