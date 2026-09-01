import { jsPDF } from 'jspdf';
import { PlacedPlayer, PlacedEquipment, TacticalDrawing, DrillSheet } from '../types';

export async function generateTacticalPDF({
  tacticTitle,
  drillSheet,
  players,
  equipment,
  drawings,
  pitchSvgElement,
}: {
  tacticTitle: string;
  drillSheet: DrillSheet;
  players: PlacedPlayer[];
  equipment: PlacedEquipment[];
  drawings: TacticalDrawing[];
  pitchSvgElement: SVGSVGElement | null;
}): Promise<void> {
  // 1. Create jsPDF instance in A4 Landscape (297 x 210 mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 12;

  // Background Theme
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Header Banner
  doc.setFillColor(2, 44, 34); // emerald-950
  doc.rect(margin, margin, pageWidth - margin * 2, 16, 'F');
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, pageWidth - margin * 2, 16, 'S');

  // App Logo & Title
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MISTERTACTICS', margin + 4, margin + 7);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont('helvetica', 'normal');
  doc.text('SCHEDA TECNICA & TAVOLA TATTICA', margin + 4, margin + 12);

  // Drill Category & Meta Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(drillSheet.title || tacticTitle || 'Schema Tattico', margin + 65, margin + 8);

  doc.setFontSize(8);
  doc.setTextColor(250, 204, 21); // amber-400
  doc.text(
    `Categoria: ${drillSheet.category || 'Tattica'}   |   Autore: ${drillSheet.author || 'Mister'}   |   Data: ${drillSheet.date || new Date().toLocaleDateString('it-IT')}`,
    margin + 65,
    margin + 13
  );

  // 2. Convert SVG Pitch to High-Resolution Canvas Image
  if (pitchSvgElement) {
    try {
      const svgString = new XMLSerializer().serializeToString(pitchSvgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
        img.src = blobURL;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1800;
      canvas.height = 1100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#03150d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imgData = canvas.toDataURL('image/png');
        window.URL.revokeObjectURL(blobURL);

        // Draw tactical pitch on left half of the page
        const pitchX = margin;
        const pitchY = margin + 20;
        const pitchW = 168; // width in mm
        const pitchH = 112; // height in mm

        // Pitch frame
        doc.setDrawColor(30, 41, 59);
        doc.setLineWidth(0.8);
        doc.rect(pitchX - 1, pitchY - 1, pitchW + 2, pitchH + 2, 'S');

        doc.addImage(imgData, 'PNG', pitchX, pitchY, pitchW, pitchH);
      }
    } catch (e) {
      console.error('Error generating pitch image for PDF:', e);
    }
  }

  // 3. Technical Parameters Card (Right Column)
  const rightColX = margin + 174;
  const rightColY = margin + 20;
  const rightColW = pageWidth - margin - rightColX;

  // Box 1: Specifiche Esercitazione
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(rightColX, rightColY, rightColW, 34, 2, 2, 'F');
  doc.setDrawColor(51, 65, 85);
  doc.roundedRect(rightColX, rightColY, rightColW, 34, 2, 2, 'S');

  doc.setTextColor(56, 189, 248); // sky-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PARAMETRI DI LAVORO', rightColX + 4, rightColY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240); // slate-200
  doc.text(`- Durata: ${drillSheet.durationMinutes || 20} minuti`, rightColX + 4, rightColY + 13);
  doc.text(`- Giocatori: ${drillSheet.playersCount || `${players.length} effettivi`}`, rightColX + 4, rightColY + 19);
  doc.text(`- Campo: ${drillSheet.pitchDimensions || 'Campo Regolamentare'}`, rightColX + 4, rightColY + 25);
  doc.text(`- Attrezzi: ${equipment.length} elementi posizionati`, rightColX + 4, rightColY + 31);

  // Box 2: Obiettivi Tecnico-Tattici
  const objBoxY = rightColY + 37;
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(rightColX, objBoxY, rightColW, 75, 2, 2, 'F');
  doc.setDrawColor(51, 65, 85);
  doc.roundedRect(rightColX, objBoxY, rightColW, 75, 2, 2, 'S');

  doc.setTextColor(250, 204, 21); // amber-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('OBIETTIVI & FOCUS METODOLOGICO', rightColX + 4, objBoxY + 6);

  doc.setFontSize(7.5);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFont('helvetica', 'bold');
  doc.text('Obiettivo Primario:', rightColX + 4, objBoxY + 12);
  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  const splitPrim = doc.splitTextToSize(drillSheet.objectivesPrimary || 'Mantenimento del possesso ed efficacia nella costruzione.', rightColW - 8);
  doc.text(splitPrim, rightColX + 4, objBoxY + 16);

  const secY = objBoxY + 16 + splitPrim.length * 3.5 + 2;
  doc.setTextColor(56, 189, 248); // sky-400
  doc.setFont('helvetica', 'bold');
  doc.text('Obiettivo Secondario / Transizione:', rightColX + 4, secY);
  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  const splitSec = doc.splitTextToSize(drillSheet.objectivesSecondary || 'Reazione immediata a palla persa e riaggressione veloce.', rightColW - 8);
  doc.text(splitSec, rightColX + 4, secY + 4);

  const coachY = secY + 4 + splitSec.length * 3.5 + 2;
  doc.setTextColor(244, 114, 182); // pink-400
  doc.setFont('helvetica', 'bold');
  doc.text('Punti Chiave (Coaching Points):', rightColX + 4, coachY);
  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  const splitCoach = doc.splitTextToSize(drillSheet.coachingPoints || 'Postura aperta, scansione visiva e comunicazione rapida.', rightColW - 8);
  doc.text(splitCoach, rightColX + 4, coachY + 4);

  // 4. Bottom Row: Svolgimento & Formazione Schierata
  const bottomY = margin + 136;
  const bottomH = pageHeight - margin - bottomY;

  // Bottom Left: Descrizione e Regole
  const descW = 168;
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, bottomY, descW, bottomH, 2, 2, 'F');
  doc.setDrawColor(51, 65, 85);
  doc.roundedRect(margin, bottomY, descW, bottomH, 2, 2, 'S');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DESCRIZIONE & REGOLE DI GIOCO', margin + 4, bottomY + 6);

  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  const splitDesc = doc.splitTextToSize(
    `${drillSheet.description || 'Disporre i giocatori secondo lo schema tattico illustrato.'} \n\nRegole & Varianti: ${drillSheet.rulesAndVariations || 'Massimo 2 tocchi; ricerca continua dello spazio libero.'}`,
    descW - 8
  );
  doc.text(splitDesc, margin + 4, bottomY + 11);

  // Bottom Right: Lista Giocatori Schierati
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(rightColX, bottomY, rightColW, bottomH, 2, 2, 'F');
  doc.setDrawColor(51, 65, 85);
  doc.roundedRect(rightColX, bottomY, rightColW, bottomH, 2, 2, 'S');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`GIOCATORI IN CAMPO (${players.length})`, rightColX + 4, bottomY + 6);

  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);

  // Print first 14 players in two compact columns
  const colA = players.slice(0, 7);
  const colB = players.slice(7, 14);

  colA.forEach((p, idx) => {
    const teamPrefix = p.team === 'home' ? 'BLU' : p.team === 'away' ? 'ROS' : 'JOL';
    doc.text(`[${p.role}] #${p.number} ${p.name.substring(0, 10)} (${teamPrefix})`, rightColX + 4, bottomY + 11 + idx * 4);
  });

  colB.forEach((p, idx) => {
    const teamPrefix = p.team === 'home' ? 'BLU' : p.team === 'away' ? 'ROS' : 'JOL';
    doc.text(`[${p.role}] #${p.number} ${p.name.substring(0, 10)} (${teamPrefix})`, rightColX + 52, bottomY + 11 + idx * 4);
  });

  // Footer Signature
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Documento generato con MisterTactics - Lavagna Tattica Professionale • Pagina 1/1`,
    pageWidth / 2,
    pageHeight - 4,
    { align: 'center' }
  );

  // 5. Save and trigger direct download
  const safeFilename = (drillSheet.title || tacticTitle || 'Schema_Tattico')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeFilename}_MisterTactics.pdf`);
}
