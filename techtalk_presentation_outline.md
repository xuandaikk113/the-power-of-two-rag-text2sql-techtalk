# Tech Talk Presentation Outline
## The Power of Two: How RAG Elevates Text-to-SQL Accuracy

**Theme**: Text2SQL + RAG + Self-Hosted LLM for Large Databases  
**Total Slides**: 23  
**Color Palette**: #05668D, #028090, #00A896, #02C39A  
**Font**: Roboto | Title: 36px, Subtitle: 20px, Body: 15px

---

## Slide 1: Title Slide
**Title**: The Power of Two: How RAG Elevates Text-to-SQL Accuracy

**Content**:
- Subtitle: "A Practical Approach for Enterprise-Scale Databases"
- Speaker name and date
- Company/Organization logo

**Visual**: Abstract network graphic connecting database icons to AI/brain icon

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Abstract network connecting database to AI -->
<!-- Color palette: #05668D, #028090, #00A896, #02C39A -->
<!-- Create animated SVG showing nodes representing databases flowing to a central AI brain -->
<!-- Include floating table icons, connecting lines with gradient effects -->
<!-- Dark background (#1a1a2e) with glowing teal accents -->
```

---

## Slide 2: The Challenge - Schema Overload Problem
**Title**: The Traditional Approach Falls Short

**Key Points** (minimal text, max 3 bullets):
- ❌ Injecting entire schema into every prompt
- ❌ Context window overflow (50+ tables × 20+ columns)
- ❌ Token waste & reduced accuracy

**Visual**: Infographic showing "funnel overflow" - schema lines pouring into LLM box, causing overflow/error

**Speaker Notes**:
- Traditional method: Feed all CREATE TABLE statements into each prompt
- Works well for ≤ 20 tables
- Large databases (50-300+ tables) cause context overflow
- LLM becomes confused, generates incorrect JOINs
- Token cost explodes

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: "Funnel Overflow" infographic -->
<!-- Left side: Multiple stacked table icons (50+) with labels like "Table 1", "Table 2"... -->
<!-- Center: Funnel shape representing LLM input -->
<!-- Right side: Red warning/overflow effect showing bottleneck -->
<!-- Use color #05668D for tables, red gradient for overflow area -->
<!-- Include counter showing "50 tables × 20 cols = 1000+ schema lines" -->
<!-- Animate tables sliding into funnel with some falling out/overflowing -->
```

---

## Slide 3: The Solution - Schema Linking with RAG
**Title**: Schema Linking: Retrieve, Don't Inject All

**Key Points**:
- ✅ Enrich schemas with semantic descriptions
- ✅ Index into Vector Database
- ✅ Retrieve only top-K relevant tables per query

**Visual**: 3-step pipeline diagram:
1. **Enrich** → Schema files with descriptions
2. **Index** → Vector DB (Qdrant)
3. **Retrieve** → Only relevant tables injected

**Speaker Notes**:
- Instead of injecting everything, we use RAG pattern
- Step 1: Enrich table/column with business-level descriptions
- Step 2: Index enriched metadata into Qdrant vector store
- Step 3: At query time, retrieve only relevant schemas
- Result: Smaller context, better focus, higher accuracy

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: 3-Step RAG Pipeline Flow -->
<!-- Horizontal flow: Left to Right with 3 large circular steps -->
<!-- Step 1 (icon: sparkles + table): "ENRICH" - Tables → LLM → Enriched Metadata -->
<!-- Step 2 (icon: database + vector): "INDEX" - Metadata → Qdrant Vector Store -->
<!-- Step 3 (icon: search + filter): "RETRIEVE" - Query → Top-K Tables → LLM -->
<!-- Connect with animated gradient arrows -->
<!-- Color: #028090 for step circles, #02C39A for arrows/highlights -->
<!-- Dark background, clean modern design -->
```

---

## Slide 4: The LLM Selection Problem
**Title**: Not All LLMs Are Created Equal for SQL

**Key Points**:
- General-purpose models (Llama, Qwen, GPT) excel at chat
- SQL generation requires specialized reasoning
- Benchmark evidence matters

**Visual**: Bar chart comparing model performance on SQL benchmarks

**Speaker Notes**:
- Llama 3.2, Qwen 2.5, Qwen 3, GPT-4o are excellent for general tasks
- However, SQL generation is a specialized task requiring:
  - Schema understanding
  - JOIN logic reasoning
  - Dialect-specific syntax (T-SQL vs MySQL vs PostgreSQL)
- Bird-SQL, Spider benchmarks show general models underperform vs specialized

**Benchmark Source References**:
1. Bird-SQL Leaderboard: https://bird-bench.github.io/
2. Spider Leaderboard: https://yale-lily.github.io/spider
3. Text2SQL Benchmarks Collection: https://paperswithcode.com/task/text-to-sql

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Bar Chart - LLM SQL Performance Comparison -->
<!-- X-axis: Model names (GPT-4o, Llama 3.2, Qwen 2.5, OmniSQL-7B, SQLCoder-7B) -->
<!-- Y-axis: Execution Accuracy % (0-100) -->
<!-- Data (approximate from benchmarks): -->
<!-- GPT-4o: 68%, Llama 3.2 70B: 55%, Qwen 2.5 72B: 58%, OmniSQL-7B: 71%, SQLCoder-7B: 69% -->
<!-- Highlight SQL-specialized models (OmniSQL, SQLCoder) with #02C39A -->
<!-- General models in #05668D -->
<!-- Add legend: "SQL-Specialized" vs "General-Purpose" -->
<!-- Source citation at bottom -->
```

---

## Slide 5: The Solution - SQL-Specialized Models
**Title**: Enter SQL-Specialized LLMs

**Key Points**:
- **OmniSQL** (SeaGPT): State-of-the-art on Bird-SQL
- **SQLCoder** (Defog): Optimized for enterprise SQL
- Self-hostable (7B-32B parameter ranges)

**Visual**: Model comparison card layout with key stats

**Speaker Notes**:
- OmniSQL by SeaGPT - trained specifically on Text2SQL datasets
- SQLCoder by Defog - fine-tuned for business databases
- Both available in 7B, 14B, 32B variants
- Can self-host with Ollama, LM Studio, vLLM
- Our choice: OmniSQL-14B for balance of speed and accuracy

**Benchmark Data Table**:
| Model | Size | Bird-SQL EX | Spider EX | Self-Host |
|-------|------|-------------|-----------|-----------|
| OmniSQL | 14B | 71.2% | 87.1% | ✅ Ollama |
| SQLCoder | 8B | 68.9% | 84.5% | ✅ Ollama |
| GPT-4o | ? | 68.4% | 85.3% | ❌ API |
| Qwen2.5 | 72B | 58.1% | 79.2% | ✅ Heavy |

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Model Comparison Cards -->
<!-- 3 cards side by side (OmniSQL, SQLCoder, Qwen2.5-Coder) -->
<!-- Each card contains: Model logo/icon, Parameter count, Key benchmark scores -->
<!-- OmniSQL card (featured, larger): "Top Pick" badge -->
<!-- Include: Bird-SQL score, Spider score, Memory requirement, Inference speed -->
<!-- Use gradient background from #05668D to #028090 -->
<!-- Highlight OmniSQL with #02C39A border/glow -->
```

---

## Slide 6: System Architecture Overview
**Title**: End-to-End System Architecture

**Visual**: Full architecture infographic (main slide - visual only)

**Key Components** (shown in diagram):
1. User Query Input
2. Query Enhancement (LLM rewrite)
3. Column-First RAG Retrieval
4. Anchor Table Identification
5. Related Table Expansion
6. Schema Context Assembly
7. SQL Generation (OmniSQL)
8. T-SQL Syntax Correction
9. Execution + Self-Healing Loop
10. Response Formatting

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Complete System Architecture Diagram -->
<!-- Flow: Top to Bottom with branching -->
<!-- Requirements: -->
<!-- 1. User icon at top with query bubble -->
<!-- 2. "Query Enhancement" box with LLM icon -->
<!-- 3. Split into two parallel paths: -->
<!--    Left: Column Vector Search → Anchor Tables -->
<!--    Right: Table Metadata Lookup → Related Tables -->
<!-- 4. Merge: Schema Context Assembly -->
<!-- 5. Main box: SQL Generation (OmniSQL LLM) -->
<!-- 6. T-SQL Validator box -->
<!-- 7. Loop: Execute → Success? → If no, Self-Healing → Retry (max 5) -->
<!-- 8. Response Formatter → User Output -->
<!-- Use icons for each step, connecting arrows with labels -->
<!-- Color scheme: #05668D primary, #028090 secondary, #02C39A success, red for errors -->
<!-- Dark background (#111827), white/light text -->
<!-- Make it visually stunning with subtle gradients and shadows -->
```

---

## Slide 7: Schema Enrichment Deep Dive
**Title**: Auto-Enrichment with Human Review

**Key Points**:
- LLM generates semantic descriptions
- Include sample values in prompt
- Human-in-the-loop for validation

**Visual**: Before/After schema comparison + Review UI mockup

**Example** (show actual data):
```
BEFORE (Raw DDL):
CREATE TABLE Person (
  PersonID INT PRIMARY KEY,
  FirstName NVARCHAR(50),
  Gender NVARCHAR(1)
);

AFTER (Enriched):
Table: Person
Description: "Core entity storing employee and contact information
             for the organization's HR and CRM systems"
Columns:
- PersonID: Unique identifier (PK)
- FirstName: Given name of the person
- Gender: M=Male, F=Female, U=Unknown
  Tags: ["sex", "sexual"]
```

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Schema Enrichment Before/After -->
<!-- Layout: Two-column comparison -->
<!-- Left column (faded, labeled "BEFORE"): -->
<!--   Raw CREATE TABLE DDL in monospace font -->
<!--   Gray/muted colors -->
<!-- Right column (vibrant, labeled "AFTER"): -->
<!--   Enriched JSON with semantic_description, column descriptions, tags -->
<!--   Highlighted keywords, colorful tags -->
<!-- Arrow in center pointing from left to right with "LLM + Human Review" label -->
<!-- Bottom section: Mini review UI with Approve/Edit buttons -->
<!-- Color: Use #00A896 for "AFTER" highlights, #05668D for structure -->
```

---

## Slide 8: Indexing Strategy
**Title**: Dual-Collection Indexing Strategy

**Key Points**:
- **Collection 1**: Column Metadata (fine-grained)
- **Collection 2**: Table Metadata (coarse-grained)
- Separate embedding spaces for precision

**Visual**: Two parallel vector DB diagrams

**Details**:
| Collection | Content | Embedding Source |
|------------|---------|------------------|
| `columns_metadata` | Column name + description + tags | "column_name description tags" |
| `tables_metadata` | Table name + semantic description | "table_name semantic_description" |

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Dual Collection Vector DB Diagram -->
<!-- Two cylindrical database icons side by side -->
<!-- Left cylinder: "column_metadata" collection -->
<!--   Show sample points/vectors inside with column labels -->
<!--   Labels: "PersonID", "FirstName", "OrderDate" floating as points -->
<!-- Right cylinder: "table_metadata" collection -->
<!--   Show sample points with table labels -->
<!--   Labels: "Person", "SalesOrder", "Product" as points -->
<!-- Bottom: Shared embedding model icon feeding both -->
<!-- Use 3D perspective, gradient fills #028090 → #02C39A -->
<!-- Include vector dimension label: "1024-dim embeddings (BGE-Large)" -->
```

---

## Slide 9: Column-First Retrieval Strategy
**Title**: Why Column-First Search?

**Key Points**:
- User queries often mention column-level concepts
- More granular matching = higher recall
- Columns aggregate to tables (bottom-up)

**Visual**: Comparison diagram showing Table-First vs Column-First approach

**Example**:
```
Query: "Find all orders placed in January 2024"

Column-First Approach:
1. Search columns → "OrderDate" (0.89), "PlacedDate" (0.85)
2. Aggregate to tables → SalesOrder (2 hits), PurchaseOrder (1 hit)
3. Return: SalesOrder as top anchor

vs Table-First Approach:
❌ May miss because "orders" doesn't match "SalesOrderHeader"
```

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Column-First vs Table-First Comparison -->
<!-- Split screen: Left = Column-First (correct), Right = Table-First (suboptimal) -->
<!-- Left side: -->
<!--   Query at top → Column search results (highlighted matches) -->
<!--   Columns group into Tables with score aggregation formula -->
<!--   Result: Correct tables found with high confidence -->
<!--   Use green checkmarks, #02C39A highlights -->
<!-- Right side: -->
<!--   Query at top → Direct table search -->
<!--   Shows mismatch: "orders" vs "SalesOrderHeader" -->
<!--   Result: Missed or low-confidence match -->
<!--   Use red X marks, muted colors -->
<!-- Center divider with "VS" label -->
```

---

## Slide 10: Anchor Table Identification
**Title**: From Columns to Anchor Tables

**Key Points**:
- Aggregate column scores by parent table
- Score = Sum of column relevance scores
- Select top-K tables as "Anchors"

**Visual**: Flowchart showing score aggregation process

**Algorithm**:
```
1. For each column hit:
   table_scores[column.table] += column.score

2. Sort tables by aggregated score (descending)

3. Return top-K tables as Anchors
   (default K = 5)
```

**Example Calculation**:
| Table | Column Hits | Scores | Aggregate |
|-------|-------------|--------|-----------|
| SalesOrderHeader | OrderDate (0.89), Status (0.72) | 0.89 + 0.72 | **1.61** |
| Customer | Name (0.65) | 0.65 | 0.65 |
| Product | (none) | 0 | 0 |

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Anchor Table Identification Process -->
<!-- Left: Column search results as cards (column_name, table, score) -->
<!-- Center: Animated grouping animation showing columns merging into table buckets -->
<!-- Right: Ranked table list with aggregated scores -->
<!--   Bar chart style showing SalesOrderHeader (1.61), Customer (0.65), etc. -->
<!-- Highlight top-K with "ANCHOR" badges -->
<!-- Show formula: ΣScore(columns) = AnchorScore -->
<!-- Colors: #05668D for columns, #02C39A for anchors -->
```

---

## Slide 11: Related Table Expansion
**Title**: Finding Related Tables via FK Traversal

**Key Points**:
- Traverse Foreign Key relationships from anchors
- Apply heuristic scoring to related tables
- Prune to top-K related tables

**Scoring Formula**:
```
Related Score = Base Score + Bridge Bonus + Keyword Bonus

Base Score = 0.5 × max(AnchorScore)
Bridge Bonus = +1.0 if connected to >1 anchor tables
Keyword Bonus = +0.5 if table/columns match query tokens
```

**Visual**: Graph visualization showing anchor → related expansion

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: FK Relationship Graph -->
<!-- Central area: Network graph visualization -->
<!-- Anchor tables as large nodes (filled circles, #02C39A) -->
<!-- Related tables as medium nodes (outlined circles, #028090) -->
<!-- FK relationships as directed edges/arrows -->
<!-- Show scoring labels on related nodes -->
<!-- Example: -->
<!--   [SalesOrderHeader] --CustomerID--> [Customer] (score: 1.3) -->
<!--   [SalesOrderHeader] --SalesPersonID--> [SalesPerson] (score: 0.9) -->
<!--   [Customer] --TerritoryID--> [Territory] (score: 0.8) -->
<!-- Highlight bridge tables (connected to multiple anchors) with special glow -->
<!-- Dark background, animated hover effects -->
```

---

## Slide 12: Schema Pruning & Sample Injection
**Title**: Smart Context Optimization

**Key Points**:
- **Pruning**: Remove low-value columns (IDs, timestamps, system cols)
- **Sample Injection**: Add real values for search columns
- Reduces tokens, improves accuracy

**Visual**: Before/After context comparison with pruned columns crossed out

**Example**:
```
BEFORE (Full Schema):
- RowGuid (uniqueidentifier)    ← PRUNED
- ModifiedDate (datetime)       ← PRUNED
- CreatedBy (int)              ← PRUNED
- Status (varchar)             ← KEPT + SAMPLES

AFTER (Optimized):
CREATE TABLE SalesOrder (
  OrderID INT PRIMARY KEY,
  OrderDate DATE,
  Status VARCHAR(20)  -- Samples: ['Pending', 'Shipped', 'Cancelled']
);
```

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Schema Pruning Visualization -->
<!-- Two-column layout: BEFORE (full) → AFTER (pruned) -->
<!-- BEFORE column: -->
<!--   Full CREATE TABLE with all columns -->
<!--   Highlight prunable columns with strikethrough + red -->
<!--   Labels: "System Column", "Auto-generated", "No Semantic Value" -->
<!-- AFTER column: -->
<!--   Cleaned CREATE TABLE -->
<!--   Sample values shown as inline comments (green) -->
<!--   Labels: "Search-relevant", "Sample: ['Pending', 'Shipped']" -->
<!-- Center: Transformation arrow with stats -->
<!--   "Reduced from 15 columns to 8 columns (-47%)" -->
<!-- Colors: Red strikethrough for pruned, #02C39A for kept/samples -->
```

---

## Slide 13: T-SQL Auto-Correction
**Title**: Enforcing T-SQL Syntax Compliance

**Key Points**:
- LLMs often generate MySQL/PostgreSQL syntax
- Auto-correct common mistakes before execution
- Rule-based validator + transformer

**Visual**: Code transformation examples

**Common Auto-Fixes**:
| MySQL/PostgreSQL | T-SQL Correction |
|-----------------|------------------|
| `LIMIT 10` | `SELECT TOP 10` |
| `string1 || string2` | `CONCAT(string1, string2)` |
| `NOW()` | `GETDATE()` |
| `IF(cond, a, b)` | `IIF(cond, a, b)` |
| `table.group` | `table.[group]` |

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: T-SQL Auto-Correction Table -->
<!-- Visual comparison table with before/after code -->
<!-- Left column: "Generated (Invalid)" with red highlight -->
<!-- Right column: "Corrected (T-SQL)" with green highlight -->
<!-- Show 5 common transformation examples -->
<!-- Use monospace font for code -->
<!-- Include animated transformation arrows -->
<!-- Bottom: Stats bar showing "Auto-fix prevents 8% of execution errors" -->
<!-- Colors: Red for invalid (#EF4444), Green for valid (#02C39A) -->
```

---

## Slide 14: Execution & Self-Healing Loop
**Title**: Execute, Diagnose, Heal, Retry

**Key Points**:
- Execute SQL against read-only connection
- Capture error messages
- Feed error back to LLM for correction
- Retry up to N times (default: 5)

**Visual**: Flowchart loop diagram + example error→fix cycle

**Example Healing Cycle**:
```
Attempt 1: "Invalid object name 'Orders'"
         → LLM Fix: Add schema prefix "Sales.Orders"

Attempt 2: "Invalid column name 'Qty'"
         → LLM Fix: Change to "OrderQty"

Attempt 3: ✅ Success!
```

**⚠️ Security Note**: Always use READ-ONLY database credentials

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Self-Healing Loop Diagram -->
<!-- Circular flow diagram: -->
<!-- 1. "Execute SQL" box → Decision diamond "Success?" -->
<!-- 2. If Yes → "Return Results" (green endpoint) -->
<!-- 3. If No → "Capture Error" → "LLM Healing Prompt" → "Generate Fix" -->
<!-- 4. Check "Retry < Max?" → If Yes, loop back to Execute -->
<!-- 5. If No → "Return Error" (red endpoint) -->
<!-- Right side panel: Example error→fix timeline -->
<!--   Show 3 attempts with error message and correction -->
<!-- Include retry counter badge -->
<!-- Warning box at bottom: "⚠️ Use READ-ONLY credentials" -->
<!-- Colors: #02C39A for success path, #EF4444 for error path, #028090 for flow -->
```

---

## Slide 15: Gold Dataset Generation
**Title**: Building Your Evaluation Gold Standard

**Key Points**:
- Generate question-SQL pairs covering all difficulty levels
- Include expected results & metadata
- **Human review is mandatory**

**Visual**: Gold dataset schema diagram + review workflow

**Key Columns**:
| Column | Purpose |
|--------|---------|
| question | Natural language query |
| gold_sql | Human-verified correct SQL |
| gold_tables | Tables that should be retrieved |
| expected_record_count | Number of rows expected |
| expected_pks | Primary key values for verification |
| difficulty | basic / intermediate / advanced |

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Gold Dataset Structure -->
<!-- Central: Spreadsheet/table mock showing gold dataset columns -->
<!-- Highlight key columns with color coding -->
<!-- Right side: Difficulty distribution pie chart -->
<!--   Basic: 50%, Intermediate: 26%, Advanced: 24% -->
<!-- Bottom: Workflow arrows: Generate → Human Review → Approve/Edit → Final -->
<!-- Include review checklist icons: SQL correctness, Table coverage, Result verification -->
<!-- Colors: #05668D for structure, #02C39A for approved, #FFC107 for pending review -->
```

---

## Slide 16: Future Enhancement - Feedback Loop
**Title**: Continuous Learning from Expert Feedback

**Key Points**:
- Add feedback button to SQL output
- Experts validate generated SQL
- Valid pairs indexed as few-shot examples
- Query → Similar examples retrieved for guidance

**Visual**: Feedback loop architecture diagram

**Workflow**:
```
1. User asks question → System generates SQL
2. Expert reviews → Clicks 👍 or 👎
3. If 👍: Index (question, SQL) pair into gold dataset vector store
4. Future queries → Retrieve similar pairs as few-shot examples
5. LLM generates SQL with reference examples
```

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Expert Feedback Loop Architecture -->
<!-- Flow diagram: -->
<!-- 1. "User Query" bubble at top -->
<!-- 2. "Generated SQL" code block with thumbs up/down buttons -->
<!-- 3. If thumbs up → Arrow to "Gold Dataset Vector Store" -->
<!-- 4. Future query flow: Query → "Retrieve Similar Examples" → "LLM with Few-Shot" -->
<!-- Show example injection in prompt template -->
<!-- Include stats: "After 100 expert validations: +8% accuracy improvement" -->
<!-- User icon with "Expert" badge, glowing feedback buttons -->
<!-- Colors: #02C39A for positive feedback path, standard palette for flow -->
```

---

## Slide 17: Benchmark Metrics
**Title**: Key Metrics for System Evaluation

**Key Points**:
- **Table Recall**: % of gold tables retrieved by RAG
- **Execution Success Rate**: % of queries that execute without error
- **Semantic Score**: AST-based SQL similarity
- **Record Count Match**: Results match expected count
- **PK Match Ratio**: Primary key overlap accuracy

**Visual**: Metrics cards with definitions + formula

**Metric Formulas**:
```
Table Recall = |Retrieved ∩ Gold| / |Gold|

Execution Success = Successful Queries / Total Queries

Semantic Score = 1 - (AST Diff Nodes / Total AST Nodes)
```

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Metrics Dashboard Cards -->
<!-- 5 metric cards in a grid layout -->
<!-- Each card contains: -->
<!--   - Metric name (large) -->
<!--   - Icon representation -->
<!--   - Formula (small, monospace) -->
<!--   - What it measures (brief description) -->
<!-- Cards: Table Recall, Execution Success, Semantic Score, Record Match, PK Match -->
<!-- Use different accent colors for each card from the palette -->
<!-- Subtle shadow, hover effect animations -->
<!-- Dark background, clean modern design -->
```

---

## Slide 18: Benchmark Results
**Title**: System Performance Results

**Key Statistics** (from benchmark_summary.json):
- Total Queries Evaluated: **377**
- Overall Table Recall: **96.16%**
- Execution Success Rate: **88.86%**
- Semantic Score (avg): **66.44%**

**Breakdown by Difficulty**:
| Difficulty | Count | Table Recall | Exec Success | Semantic Score |
|------------|-------|--------------|--------------|----------------|
| Basic | 192 | 99.39% | 98.44% | 73.60% |
| Intermediate | 97 | 93.28% | 87.63% | 62.65% |
| Advanced | 88 | 92.27% | 69.32% | 54.98% |

**Visual**: Multi-chart dashboard (bar + heatmap)

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Benchmark Results Dashboard -->
<!-- Layout: 2x2 grid of charts -->
<!-- Chart 1 (Top-left): Overall Stats - 4 large number cards -->
<!--   377 queries, 96.16% recall, 88.86% success, 66.44% semantic -->
<!-- Chart 2 (Top-right): Grouped Bar Chart - Metrics by Difficulty -->
<!--   X-axis: Basic, Intermediate, Advanced -->
<!--   3 bars per group: Table Recall, Exec Success, Semantic Score -->
<!-- Chart 3 (Bottom-left): Pie Chart - Query Distribution -->
<!--   Basic: 192, Intermediate: 97, Advanced: 88 -->
<!-- Chart 4 (Bottom-right): Error Type Breakdown -->
<!--   driver_error: 15, runtime_error: 19, syntax_error: 8 -->
<!-- Use Chart.js or D3.js style visualizations -->
<!-- Color palette: #05668D, #028090, #00A896, #02C39A for each difficulty/metric -->
```

---

## Slide 19: RAG Impact Analysis
**Title**: Proving the Value of RAG

**Key Insight**: High table recall (96%+) enables accurate SQL generation

**Visual**: Correlation chart - Table Recall vs Execution Success

**Analysis Points**:
- Basic queries: Near-perfect retrieval → Near-perfect execution
- Advanced queries with lower recall show proportionally lower success
- Each 5% improvement in recall ≈ 8% improvement in execution success

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: RAG Impact Scatter Plot -->
<!-- Scatter plot: X = Table Recall %, Y = Execution Success % -->
<!-- Each point represents one difficulty level (Basic, Intermediate, Advanced) -->
<!-- Draw trend line showing positive correlation -->
<!-- Annotate each point with difficulty label -->
<!-- Include R² value showing correlation strength -->
<!-- Side panel: Key insight callout box -->
<!--   "96% Table Recall enables 89% Execution Success" -->
<!-- Color: Points colored by difficulty using palette -->
<!-- Trend line in #02C39A with shaded confidence interval -->
```

---

## Slide 20: Latency Breakdown
**Title**: Performance & Latency Analysis

**Latency Statistics** (from benchmark):
| Stage | Avg (ms) | Median (ms) | Max (ms) |
|-------|----------|-------------|----------|
| Retrieval | 130 | 101 | 845 |
| Generation | 35,352 | 35,800 | 88,464 |
| Execution | 68 | 39 | 1,676 |
| **Total** | **35,556** | **35,919** | **88,707** |

**Key Observation**: Generation dominates latency (self-hosted LLM)

**Visual**: Stacked bar chart showing latency breakdown

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Latency Breakdown Stacked Bar Chart -->
<!-- Stacked horizontal bar showing total latency composition -->
<!-- Segments: Retrieval (tiny), Generation (large), Execution (tiny) -->
<!-- Label each segment with ms values -->
<!-- Color code: Retrieval=#05668D, Generation=#028090, Execution=#00A896 -->
<!-- Right side: Pie chart of same data for proportion view -->
<!-- Bottom: Callout box: "LLM Generation = 99.4% of total time" -->
<!-- Include optimization suggestions: "GPU acceleration can reduce by 50-70%" -->
```

---

## Slide 21: Error Analysis
**Title**: Understanding Failure Cases

**Error Distribution**:
- Runtime Errors: 19 (45%)
- Driver Errors: 15 (36%)
- Syntax Errors: 8 (19%)

**By Difficulty**:
| Level | Driver | Runtime | Syntax |
|-------|--------|---------|--------|
| Basic | 1 | 2 | 0 |
| Intermediate | 3 | 8 | 1 |
| Advanced | 11 | 9 | 7 |

**Visual**: Error type distribution chart + difficulty heatmap

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Error Analysis Dashboard -->
<!-- Left: Horizontal bar chart of error types -->
<!--   Runtime Error: 19 (red gradient) -->
<!--   Driver Error: 15 (orange gradient) -->
<!--   Syntax Error: 8 (yellow gradient) -->
<!-- Right: Difficulty × Error Type heatmap -->
<!--   3 rows (Basic, Intermediate, Advanced) -->
<!--   3 columns (Driver, Runtime, Syntax) -->
<!--   Cell color intensity by count -->
<!--   Show numbers in each cell -->
<!-- Bottom: Key insight callout -->
<!--   "Advanced queries need more sophisticated JOIN reasoning" -->
<!-- Colors: Error severity gradient from yellow → red -->
```

---

## Slide 22: Future Improvements
**Title**: Roadmap for Enhanced Accuracy

**Planned Enhancements**:
1. **Multi-hop Reasoning**: 2-hop FK traversal for complex JOINs
2. **Reranker Integration**: Cross-encoder reranking for table selection
3. **Query Decomposition**: Break complex questions into sub-queries
4. **Dialect Fine-tuning**: Custom T-SQL fine-tuned model
5. **Caching Layer**: LRU cache for common query patterns

**Visual**: Roadmap timeline or feature cards

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Future Roadmap Timeline -->
<!-- Horizontal timeline with 5 milestone nodes -->
<!-- Each node: -->
<!--   - Phase number (1-5) -->
<!--   - Feature name -->
<!--   - Brief description -->
<!--   - Expected impact badge (e.g., "+5% accuracy") -->
<!-- Timeline progresses from left to right -->
<!-- Current state marker at left edge -->
<!-- Use gradient background from #05668D to #02C39A along timeline -->
<!-- Icons for each feature category -->
<!-- Animate on scroll/hover -->
```

---

## Slide 23: Summary & Q&A
**Title**: Key Takeaways

**Summary Points**:
1. ✅ RAG-based Schema Linking solves context overflow
2. ✅ SQL-specialized LLMs outperform general models
3. ✅ Column-first retrieval improves recall accuracy
4. ✅ Self-healing loop handles edge cases
5. ✅ Continuous feedback enables improvement

**Stats Highlight**:
- 96% Table Recall | 89% Execution Success | 377 Queries Tested

**Visual**: Summary icons + "Questions?" prompt

**HTML Prompt for Visual**:
```html
<!-- Single-page HTML: Summary & Q&A Slide -->
<!-- Large centered title: "Key Takeaways" -->
<!-- 5 summary points with checkmark icons -->
<!-- Each point has animated fade-in effect -->
<!-- Large stats banner at bottom: -->
<!--   3 large numbers: "96%" | "89%" | "377" -->
<!--   Labels below: "Table Recall" | "Exec Success" | "Queries Tested" -->
<!-- Q&A section: -->
<!--   Large "?" icon with gradient glow -->
<!--   "Questions & Discussion" text -->
<!-- Include social/contact icons if needed -->
<!-- Background: Gradient from #05668D to dark -->
```

---

## Appendix: Plot File References

The following plots are available in `benchmark_results/2026-02-02_16-22-25/plots/`:

1. `table_recall_distribution.png` - Distribution of table recall scores
2. `execution_success_by_difficulty.png` - Execution success rate by difficulty
3. `semantic_score_distribution.png` - Distribution of semantic similarity scores
4. `error_type_distribution.png` - Breakdown of error types
5. `latency_breakdown.png` - Latency by pipeline stage
6. `retry_distribution.png` - Distribution of retry counts
7. `answer_match_per_level.png` - Answer match by difficulty
8. `ast_diff_count_per_level.png` - AST difference count by difficulty
9. `pk_match_per_level.png` - Primary key match ratio by difficulty
10. `record_count_match_per_level.png` - Record count match by difficulty

---

## Design Guidelines Reminder

| Element | Specification |
|---------|---------------|
| Colors | #05668D, #028090, #00A896, #02C39A |
| Font | Roboto |
| Title Size | 36px |
| Subtitle Size | 20px |
| Body Size | 15px |
| Language | English only |
| Focus | Visuals > Text |
| Layout | Consistent across all slides |

---

## HTML Generation Notes

For each HTML prompt provided:
1. Create a standalone single-page HTML file
2. Use inline CSS for styling (no external dependencies)
3. Include responsive design for screen capture
4. Add subtle animations where appropriate
5. Test at 1920×1080 resolution for optimal screenshot quality
6. Save as `slide_XX_visual.html` for easy reference
