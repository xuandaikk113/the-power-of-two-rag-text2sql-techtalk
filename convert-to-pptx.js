const pptxgen = require("pptxgenjs");
const path = require("path");

// Color scheme (from CSS variables)
const COLORS = {
  primary: "05668D",
  secondary: "028090",
  tertiary: "00A896",
  accent: "02C39A",
  dark: "0a1828",
  darker: "030b14",
  light: "f0f4f8",
  error: "ff4757",
  white: "FFFFFF",
  textLight: "E0E0E0"
};

// Create presentation
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "The Power of Two: How RAG Elevates Text-to-SQL Accuracy";
pres.author = "Tech Talk";

// Helper functions
const makeShadow = () => ({ type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.3 });

function addTitleSlide(pres, title, subtitle, footer) {
  const slide = pres.addSlide();
  slide.background = { color: COLORS.darker };
  
  slide.addText(title, {
    x: 0.5, y: 1.5, w: 9, h: 2,
    fontSize: 40, fontFace: "Arial", bold: true, color: COLORS.accent,
    align: "center", valign: "middle"
  });
  
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 3.5, w: 9, h: 0.6,
      fontSize: 20, fontFace: "Arial", color: COLORS.light, align: "center"
    });
  }
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.5, y: 4.2, w: 3, h: 0.8,
    fill: { color: COLORS.tertiary }, shadow: makeShadow()
  });
  slide.addText("RAG + SQL", {
    x: 3.5, y: 4.2, w: 3, h: 0.8,
    fontSize: 24, fontFace: "Arial", bold: true, color: COLORS.dark, align: "center", valign: "middle"
  });
  
  if (footer) {
    slide.addText(footer, {
      x: 0.5, y: 5, w: 9, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: COLORS.secondary, align: "center"
    });
  }
  return slide;
}

function addContentSlide(pres, title, slideNum, totalSlides) {
  const slide = pres.addSlide();
  slide.background = { color: COLORS.darker };
  
  // Title
  slide.addText(title.replace(/<br\s*\/?>/g, "\n"), {
    x: 0.5, y: 0.3, w: 9, h: 1,
    fontSize: 32, fontFace: "Arial", bold: true, color: COLORS.accent
  });
  
  // Slide number
  slide.addText(`${slideNum} / ${totalSlides}`, {
    x: 8.5, y: 5.2, w: 1.2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: COLORS.tertiary, align: "right"
  });
  
  return slide;
}

function addBulletList(slide, items, startY = 1.5) {
  const textItems = items.map((item, i) => ({
    text: item.text,
    options: { bullet: true, breakLine: i < items.length - 1, color: item.color || COLORS.light }
  }));
  
  slide.addText(textItems, {
    x: 0.7, y: startY, w: 8.5, h: 2.5,
    fontSize: 18, fontFace: "Arial", color: COLORS.light, paraSpaceAfter: 12
  });
}

function addTable(slide, headers, rows, options = {}) {
  const tableData = [
    headers.map(h => ({ text: h, options: { fill: { color: COLORS.secondary }, color: COLORS.white, bold: true, align: "center" } })),
    ...rows.map(row => row.map(cell => ({ text: String(cell), options: { fill: { color: COLORS.dark }, color: COLORS.light, align: "center" } })))
  ];
  
  slide.addTable(tableData, {
    x: options.x || 0.5, y: options.y || 2.5, w: options.w || 9,
    border: { pt: 1, color: COLORS.tertiary },
    fontFace: "Arial", fontSize: 12
  });
}

function addStatsGrid(slide, stats, y = 2) {
  const cardWidth = 2;
  const gap = 0.3;
  const startX = (10 - (stats.length * cardWidth + (stats.length - 1) * gap)) / 2;
  
  stats.forEach((stat, i) => {
    const x = startX + i * (cardWidth + gap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardWidth, h: 1.5,
      fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 2 }, shadow: makeShadow()
    });
    slide.addText(stat.value, {
      x, y: y + 0.1, w: cardWidth, h: 0.8,
      fontSize: 28, fontFace: "Arial", bold: true, color: COLORS.accent, align: "center", valign: "middle"
    });
    slide.addText(stat.label, {
      x, y: y + 0.9, w: cardWidth, h: 0.5,
      fontSize: 11, fontFace: "Arial", color: COLORS.light, align: "center", valign: "top"
    });
  });
}

