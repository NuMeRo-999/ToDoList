import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default async function generatePdf( task ){
  
  const pdfDoc = await PDFDocument.create()

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  const page = pdfDoc.addPage()

  const { width, height } = page.getSize()

  const date = new Date();
  const dateFormat = date.toLocaleDateString();

  const value = `id: ${task.id} \n Titulo de la tarea: ${task.title} \n Tarea esta completa: ${task.isCompleted} \n Fecha: ${dateFormat}`

  const fontSize = 15
  page.drawText(value, {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });

  const pdfBytes = await pdfDoc.save()

  const blob = new Blob([pdfBytes], {type: 'application/pdf'});

  const primeras4Letras = task.title.slice(0, 4);

  const enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = window.URL.createObjectURL(blob);
  enlaceDescarga.download = `${primeras4Letras}_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
  enlaceDescarga.click();
  enlaceDescarga.remove();
}