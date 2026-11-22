import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

async function waitForFonts(timeoutMs = 3000) {
	if (!document.fonts?.ready) return;
	try {
		await Promise.race([
			document.fonts.ready,
			new Promise((resolve) => setTimeout(resolve, timeoutMs)),
		]);
	} catch {
		// continue even if font ready rejects
	}
}

function getCaptureBackground(element) {
	const computed = window.getComputedStyle(element).backgroundColor;
	if (computed && computed !== 'rgba(0, 0, 0, 0)' && computed !== 'transparent') {
		return computed;
	}

	return document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff';
}

async function captureElement(el) {
	await waitForFonts();
	await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

	const bg = getCaptureBackground(el);
	const rect = el.getBoundingClientRect();
	const options = {
		pixelRatio: 2,
		cacheBust: true,
		backgroundColor: bg,
		width: Math.ceil(rect.width) || el.scrollWidth,
		height: Math.ceil(rect.height) || el.scrollHeight,
		style: {
			transform: 'none',
			margin: '0',
			direction: document.documentElement.getAttribute('dir') || 'rtl',
		},
		filter: (node) => {
			if (node?.classList && node.classList.contains('receipt-export-actions')) {
				return false;
			}
			return true;
		},
	};

	try {
		return await toPng(el, options);
	} catch (err) {
		console.warn('Standard toPng failed, retrying without font inlining:', err);
		return await toPng(el, {
			...options,
			fontEmbedCSS: '',
		});
	}
}

function downloadDataUrl(dataUrl, filename) {
	const link = document.createElement('a');
	link.href = dataUrl;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
}

export async function printPaymentReceipt(element) {
	if (!element || typeof window === 'undefined') return;

	const dataUrl = await captureElement(element);
	if (!dataUrl) return;

	const existingIframe = document.getElementById('receipt-native-print-iframe');
	if (existingIframe) {
		existingIframe.remove();
	}

	const iframe = document.createElement('iframe');
	iframe.id = 'receipt-native-print-iframe';
	iframe.style.position = 'fixed';
	iframe.style.left = '-9999px';
	iframe.style.top = '0';
	iframe.style.width = '800px';
	iframe.style.height = '1100px';
	iframe.style.border = 'none';
	iframe.setAttribute('aria-hidden', 'true');
	document.body.appendChild(iframe);

	const iframeWindow = iframe.contentWindow;
	if (!iframeWindow) {
		window.print();
		return;
	}

	const iframeDoc = iframeWindow.document;
	const dir = document.documentElement.getAttribute('dir') || 'rtl';

	iframeDoc.open();
	iframeDoc.write(`
		<!DOCTYPE html>
		<html dir="${dir}">
		<head>
			<meta charset="utf-8">
			<title>رسید پرداخت</title>
			<style>
				@page {
					size: A5 portrait;
					margin: 8mm;
				}
				*, *::before, *::after {
					box-sizing: border-box;
				}
				html, body {
					margin: 0;
					padding: 0;
					background: #ffffff;
					display: flex;
					justify-content: center;
					align-items: flex-start;
					-webkit-print-color-adjust: exact !important;
					print-color-adjust: exact !important;
				}
				.receipt-print-container {
					width: 100%;
					max-width: 480px;
					margin: 4mm auto;
					text-align: center;
				}
				.receipt-print-img {
					width: 100%;
					max-width: 480px;
					height: auto;
					display: block;
					margin: 0 auto;
					border-radius: 20px;
					border: 1px solid #e2e8f0;
				}
			</style>
		</head>
		<body>
			<div class="receipt-print-container">
				<img id="receipt-img" class="receipt-print-img" src="${dataUrl}" alt="رسید پرداخت" />
			</div>
		</body>
		</html>
	`);
	iframeDoc.close();

	const img = iframeDoc.getElementById('receipt-img');
	const triggerPrint = () => {
		setTimeout(() => {
			try {
				iframeWindow.focus();
				iframeWindow.print();
			} catch (err) {
				console.error('Iframe print failed:', err);
				window.print();
			} finally {
				setTimeout(() => {
					iframe.remove();
				}, 2000);
			}
		}, 300);
	};

	if (img && img.complete) {
		triggerPrint();
	} else if (img) {
		img.onload = triggerPrint;
		img.onerror = triggerPrint;
	} else {
		triggerPrint();
	}
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