function addHighlightBox(slide, text, y = 4.5, isWarning = false) {
  const bgColor = isWarning ? "3D2914" : COLORS.dark;
  const borderColor = isWarning ? "F39C12" : COLORS.accent;
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y, w: 9, h: 0.7,
    fill: { color: bgColor }, line: { color: borderColor, width: 2 }
  });
  slide.addText(text, {
    x: 0.6, y, w: 8.8, h: 0.7,
    fontSize: 14, fontFace: "Arial", color: COLORS.light, align: "center", valign: "middle"
  });
}

function addDiagramBoxes(slide, boxes, y = 3) {
  const boxWidth = 2.2;
  const gap = 0.8;
  const startX = (10 - (boxes.length * boxWidth + (boxes.length - 1) * gap)) / 2;
  
  boxes.forEach((box, i) => {
    const x = startX + i * (boxWidth + gap);
    const bgColor = box.type === "error" ? COLORS.error : box.type === "success" ? COLORS.tertiary : COLORS.dark;
    
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: boxWidth, h: 1.2,
      fill: { color: bgColor }, line: { color: COLORS.tertiary, width: 1 }, shadow: makeShadow()
    });
    slide.addText(box.icon || "", { x, y: y + 0.1, w: boxWidth, h: 0.5, fontSize: 24, align: "center" });
    slide.addText(box.text, { x, y: y + 0.6, w: boxWidth, h: 0.5, fontSize: 14, fontFace: "Arial", color: COLORS.white, align: "center" });
    
    if (i < boxes.length - 1) {
      slide.addText("→", { x: x + boxWidth + 0.2, y: y + 0.4, w: 0.4, h: 0.4, fontSize: 24, color: COLORS.accent, align: "center" });
    }
  });
}

function addFlowchart(slide, steps, startY = 1.5) {
  steps.forEach((step, i) => {
    const y = startY + i * 0.7;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1, y, w: 8, h: 0.5,
      fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 1 }
    });
    slide.addText(step, { x: 1, y, w: 8, h: 0.5, fontSize: 14, fontFace: "Arial", color: COLORS.light, align: "center", valign: "middle" });
    
    if (i < steps.length - 1) {
      slide.addText("↓", { x: 4.7, y: y + 0.5, w: 0.6, h: 0.2, fontSize: 16, color: COLORS.accent, align: "center" });
    }
  });
}

function addPipelineSteps(slide, steps, y = 3.5) {
  const stepWidth = 2.2;
  const gap = 0.6;
  const startX = (10 - (steps.length * stepWidth + (steps.length - 1) * gap)) / 2;
  
  steps.forEach((step, i) => {
    const x = startX + i * (stepWidth + gap);
    
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.85, y: y - 0.5, w: 0.5, h: 0.5,
      fill: { color: COLORS.accent }
    });
    slide.addText(String(step.num), {
      x: x + 0.85, y: y - 0.5, w: 0.5, h: 0.5,
      fontSize: 16, fontFace: "Arial", bold: true, color: COLORS.dark, align: "center", valign: "middle"
    });
    
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: y + 0.1, w: stepWidth, h: 0.8,
      fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 1 }
    });
    slide.addText(step.title, { x, y: y + 0.1, w: stepWidth, h: 0.8, fontSize: 13, fontFace: "Arial", color: COLORS.light, align: "center", valign: "middle" });
    
    if (i < steps.length - 1) {
      slide.addText("→", { x: x + stepWidth + 0.15, y: y + 0.3, w: 0.3, h: 0.3, fontSize: 20, color: COLORS.accent, align: "center" });
    }
  });
}

function addBarChart(slide, data, y = 2.5) {
  data.forEach((item, i) => {
    const rowY = y + i * 0.9;
    slide.addText(item.label, { x: 0.5, y: rowY, w: 2, h: 0.6, fontSize: 14, fontFace: "Arial", color: COLORS.light, align: "right", valign: "middle" });
    
    const barWidth = 5.5 * (item.value / 100);
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.7, y: rowY + 0.1, w: 5.5, h: 0.4, fill: { color: COLORS.dark } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.7, y: rowY + 0.1, w: barWidth, h: 0.4, fill: { color: COLORS.tertiary } });
    slide.addText(`${item.value}%`, { x: 2.7 + barWidth + 0.1, y: rowY, w: 0.8, h: 0.6, fontSize: 12, color: COLORS.accent, valign: "middle" });
  });
}

