# 📊 Multi-Category Spreadsheet System

The spreadsheet generation system now supports **9 different categories**, each with its own optimized structure, formulas, and styling!

## 🎯 How It Works

### 1. **Category Detection** (Automatic)
When a user provides a prompt, the system automatically detects which category it belongs to:

```typescript
// Example prompts and their detected categories:
"Create a budget tracker" → FINANCIAL
"Track project tasks and milestones" → PROJECT-TRACKER
"Meeting notes with action items" → MEETING-NOTES
"Schedule team events" → CALENDAR
"Simple grocery list" → LIST
"Marketing campaign tracker" → MARKETING
"WIP status board" → WIP-TRACKER
"Event management dashboard" → EVENT-MANAGEMENT
```

### 2. **Template Selection**
Based on the category, the appropriate prompt template is used to guide Claude in generating the perfect structure.

### 3. **Generation**
Claude generates a multi-sheet workbook with:
- Category-specific sheet structure
- Appropriate formulas for that use case
- Relevant styling and colors
- Realistic data for that domain

---

## 🔧 Critical Bug Fixes

### Edit Persistence Fix (April 2026)
**Problem:** User edits (text changes, column widths, colors, tab names) were instantly disappearing after being made.

**Root Cause:** The Y.js collaboration sync was recreating the entire workbook on **every change**, including changes made by the local user. This caused:
- Loss of in-progress edits
- Loss of undo history
- Loss of selection state
- Poor UX

**Solution:** Implemented version tracking in Y.js to distinguish between:
- **Local changes** (skip workbook recreation)
- **Remote changes from other users** (apply by recreating)

Now edits persist correctly and auto-save to the database!

---

## 📋 The 9 Categories

### 💰 1. FINANCIAL
**Best for:** Budgets, P&L, Cash Flow, Financial Models

**Sheet Structure:**
1. Dashboard (KPIs, Charts)
2. Analysis / Model (Formulas, Scenarios)
3. Transactions (Raw Data)
4. Settings (Categories, Vendors)

**Key Formulas:**
- `=SUM()`, `=SUMIFS()` for totals
- `=PMT()` for loan calculations
- `=IF()`, `=VLOOKUP()` for logic

**Example Prompts:**
- "Create a startup financial model"
- "Build a monthly expense tracker"
- "Generate a P&L statement template"

---

### 📊 2. PROJECT TRACKER
**Best for:** Task Management, Sprint Planning, Project Timelines

**Sheet Structure:**
1. Overview (Progress Cards, Milestones)
2. Task Board (Tasks, Status, Assignees)
3. Team & Resources (Workload, Capacity)
4. Settings (Team Members, Statuses)

**Key Formulas:**
- `=COUNTIF()` for task completion
- `=DATEDIF()` for duration
- `=IF(TODAY()>due, "OVERDUE", "OK")`

**Example Prompts:**
- "Create a project tracker for our app development"
- "Build a sprint planning board"
- "Generate a milestone tracking sheet"

---

### 📝 3. MEETING NOTES
**Best for:** Meeting Management, Action Items, Agendas

**Sheet Structure:**
1. Meeting Dashboard (Stats, Recent Meetings)
2. Meeting Log (All Meetings)
3. Action Items (Linked Actions)
4. Attendees & Templates

**Key Formulas:**
- `=COUNTIFS()` for action item tracking
- `=VLOOKUP()` to link actions to meetings
- `=IF(TODAY()>due, "OVERDUE", "")`

**Example Prompts:**
- "Create a meeting notes tracker"
- "Build an action items spreadsheet"
- "Generate a team standup log"

---

### 📅 4. CALENDAR
**Best for:** Event Scheduling, Availability Tracking, Timelines

**Sheet Structure:**
1. Calendar View (Visual Monthly Grid)
2. Events Database (All Events)
3. Availability Matrix (Time Slots)
4. Settings (Event Types, Locations)

**Key Formulas:**
- `=COUNTIFS()` for events per day
- `=TEXT(date, "dddd")` for day names
- `=IF(AND(time>=start, time<=end), "BUSY", "FREE")`

**Example Prompts:**
- "Create a team event calendar"
- "Build a meeting schedule tracker"
- "Generate an availability planner"

---

### 📋 5. LIST (Simple)
**Best for:** TO-DO Lists, Shopping Lists, Inventory, Contacts

**Sheet Structure:**
1. Main List (Items, Status, Category) - **SIMPLE!**
2. Categories (Optional)
3. Archive (Optional)

**Key Formulas:**
- `=COUNTIF()` for completion
- `=COUNTA()` for total items
- Minimal formulas - keep it simple!

**Example Prompts:**
- "Create a grocery shopping list"
- "Build a simple task checklist"
- "Generate an inventory list"

---

### 📱 6. MARKETING
**Best for:** Campaign Tracking, Content Calendars, Analytics

**Sheet Structure:**
1. Campaign Dashboard (KPIs, ROI, Channels)
2. Campaign Tracker (All Campaigns)
3. Content Calendar (Posts, Schedule)
4. Analytics & Settings

**Key Formulas:**
- `=SUMIFS()` for channel spend
- `=(conversions/leads)*100` for conversion rate
- `=(revenue-cost)/cost*100` for ROI

**Example Prompts:**
- "Create a marketing campaign tracker"
- "Build a social media content calendar"
- "Generate a lead generation dashboard"

---

### 🔄 7. WIP TRACKER
**Best for:** Work-in-Progress, Pipeline Management, Workflow

**Sheet Structure:**
1. WIP Dashboard (Pipeline View, Bottlenecks)
2. Items Database (All Items, Stages)
3. Stage History (Audit Log)
4. Team & Capacity

