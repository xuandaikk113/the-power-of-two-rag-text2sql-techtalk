# HTML Presentation to PDF/PPTX Converter

This project contains Node.js scripts to convert HTML presentations into PDF and PPTX formats, preserving slide layouts, animations, and styling.

## 📋 Overview

The conversion tools allow you to:
- **Convert HTML presentations to PDF** - Each slide becomes a separate page in the PDF
- **Convert HTML presentations to PPTX** - Each slide becomes a PowerPoint slide
- **Automatically detect slide count** - No need to hardcode the number of slides
- **Preserve animations and transitions** - Wait times ensure all CSS effects complete before capture

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd c:\Users\dai.nguyen\STS\techtalk\ThePowerOfTwo-RAG-Text2SQL
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - `playwright` - Browser automation for rendering slides
   - `pdf-lib` - PDF creation and manipulation
   - `pptxgenjs` - PowerPoint file generation

3. **Install Playwright browsers (first time only):**
   ```bash
   npx playwright install chromium
   ```

### Usage

#### Convert to PDF

```bash
node convert-to-pdf.js
```

**Configuration:**
- **Input file:** `rag-text2sql-presentation-optimized.html` (edit line 11 in the script to change)
- **Output file:** `rag-text2sql-presentation.pdf` (edit line 12 in the script to change)
- **Wait time per slide:** 3 seconds (to allow animations to complete)

#### Convert to PPTX

```bash
node convert-to-pptx.js
```

**Output:** `rag-text2sql-presentation.pptx`

## 📁 Project Structure

```
├── convert-to-pdf.js              # HTML → PDF converter
├── convert-to-pptx.js             # HTML → PPTX converter
├── rag-text2sql-presentation-optimized.html  # Source HTML presentation
├── css/                           # Stylesheets
│   ├── global.css                # Global styles and design tokens
│   ├── components.css            # Reusable component styles
│   └── slides.css                # Slide-specific styles
├── images/                       # Presentation images
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

## ⚙️ Customization

### Adjust Wait Time for Animations

If slides appear dark or incomplete in the PDF, increase the wait time in `convert-to-pdf.js`:

```javascript
// Line 56 - increase from 3000ms to desired duration
await page.waitForTimeout(3000); // 3 seconds
```

### Change Input/Output Files

Edit the constants at the top of `convert-to-pdf.js`:

```javascript
const INPUT_HTML = 'your-presentation.html';
const OUTPUT_PDF = 'output-name.pdf';
```

### Adjust Slide Dimensions

The default resolution is 1920x1080 (Full HD). To change:

```javascript
// Line 20-21 in convert-to-pdf.js
viewport: { width: 1920, height: 1080 }

// Line 59-60
width: '1920px',
height: '1080px',
```

## 🔧 How It Works

### PDF Conversion Process

1. **Launch Browser** - Starts headless Chromium via Playwright
2. **Load HTML** - Opens the HTML presentation file
3. **Detect Slides** - Counts all elements with class `.slide`
4. **Process Each Slide:**
   - Navigate to the slide
   - Wait 3 seconds for animations to complete
   - Capture as PDF page
5. **Merge PDFs** - Combines all pages into a single PDF file
6. **Cleanup** - Removes temporary files

### Key Features

- ✅ **Dynamic slide detection** - Automatically counts slides (no hardcoding)
- ✅ **Animation-aware** - Waits for CSS transitions to complete
- ✅ **High quality** - Full HD resolution (1920x1080)
- ✅ **True rendering** - Uses actual browser for pixel-perfect output
- ✅ **Batch processing** - Handles any number of slides

## 📝 Notes

- **Processing time:** Approximately 3-4 seconds per slide
  - For a 32-slide presentation: ~2 minutes total
- **File size:** PDF output is typically 5-10 MB depending on images
- **Temp files:** Created in `temp_pdfs/` directory, automatically cleaned up
- **Browser:** Uses Chromium for rendering (most compatible)

## 🐛 Troubleshooting

### Issue: Dark or incomplete slides in PDF

**Solution:** Increase the wait time per slide in `convert-to-pdf.js`:
```javascript
await page.waitForTimeout(5000); // Try 5 seconds
```

### Issue: Missing fonts

**Solution:** Ensure fonts are loaded in your HTML or use web-safe/Google Fonts

### Issue: `playwright` not found

**Solution:** Install the browser binaries:
```bash
npx playwright install chromium
```

### Issue: Out of memory

**Solution:** Process fewer slides at once or increase Node.js memory:
```bash
node --max-old-space-size=4096 convert-to-pdf.js
```

## 📄 License

This project is part of the Text2SQL RAG tech talk presentation.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Generated for:** ThePowerOfTwo-RAG-Text2SQL Tech Talk  
**Last Updated:** February 2026