function addComparison(slide, left, right, y = 2) {
  // Left (bad)
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 4.2, h: 2.8, fill: { color: "1a1a2e" }, line: { color: COLORS.error, width: 2 } });
  slide.addText(left.title, { x: 0.5, y, w: 4.2, h: 0.5, fontSize: 16, fontFace: "Arial", bold: true, color: COLORS.error, align: "center" });
  slide.addText(left.content, { x: 0.7, y: y + 0.6, w: 3.8, h: 2.1, fontSize: 11, fontFace: "Consolas", color: COLORS.light });
  
  // Right (good)
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y, w: 4.2, h: 2.8, fill: { color: "0a2a1a" }, line: { color: COLORS.accent, width: 2 } });
  slide.addText(right.title, { x: 5.3, y, w: 4.2, h: 0.5, fontSize: 16, fontFace: "Arial", bold: true, color: COLORS.accent, align: "center" });
  slide.addText(right.content, { x: 5.5, y: y + 0.6, w: 3.8, h: 2.1, fontSize: 11, fontFace: "Consolas", color: COLORS.light });
}

function addArchitectureGrid(slide, items, y = 1.5) {
  const cols = 5;
  const boxW = 1.7;
  const boxH = 0.7;
  const gapX = 0.12;
  const gapY = 0.15;
  const startX = (10 - (cols * boxW + (cols - 1) * gapX)) / 2;
  
  items.forEach((item, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = startX + col * (boxW + gapX);
    const boxY = y + row * (boxH + gapY);
    
    slide.addShape(pres.shapes.RECTANGLE, { x, y: boxY, w: boxW, h: boxH, fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 1 } });
    slide.addText(item, { x, y: boxY, w: boxW, h: boxH, fontSize: 10, fontFace: "Arial", color: COLORS.light, align: "center", valign: "middle" });
  });
}

const TOTAL_SLIDES = 32;

// === SLIDE 1: Title ===
addTitleSlide(pres, "The Power of Two:\nHow RAG Elevates\nText-to-SQL Accuracy", "A Practical Approach for Enterprise-Scale Databases", "Tech Talk Presentation | February 2026");

// === SLIDE 2: The Challenge ===
let slide = addContentSlide(pres, "The Traditional Approach Falls Short", 2, TOTAL_SLIDES);
addBulletList(slide, [
  { text: "❌ Injecting entire schema into every prompt", color: COLORS.error },
  { text: "❌ Context window overflow (50+ tables × 20+ columns)", color: COLORS.error },
  { text: "❌ Token waste & reduced accuracy", color: COLORS.error }
]);
addDiagramBoxes(slide, [
  { icon: "📊", text: "300+ Tables" },
  { icon: "🤖", text: "LLM Context" },
  { icon: "⚠️", text: "OVERFLOW!", type: "error" }
], 3.5);

// === SLIDE 3: Schema Linking Solution ===
slide = addContentSlide(pres, "Schema Linking: Retrieve, Don't Inject All", 3, TOTAL_SLIDES);
addBulletList(slide, [
  { text: "✅ Enrich schemas with semantic descriptions", color: COLORS.accent },
  { text: "✅ Index into Vector Database", color: COLORS.accent },
  { text: "✅ Retrieve only top-K relevant tables per query", color: COLORS.accent }
], 1.3);
addPipelineSteps(slide, [
  { num: 1, title: "Enrich\nSchema Files" },
  { num: 2, title: "Index\nVector DB" },
  { num: 3, title: "Retrieve\nRelevant Tables" }
], 3.5);

