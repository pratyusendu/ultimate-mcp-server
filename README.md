# 🚀 Ultimate All-in-One MCP Server

> **One MCP server. 103 tools. Every task covered.**  
> Deploy to Vercel in 2 minutes. Plug into Claude, Cursor, or any MCP client instantly.

---

## 📦 What's Inside

| Category | Tools | Count |
|----------|-------|-------|
| 📝 Text & Content | Summarize, extract, encode, generate | 20 |
| 🔢 Data & Math | Calculator, stats, finance, units | 15 |
| 🌐 Web & Research | SEO, JSON/CSV, HTML, QR codes | 12 |
| 📅 Date & Time | Format, diff, timezone, calendar | 10 |
| 💼 Business & Finance | Invoices, KPIs, NPV, budgets | 12 |
| 💻 Developer Tools | UUIDs, SQL, Regex, mock data | 11 |
| 🤖 AI Prompts & Templates | System prompts, OKRs, emails | 10 |
| **Total** | | **103** |

---

## ⚡ Deploy to Vercel (2 minutes)

### Option 1: One-click deploy
```bash
# Clone and deploy
git clone <this-repo>
cd ultimate-mcp-server
vercel deploy --prod
```

### Option 2: Manual
1. Create a Vercel account at vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in this directory
4. Copy your deployment URL (e.g., `https://my-mcp.vercel.app`)

---

## 🔌 Connect to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ultimate-mcp": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://YOUR-URL.vercel.app/mcp"]
    }
  }
}
```

Restart Claude Desktop. Done! ✅

---

## 🔌 Connect to Cursor

In Cursor Settings → MCP → Add server:
```json
{
  "ultimate-mcp": {
    "url": "https://YOUR-URL.vercel.app/mcp"
  }
}
```

---

## 🔌 Connect via any MCP HTTP client

```bash
# MCP endpoint
POST https://YOUR-URL.vercel.app/mcp

# List tools
POST https://YOUR-URL.vercel.app/mcp
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"method":"tools/list"}

# Call a tool
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"word_count","arguments":{"text":"Hello world"}}}
```

---

## 📋 100+ Use Cases

### Text & Writing
1. Summarize long documents or emails
2. Count words for blog posts
3. Extract all emails from a CSV dump
4. Extract links from web-scraped content
5. Extract phone numbers from text
6. Convert titles to URL slugs
7. Convert variable names between camelCase/snake_case
8. Find & replace across documents with regex
9. Compare two document versions
10. Truncate product descriptions
11. Generate placeholder text for mockups
12. Check if a phrase is a palindrome
13. Analyze top keywords in text
14. Validate email formats in bulk
15. Validate URLs before publishing
16. Encode data in Base64 for APIs
17. Generate secure passwords for accounts
18. Suggest usernames for new users
19. Check if content is readable for target audience
20. Check anagram puzzle answers

### Math & Data
21. Calculate complex expressions
22. Convert miles to kilometers
23. Convert Celsius to Fahrenheit
24. Calculate percentage discounts
25. Get statistical summary of a dataset
26. Check if large numbers are prime
27. Generate Fibonacci sequence for puzzles
28. Calculate BMI for fitness apps
29. Compound interest projections
30. Monthly loan/mortgage payment
31. Convert USD to EUR/JPY/etc.
32. Convert numbers to Roman numerals
33. Format large numbers with commas
34. Split restaurant bills with tip
35. Calculate prices with tax

### Web & Developer Productivity
36. Generate SEO meta tags for any page
37. Generate robots.txt for new sites
38. Look up what a 503 error means
39. Convert HEX color to RGB for CSS
40. Generate QR code for a URL or contact
41. Validate and pretty-print JSON
42. Convert JSON API response to CSV
43. Import CSV data as JSON
44. Convert README markdown to HTML
45. Strip HTML from scraped content
46. Generate XML sitemap for all pages
47. Parse browser User-Agent strings
48. Generate UUIDs for database records
49. Generate hash checksums for files
50. Look up regex for email validation
51. Analyze code complexity
52. Scaffold RESTful API endpoints
53. Build SQL SELECT/INSERT queries
54. Generate realistic test/mock data
55. Generate UI color palettes
56. Parse & explain cron schedules
57. Create git commit messages
58. Generate .env file templates

### Date & Time
59. Format dates for different regions
60. Calculate days between contract dates
61. Add 30 days to a date
62. Count working days for project estimates
63. Convert 9 AM NYC to Tokyo time
64. Count down to product launch
65. Generate October 2025 calendar
66. Convert Unix timestamps to readable dates
67. Find which week of year a date is
68. Check if a date is a US holiday

### Business & Finance
69. Generate invoice data for billing
70. Calculate gross and net margins
71. Analyze monthly cash flow
72. Calculate NPV of an investment
73. Find break-even units for a product
74. Convert annual salary to hourly
75. Calculate stock trade returns
76. Create 50/30/20 budget breakdown
77. Track business KPIs in one call
78. Generate business plan outline
79. Create SWOT analysis framework
80. Calculate marketing campaign ROI

### AI & Content Production
81. Generate system prompts for AI agents
82. Wrap questions in CoT reasoning
83. Build few-shot examples for AI
84. Generate cold outreach email
85. Write job descriptions
86. Create meeting agendas
87. Write Agile user stories
88. Generate quarterly OKRs
89. Plan a weekly content calendar
90. Draft press releases

### Advanced Combinations
91. Validate emails → Extract stats → Word count
92. CSV → JSON → statistics analysis
93. Generate invoice → Calculate tax → ROI
94. Timezone convert → Calendar generate → Add business days
95. Generate mock users → Hash IDs → Create UUIDs
96. Extract URLs → Validate → Generate sitemap
97. Calculate salary → Budget plan → Compound savings
98. Analyze text → Readability → Summarize
99. Generate SQL → Build API endpoint → Mock data
100. Create OKRs → Meeting agenda → Press release
101. Parse JSON response → CSV export → Statistics
102. SWOT analysis → Business plan → KPI tracker
103. SEO meta → Sitemap → Robots.txt full setup

---

## 🏗️ Project Structure

```
ultimate-mcp-server/
├── api/
│   ├── mcp.js          # Main MCP endpoint (103 tools)
│   ├── health.js       # Health check
│   ├── tools.js        # Tools catalog API
│   └── index.js        # Landing page
├── vercel.json         # Vercel routing config
├── package.json        # Dependencies
└── README.md           # This file
```

---

## 🌐 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp` | POST | MCP JSON-RPC endpoint |
| `/health` | GET | Server health check |
| `/tools` | GET | List all tools with categories |
| `/` | GET | Landing page |

---

## 🔧 Local Development

```bash
npm install
npm run dev
# Server runs on http://localhost:3000
```

---

## 🛡️ Environment Variables

No API keys required! All 103 tools run server-side with zero external dependencies.

For extending with real-time data (optional):
```env
# Optional: Add these for real-time features
EXCHANGE_RATE_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
```

---

## 📄 License

MIT — free for personal and commercial use.
"# ultimate-mcp-server" 
