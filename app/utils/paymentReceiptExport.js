import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const PRINT_ROOT_ID = 'payment-receipt-print-root';

async function waitForFonts(timeoutMs = 4000) {
	if (!document.fonts?.ready) return;
	await Promise.race([
		document.fonts.ready,
		new Promise((resolve) => setTimeout(resolve, timeoutMs)),
	]);
}

function getCaptureBackground(element) {
	const computed = window.getComputedStyle(element).backgroundColor;
	if (computed && computed !== 'rgba(0, 0, 0, 0)') {
		return computed;
	}

	return document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff';
}

async function captureElement(el) {
	await waitForFonts();
	await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

	return toPng(el, {
		pixelRatio: 2,
		cacheBust: true,
		backgroundColor: getCaptureBackground(el),
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

export function printPaymentReceipt(element) {
	if (!element) return;

	let printRoot = document.getElementById(PRINT_ROOT_ID);
	if (!printRoot) {
		printRoot = document.createElement('div');
		printRoot.id = PRINT_ROOT_ID;
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

export async function downloadPaymentReceiptPng(element, filename) {
	const dataUrl = await captureElement(element);
	downloadDataUrl(dataUrl, filename);
	return dataUrl;
}

export async function downloadPaymentReceiptPdf(element, filename) {
	const dataUrl = await captureElement(element);
	const img = new Image();
	await new Promise((resolve, reject) => {
		img.onload = resolve;
		img.onerror = reject;
		img.src = dataUrl;
	});

	const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a5' });
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

export function buildPaymentReceiptFilename(referenceId, ext) {
	const slug = (referenceId || 'receipt')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w\u0600-\u06FF-]/g, '')
		.slice(0, 40) || 'receipt';
	const date = new Date().toISOString().slice(0, 10);
	return `payment-receipt-${slug}-${date}.${ext}`;
}