// === SLIDE 4: LLM Selection ===
slide = addContentSlide(pres, "Not All LLMs Are Created Equal for SQL", 4, TOTAL_SLIDES);
addBulletList(slide, [
  { text: "General-purpose models (Llama, Qwen, GPT) excel at chat" },
  { text: "SQL generation requires specialized reasoning" },
  { text: "Benchmark evidence matters" }
], 1.3);
addBarChart(slide, [
  { label: "OmniSQL-14B", value: 71.2 },
  { label: "SQLCoder-8B", value: 68.9 },
  { label: "GPT-4o", value: 68.4 },
  { label: "Qwen2.5-72B", value: 58.1 }
], 2.8);
slide.addText("Bird-SQL Benchmark Performance (Execution Accuracy)", { x: 0.5, y: 5.2, w: 9, h: 0.3, fontSize: 10, color: COLORS.secondary, align: "center" });

// === SLIDE 5: SQL-Specialized Models ===
slide = addContentSlide(pres, "Enter SQL-Specialized LLMs", 5, TOTAL_SLIDES);
addStatsGrid(slide, [
  { value: "71.2%", label: "OmniSQL Bird-SQL" },
  { value: "87.1%", label: "OmniSQL Spider" },
  { value: "14B", label: "Parameters" },
  { value: "✓", label: "Self-Hostable" }
], 1.3);
addTable(slide, ["Model", "Size", "Bird-SQL", "Spider", "Self-Host"], [
  ["OmniSQL", "14B", "71.2%", "87.1%", "✅ Ollama"],
  ["SQLCoder", "8B", "68.9%", "84.5%", "✅ Ollama"],
  ["GPT-4o", "?", "68.4%", "85.3%", "❌ API"],
  ["Qwen2.5", "72B", "58.1%", "79.2%", "✅ Heavy"]
], { y: 3.2 });

// === SLIDE 6: OmniSQL Benchmark ===
slide = addContentSlide(pres, "OmniSQL Benchmark", 6, TOTAL_SLIDES);
slide.addImage({ path: path.join(__dirname, "images/omnisql_benchmark.png"), x: 1, y: 1.3, w: 8, h: 3.2 });
addHighlightBox(slide, "OmniSQL outperforms general-purpose LLMs by 3-13% on SQL benchmarks", 4.7);

// === SLIDE 7: System Architecture ===
slide = addContentSlide(pres, "End-to-End System Architecture", 7, TOTAL_SLIDES);
addArchitectureGrid(slide, [
  "1. User Query Input", "2. Query Enhancement", "3. Column-First RAG", "4. Anchor Tables", "5. Table Expansion",
  "6. Schema Context", "7. SQL Generation", "8. T-SQL Correction", "9. Self-Healing", "10. Response Format"
], 1.4);
addHighlightBox(slide, "Complete pipeline from natural language to validated T-SQL with automated error recovery", 3.5);

// === SLIDE 8: Auto-Enrichment ===
slide = addContentSlide(pres, "Auto-Enrichment with Human Review", 8, TOTAL_SLIDES);
addComparison(slide, {
  title: "BEFORE (Raw DDL)",
  content: "CREATE TABLE Person (\n  PersonID INT PRIMARY KEY,\n  FirstName NVARCHAR(50),\n  Gender NVARCHAR(1)\n);"
}, {
  title: "AFTER (Enriched)",
  content: "Table: Person\nDescription: \"Core entity storing\nemployee and contact info\"\n\nColumns:\n- PersonID: Unique identifier (PK)\n- FirstName: Given name\n- Gender: M=Male, F=Female"
}, 1.5);

// === SLIDE 9: Dual-Collection Indexing ===
slide = addContentSlide(pres, "Dual-Collection Indexing Strategy", 9, TOTAL_SLIDES);
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 4.2, h: 1.5, fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 2 } });
slide.addText("Collection 1: Column Metadata", { x: 0.5, y: 1.5, w: 4.2, h: 0.5, fontSize: 14, bold: true, color: COLORS.accent, align: "center" });
slide.addText("Fine-grained column-level indexing\nEmbed: \"column_name + description + tags\"", { x: 0.7, y: 2, w: 3.8, h: 1, fontSize: 12, color: COLORS.light, align: "center" });

slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.5, w: 4.2, h: 1.5, fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 2 } });
slide.addText("Collection 2: Table Metadata", { x: 5.3, y: 1.5, w: 4.2, h: 0.5, fontSize: 14, bold: true, color: COLORS.accent, align: "center" });
slide.addText("Coarse-grained table-level indexing\nEmbed: \"table_name + semantic_description\"", { x: 5.5, y: 2, w: 3.8, h: 1, fontSize: 12, color: COLORS.light, align: "center" });

addHighlightBox(slide, "Separate embedding spaces enable both precision and recall optimization", 3.3);

// === SLIDE 10: Column-First Search ===
slide = addContentSlide(pres, "Why Column-First Search?", 10, TOTAL_SLIDES);
addBulletList(slide, [
  { text: "User queries often mention column-level concepts" },
  { text: "More granular matching = higher recall" },
  { text: "Columns aggregate to tables (bottom-up approach)" }
], 1.2);
addComparison(slide, {
  title: "Table-First ✗",
  content: "Query: \"orders in January 2024\"\n\n1. Search tables →\n   \"SalesOrderHeader\" (0.45)\n   (missed due to name mismatch)\n\n❌ May miss relevant table"
}, {
  title: "Column-First ✓",
  content: "Query: \"orders in January 2024\"\n\n1. Search columns →\n   \"OrderDate\" (0.89)\n   \"PlacedDate\" (0.85)\n\n2. Aggregate → SalesOrder"
}, 2.8);

// === SLIDE 11: Anchor Tables ===
slide = addContentSlide(pres, "From Columns to Anchor Tables", 11, TOTAL_SLIDES);
addFlowchart(slide, [
  "Step 1: For each column hit, aggregate score to parent table",
  "Step 2: Sort tables by aggregated score (descending)",
  "Step 3: Return top-K tables as Anchors (default K=5)"
], 1.4);
addTable(slide, ["Table", "Column Hits", "Aggregate Score"], [
  ["SalesOrderHeader", "OrderDate (0.89) + Status (0.72)", "1.61"],
  ["Customer", "Name (0.65)", "0.65"],
  ["Product", "(none)", "0.00"]
], { y: 3.8 });

// === SLIDE 12: Related Table Expansion ===
slide = addContentSlide(pres, "Finding Related Tables via FK Traversal", 12, TOTAL_SLIDES);
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 9, h: 1.2, fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 1 } });
slide.addText("Scoring Formula", { x: 0.5, y: 1.4, w: 9, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, align: "center" });
slide.addText("Related Score = Base Score + Bridge Bonus + Keyword Bonus\nBase=0.5×max(AnchorScore) | Bridge=+1.0 if >1 anchor | Keyword=+0.5 if matches query", { x: 0.7, y: 1.8, w: 8.6, h: 0.8, fontSize: 11, fontFace: "Consolas", color: COLORS.light, align: "center" });

addDiagramBoxes(slide, [
  { text: "Anchor Table 1\n(Score: 1.61)", type: "success" },
  { text: "Related Table\n(via FK)" },
  { text: "Anchor Table 2\n(Score: 1.25)", type: "success" }
], 3);

// === SLIDE 13: Schema Pruning ===
slide = addContentSlide(pres, "Smart Context Optimization", 13, TOTAL_SLIDES);
addComparison(slide, {
  title: "BEFORE (Full Schema)",
  content: "CREATE TABLE SalesOrder (\n  OrderID INT PRIMARY KEY,\n  RowGuid uniqueidentifier,\n  ModifiedDate datetime,\n  CreatedBy int,\n  OrderDate DATE,\n  Status VARCHAR(20)\n);"
}, {
  title: "AFTER (Optimized)",
  content: "CREATE TABLE SalesOrder (\n  OrderID INT PRIMARY KEY,\n  OrderDate DATE,\n  Status VARCHAR(20)\n  -- Samples: ['Pending',\n     'Shipped', 'Cancelled']\n);"
}, 1.5);
addHighlightBox(slide, "✅ Pruning: Remove low-value columns | ✅ Sample Injection: Add real values", 4.6);

