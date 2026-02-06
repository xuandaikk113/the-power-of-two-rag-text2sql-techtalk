/**
 * Convert HTML presentation to PDF with Playwright
 * Each slide becomes one page in the final PDF
 */

const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const INPUT_HTML = 'rag-text2sql-presentation-optimized.html';
const OUTPUT_PDF = 'rag-text2sql-presentation.pdf';

async function convertToPdf() {
    console.log('Starting PDF conversion...');

    // Launch browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Load HTML file
    const htmlPath = path.resolve(__dirname, INPUT_HTML);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

    // Wait for fonts and images to load
    await page.waitForTimeout(2000);

    // Dynamically detect the total number of slides
    const TOTAL_SLIDES = await page.evaluate(() => {
        return document.querySelectorAll('.slide').length;
    });

    console.log(`Detected ${TOTAL_SLIDES} slides in the presentation`);
    console.log(`Processing ${TOTAL_SLIDES} slides...`);

    // Create temp directory for individual PDFs
    const tempDir = path.join(__dirname, 'temp_pdfs');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    // Generate PDF for each slide
    const pdfPaths = [];

    for (let i = 1; i <= TOTAL_SLIDES; i++) {
        console.log(`Processing slide ${i}/${TOTAL_SLIDES}...`);

        // Navigate to slide by setting currentSlide and calling showSlide
        await page.evaluate((slideNum) => {
            currentSlide = slideNum;
            showSlide(currentSlide);
        }, i);

        // Wait for slide transition and animations to complete
        await page.waitForTimeout(3000);

        // Generate PDF for this slide
        const slidePdfPath = path.join(tempDir, `slide_${String(i).padStart(2, '0')}.pdf`);
        await page.pdf({
            path: slidePdfPath,
            width: '1920px',
            height: '1080px',
            printBackground: true,
            preferCSSPageSize: false,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        pdfPaths.push(slidePdfPath);
    }

    console.log('Merging PDFs...');

    // Merge all PDFs into one
    const mergedPdf = await PDFDocument.create();

    for (const pdfPath of pdfPaths) {
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdf = await PDFDocument.load(pdfBytes);
        const [copiedPage] = await mergedPdf.copyPages(pdf, [0]);
        mergedPdf.addPage(copiedPage);
    }

    // Save merged PDF
    const outputPath = path.resolve(__dirname, OUTPUT_PDF);
    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedPdfBytes);

    console.log(`PDF saved to: ${outputPath}`);
    console.log(`Total pages: ${mergedPdf.getPageCount()}`);

    // Cleanup temp files
    console.log('Cleaning up temporary files...');
    for (const pdfPath of pdfPaths) {
        fs.unlinkSync(pdfPath);
    }
    fs.rmdirSync(tempDir);

    await browser.close();
    console.log('Done!');
}

convertToPdf().catch(console.error);
