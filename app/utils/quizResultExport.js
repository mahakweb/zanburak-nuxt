import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

async function waitForFonts(timeoutMs = 4000) {
    if (!document.fonts?.ready) return;
    await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
}

async function captureElement(el) {
    await waitForFonts();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    return toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
        width: el.scrollWidth,
        height: el.scrollHeight,
    });
}

function downloadDataUrl(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export function printQuizResult(element) {
    if (!element) return;

    let printRoot = document.getElementById('quiz-result-print-root');
    if (!printRoot) {
        printRoot = document.createElement('div');
        printRoot.id = 'quiz-result-print-root';
        document.body.appendChild(printRoot);
    }

    printRoot.innerHTML = '';
    printRoot.appendChild(element.cloneNode(true));

    const restore = () => {
        printRoot.innerHTML = '';
        window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    window.print();
}

export async function downloadQuizResultPng(element, filename) {
    const dataUrl = await captureElement(element);
    downloadDataUrl(dataUrl, filename);
    return dataUrl;
}

export async function downloadQuizResultPdf(element, filename) {
    const dataUrl = await captureElement(element);
    const img = new Image();
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
    });

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const contentWidth = pageWidth - margin * 2;
    const imgHeight = (img.height * contentWidth) / img.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(dataUrl, 'PNG', margin, position, contentWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
        pdf.addPage();
        position = margin - (imgHeight - heightLeft);
        pdf.addImage(dataUrl, 'PNG', margin, position, contentWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(filename);
}

export function buildQuizResultFilename(quizTitle, ext) {
    const slug = (quizTitle || 'quiz')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]/g, '')
        .slice(0, 40) || 'quiz';
    const date = new Date().toISOString().slice(0, 10);
    return `quiz-result-${slug}-${date}.${ext}`;
}