// === SLIDE 14: T-SQL Correction ===
slide = addContentSlide(pres, "Enforcing T-SQL Syntax Compliance", 14, TOTAL_SLIDES);
addTable(slide, ["MySQL/PostgreSQL", "T-SQL Correction"], [
  ["LIMIT 10", "SELECT TOP 10"],
  ["string1 || string2", "CONCAT(string1, string2)"],
  ["NOW()", "GETDATE()"],
  ["IF(cond, a, b)", "IIF(cond, a, b)"],
  ["table.group", "table.[group]"]
], { y: 1.5 });
addHighlightBox(slide, "Rule-based validator + transformer auto-corrects common mistakes before execution", 4.6);

// === SLIDE 15: Self-Healing Loop ===
slide = addContentSlide(pres, "Execute, Diagnose, Heal, Retry", 15, TOTAL_SLIDES);
addFlowchart(slide, [
  "Execute SQL against read-only connection",
  "Capture error messages if execution fails",
  "Feed error back to LLM for correction",
  "Retry up to N times (default: 5)"
], 1.3);
slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4, w: 9, h: 0.9, fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 1 } });
slide.addText("Attempt 1: \"Invalid object name 'Orders'\" → Add schema prefix\nAttempt 2: \"Invalid column name 'Qty'\" → Change to \"OrderQty\"\nAttempt 3: ✅ Success!", { x: 0.7, y: 4.05, w: 8.6, h: 0.8, fontSize: 11, fontFace: "Consolas", color: COLORS.light });
addHighlightBox(slide, "⚠️ Security Note: Always use READ-ONLY database credentials", 5, true);

// === SLIDE 16: Gold Dataset ===
slide = addContentSlide(pres, "Building Your Evaluation Gold Standard", 16, TOTAL_SLIDES);
addTable(slide, ["Column", "Purpose"], [
  ["question", "Natural language query"],
  ["gold_sql", "Human-verified correct SQL"],
  ["gold_tables", "Tables that should be retrieved"],
  ["expected_record_count", "Number of rows expected"],
  ["expected_pks", "Primary key values for verification"],
  ["difficulty", "basic / intermediate / advanced"]
], { y: 1.4 });
addHighlightBox(slide, "Generate question-SQL pairs covering all difficulty levels. Human review is mandatory.", 4.6);

// === SLIDES 17-19: Dataset Samples ===
// Slide 17: Basic
slide = addContentSlide(pres, "Basic SQL Dataset Samples", 17, TOTAL_SLIDES);
addTable(slide, ["#", "Question", "Tables"], [
  ["1", "List all departments", "HumanResources.Department"],
  ["6", "Retrieve names of all products", "Production.Product"],
  ["11", "Get total employees in company", "HumanResources.Employee"],
  ["18", "Find highest list price", "Production.Product"],
  ["33", "Count how many products are red", "Production.Product"]
], { y: 1.4 });
addHighlightBox(slide, "✅ Basic SQL Queries | Single-table operations | Filtering & Aggregation", 4.5);

// Slide 18: Intermediate
slide = addContentSlide(pres, "Intermediate SQL Dataset Samples", 18, TOTAL_SLIDES);
addTable(slide, ["#", "Question", "Tables"], [
  ["201", "Total sales per territory", "SalesOrderHeader, SalesTerritory"],
  ["207", "Calculate running total of sales", "SalesOrderHeader"],
  ["215", "Products sold in >10 orders", "SalesOrderDetail"],
  ["225", "Calculate total sales per year (CTE)", "SalesOrderHeader"],
  ["237", "Products sold in every territory", "SOD, SOH, SalesTerritory"]
], { y: 1.4 });
addHighlightBox(slide, "✅ Intermediate Queries | JOINs | Window Functions | CTEs | Subqueries", 4.5);

// Slide 19: Advanced
slide = addContentSlide(pres, "Advanced SQL Dataset Samples", 19, TOTAL_SLIDES);
addTable(slide, ["#", "Question", "Tables"], [
  ["301", "Management hierarchy (Recursive CTE)", "HumanResources.Employee"],
  ["303", "Pivot sales by year and territory", "SOH, SalesTerritory"],
  ["307", "3-month moving average of sales", "SalesOrderHeader"],
  ["318", "Cumulative % of revenue by product", "SalesOrderDetail"],
  ["334", "Pareto products (80% of revenue)", "SalesOrderDetail"]
], { y: 1.4 });
addHighlightBox(slide, "✅ Advanced Queries | Recursive CTEs | PIVOT/UNPIVOT | Analytics", 4.5);