**Key Formulas:**
- `=COUNTIFS()` for stage counts
- `=TODAY()-start` for days in progress
- `=IF(days>7, "BOTTLENECK", "")`

**Example Prompts:**
- "Create a WIP tracker for our design pipeline"
- "Build a workflow status board"
- "Generate a queue management sheet"

---

### 🎭 8. EVENT MANAGEMENT
**Best for:** Corporate Events, Conferences, Production Management

**Sheet Structure:**
1. Guest List (Attendees, Dietary Requirements, Companies)
2. Technical Brief (AV Equipment, Status, Sections: AUDIO/VIDEO/LIGHTING/STAGING)
3. Marketing Budget (Campaign Types, Category Subtotals, Grand Total)
4. Event Timeline (Optional: Minute-by-minute runsheet)

**Design System:**
- Primary: #1a1a2e (Dark Navy)
- Accent: #e85d04 (Burnt Orange)
- Surface: #f8f7f4 (Warm Off-White)
- Success: #2d6a4f (Confirmed status)
- Warning: #e9c46a (Pending status)
- Editorial, data-dense, professional styling

**Key Features:**
- Color-coded company grouping in guest list
- Dietary badges (Vegan, Gluten Free, Allergies)
- Status badges (CONFIRMED/PENDING/TBC) for equipment
- Auto-calculated budget subtotals per category
- FOC (Free of Charge) tagging
- Discrepancy highlighting

**Example Prompts:**
- "Create an event management dashboard"
- "Build a guest list with dietary tracking"
- "Generate a technical brief for conference"
- "Event budget with marketing categories"

---

### 🌐 9. GENERAL (Fallback)
**Best for:** Anything else not covered above

**Sheet Structure:**
- Flexible structure based on user's needs
- Analyzes the prompt to determine appropriate layout

**Example Prompts:**
- "Create a customer feedback log"
- "Build a training schedule"
- "Generate a resource allocation sheet"

---

## 🔧 Technical Implementation

### Detection Logic (`SpreadsheetTemplates.ts`)
```typescript
export function detectSpreadsheetCategory(prompt: string, metadata: any): SpreadsheetCategory {
  const combined = `${prompt.toLowerCase()} ${metadata?.goal?.toLowerCase()}`;

  if (combined.match(/project|task|milestone|gantt/i)) return 'project-tracker';
  if (combined.match(/meeting|agenda|action items/i)) return 'meeting-notes';
  if (combined.match(/calendar|schedule|event/i)) return 'calendar';
  if (combined.match(/\blist\b|checklist|todo/i)) return 'list';
  if (combined.match(/marketing|campaign|social media/i)) return 'marketing';
  if (combined.match(/wip|work in progress|pipeline/i)) return 'wip-tracker';
  if (combined.match(/budget|financial|revenue/i)) return 'financial';
  
  return 'general';
}
```

### Agent Flow
```
User Prompt
    ↓
IntentAgent (understands the goal)
    ↓
SpreadsheetLayoutAgent (detects category, plans architecture)
    ↓
SpreadsheetContentAgent (uses category-specific template)
    ↓
RenderingAgent (converts to Univer JSON)
    ↓
Frontend displays spreadsheet
```

---

## 🎨 Example Outputs

### Financial Spreadsheet
```
Sheet 1: Dashboard
- KPI cards: Total Revenue, Profit Margin, Burn Rate
- Charts data: Monthly trends

Sheet 2: Model
- Assumptions: Growth Rate (15%), Tax (25%)
- Calculations: =B3*'Transactions'!SUM(E:E)

Sheet 3: Transactions
- 50+ rows: Date, Vendor, Amount, Category, Status

Sheet 4: Settings
- Expense Categories, Vendors, Approval Workflow
```

### Project Tracker Spreadsheet
```
Sheet 1: Overview
- Progress: 15 Done, 8 In Progress, 3 Blocked
- Milestones: Launch (2026-05-15), Beta (2026-04-01)

Sheet 2: Task Board
- 30+ tasks: "Setup CI/CD", "Design Homepage", "Write API Docs"
- Status dropdown: Not Started, In Progress, Review, Blocked, Done

Sheet 3: Team
- Team members with current workload

Sheet 4: Settings
- Status options, Priority levels
```

### Simple List Spreadsheet
```
Sheet 1: Main List
- Clean, minimal design
- Items: "Buy milk", "Schedule dentist", "Review contract"
- Checkboxes for completion
- NO complex dashboards or multiple sheets!
```

---

## ✅ Benefits

1. **Context-Aware**: Each category gets the RIGHT structure for its use case
2. **No More Financial Bias**: Lists don't get unnecessary KPI dashboards!
3. **Realistic Data**: Domain-specific data (not "Sample 1, Sample 2")
4. **Appropriate Complexity**: Simple lists stay simple, complex trackers get multiple sheets
5. **Optimized Formulas**: Each category uses the formulas that make sense for it

---

## 🚀 Usage

Simply provide your prompt - the system handles the rest!

```javascript
// Frontend API call
await api.post('/ai/generate', {
  prompt: "Create a marketing campaign tracker",
  output: 'spreadsheet',
  meta: { tone: 'professional' }
});

// Backend automatically:
// 1. Detects category: MARKETING
// 2. Uses marketing template
// 3. Generates campaign-specific structure
// 4. Returns multi-sheet workbook
```

---

## 🔮 Future Enhancements

- [ ] Add more categories (HR, Sales, Customer Support)
- [ ] Allow users to specify category explicitly
- [ ] Create hybrid categories (e.g., "Marketing + Financial")
- [ ] Add custom template builder