// === SLIDE 20: Continuous Learning ===
slide = addContentSlide(pres, "Continuous Learning from Expert Feedback", 20, TOTAL_SLIDES);
addFlowchart(slide, [
  "User asks question → System generates SQL",
  "Expert reviews → Clicks 👍 or 👎",
  "If 👍: Index (question, SQL) pair into gold dataset",
  "Future queries → Retrieve similar pairs as few-shot",
  "LLM generates SQL with reference examples"
], 1.4);

// === SLIDE 21: Key Metrics ===
slide = addContentSlide(pres, "Key Metrics for System Evaluation", 21, TOTAL_SLIDES);
const metrics = [
  { title: "Table Recall", desc: "Percentage of gold tables retrieved by RAG", formula: "Table Recall = |Retrieved ∩ Gold| / |Gold|" },
  { title: "Execution Success Rate", desc: "Percentage of queries that execute without error", formula: "Execution Success = Successful / Total" },
  { title: "Semantic Score", desc: "AST-based SQL similarity measurement", formula: "Semantic Score = 1 - (AST Diff / Total Nodes)" }
];
metrics.forEach((m, i) => {
  const y = 1.4 + i * 1.3;
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 1.1, fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 1 } });
  slide.addText(m.title, { x: 0.7, y, w: 8.6, h: 0.4, fontSize: 16, bold: true, color: COLORS.accent });
  slide.addText(m.desc, { x: 0.7, y: y + 0.35, w: 5, h: 0.35, fontSize: 12, color: COLORS.light });
  slide.addText(m.formula, { x: 5.5, y: y + 0.35, w: 3.8, h: 0.35, fontSize: 10, fontFace: "Consolas", color: COLORS.secondary, align: "right" });
});

// === SLIDE 22: Additional Metrics ===
slide = addContentSlide(pres, "Additional Evaluation Metrics", 22, TOTAL_SLIDES);
const addMetrics = [
  { title: "Record Count Match", desc: "Verifies correct number of rows returned" },
  { title: "Expected Answer Match", desc: "Compares result values with ground truth" },
  { title: "Primary Keys Match", desc: "Ensures correct entity identification" }
];
addMetrics.forEach((m, i) => {
  const y = 1.4 + i * 1.2;
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 1, fill: { color: COLORS.dark }, line: { color: COLORS.tertiary, width: 1 } });
  slide.addText(m.title, { x: 0.7, y, w: 8.6, h: 0.4, fontSize: 16, bold: true, color: COLORS.accent });
  slide.addText(m.desc, { x: 0.7, y: y + 0.4, w: 8.6, h: 0.5, fontSize: 12, color: COLORS.light });
});

// === SLIDE 23: Benchmark Results ===
slide = addContentSlide(pres, "System Performance Results", 23, TOTAL_SLIDES);
addStatsGrid(slide, [
  { value: "377", label: "Total Queries" },
  { value: "96.16%", label: "Table Recall" },
  { value: "88.86%", label: "Execution Success" },
  { value: "66.44%", label: "Semantic Score" }
], 1.3);
addTable(slide, ["Difficulty", "Count", "Table Recall", "Exec Success", "Semantic"], [
  ["Basic", "192", "99.39%", "98.44%", "73.60%"],
  ["Intermediate", "97", "93.28%", "87.63%", "62.65%"],
  ["Advanced", "88", "92.27%", "69.32%", "54.98%"]
], { y: 3.3 });

// === SLIDE 24: RAG Impact ===
slide = addContentSlide(pres, "Proving the Value of RAG", 24, TOTAL_SLIDES);
addHighlightBox(slide, "Key Insight: High table recall (96%+) enables accurate SQL generation", 1.3);
addBarChart(slide, [
  { label: "Basic", value: 99.39 },
  { label: "Intermediate", value: 93.28 },
  { label: "Advanced", value: 92.27 }
], 2.2);
addHighlightBox(slide, "Each 5% improvement in recall ≈ 8% improvement in execution success", 4.8);

// === SLIDE 25: Latency ===
slide = addContentSlide(pres, "Performance & Latency Analysis", 25, TOTAL_SLIDES);
addTable(slide, ["Stage", "Avg (ms)", "Median (ms)", "Max (ms)"], [
  ["Retrieval", "130", "101", "845"],
  ["Generation", "35,352", "35,800", "88,464"],
  ["Execution", "68", "39", "1,676"],
  ["Total", "35,556", "35,919", "88,707"]
], { y: 1.5 });
addHighlightBox(slide, "⚠️ Key Observation: Generation dominates latency (self-hosted LLM)\nRetrieval + Execution: <200ms | Generation: ~35 seconds", 4, true);

// === SLIDE 26: Error Analysis ===
slide = addContentSlide(pres, "Understanding Failure Cases", 26, TOTAL_SLIDES);
addStatsGrid(slide, [
  { value: "19", label: "Runtime Errors (45%)" },
  { value: "15", label: "Driver Errors (36%)" },
  { value: "8", label: "Syntax Errors (19%)" }
], 1.3);
addTable(slide, ["Difficulty", "Driver", "Runtime", "Syntax"], [
  ["Basic", "1", "2", "0"],
  ["Intermediate", "3", "8", "1"],
  ["Advanced", "11", "9", "7"]
], { y: 3.3 });
addHighlightBox(slide, "Advanced queries account for 64% of all errors despite being only 23% of queries", 4.8);

// === SLIDES 27-30: Image slides ===
const imageSlides = [
  { title: "SQL AST Difference Count Distribution", file: "ast_difference_distribution.png" },
  { title: "Error Rate Distribution", file: "error_rate_distribution.png" },
  { title: "Retry Distribution", file: "retry_distribution.png" },
  { title: "Table Recall Average", file: "table_recall_average.png" }
];
imageSlides.forEach((s, i) => {
  slide = addContentSlide(pres, s.title, 27 + i, TOTAL_SLIDES);
  slide.addImage({ path: path.join(__dirname, `images/${s.file}`), x: 1.5, y: 1.4, w: 7, h: 3.8 });
});

// === SLIDE 31: Roadmap ===
slide = addContentSlide(pres, "Roadmap for Enhanced Accuracy", 31, TOTAL_SLIDES);
addBulletList(slide, [
  { text: "Multi-hop Reasoning: 2-hop FK traversal for complex JOINs" },
  { text: "Reranker Integration: Cross-encoder reranking for table selection" },
  { text: "Query Decomposition: Break complex questions into sub-queries" },
  { text: "Dialect Fine-tuning: Custom T-SQL fine-tuned model" },
  { text: "Caching Layer: LRU cache for common query patterns" }
], 1.3);
addHighlightBox(slide, "Target: 95%+ execution success rate across all difficulty levels", 4.5);

// === SLIDE 32: Key Takeaways ===
slide = addContentSlide(pres, "Key Takeaways", 32, TOTAL_SLIDES);
addBulletList(slide, [
  { text: "✅ RAG-based Schema Linking solves context overflow", color: COLORS.accent },
  { text: "✅ SQL-specialized LLMs outperform general models", color: COLORS.accent },
  { text: "✅ Column-first retrieval improves recall accuracy", color: COLORS.accent },
  { text: "✅ Self-healing loop handles edge cases", color: COLORS.accent },
  { text: "✅ Continuous feedback enables improvement", color: COLORS.accent }
], 1.2);
addStatsGrid(slide, [
  { value: "96%", label: "Table Recall" },
  { value: "89%", label: "Execution Success" },
  { value: "377", label: "Queries Tested" }
], 3.5);
slide.addShape(pres.shapes.RECTANGLE, { x: 3, y: 4.8, w: 4, h: 0.6, fill: { color: COLORS.tertiary } });
slide.addText("Questions?", { x: 3, y: 4.8, w: 4, h: 0.6, fontSize: 24, fontFace: "Arial", bold: true, color: COLORS.dark, align: "center", valign: "middle" });

// Save the presentation
const outputPath = path.join(__dirname, "rag-text2sql-presentation.pptx");
pres.writeFile({ fileName: outputPath })
  .then(() => console.log(`✅ Presentation saved to: ${outputPath}`))
  .catch(err => console.error("Error:", err));
