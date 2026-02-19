# Ultimate MCP Server

Complete Deployment and Usage Guide

103 Tools | 7 Categories | Zero Config | Vercel Ready

## Table of Contents

- [What Is Model Context Protocol (MCP)?](#what-is-model-context-protocol-mcp)
- [Why Use This All-in-One Server?](#why-use-this-all-in-one-server)
- [What You Need Before Starting](#what-you-need-before-starting)
- [Where Is the Config File?](#where-is-the-config-file)
- [Setup in Cursor](#setup-in-cursor)
- [Verification](#verification)
- [Tool Categories](#tool-categories)
- [How to Use with Claude (Ask Naturally)](#how-to-use-with-claude-ask-naturally)
- [Common Issues and Fixes](#common-issues-and-fixes)

## What Is Model Context Protocol (MCP)?

MCP is an open standard by Anthropic that lets AI assistants like Claude connect to external tools and data sources. Think of it like a USB-C port for AI: one standard connector, unlimited devices.

## Why Use This All-in-One Server?

Instead of deploying and managing 5-10 different MCP servers (one for text, one for math, one for business tools), this single server replaces them all. Connect once and unlock everything.

## What You Need Before Starting

### Install Prerequisites

Install all required tools first (run once on your machine).

### Deployment Steps

1. Step 1 - Get the code.
2. Step 2 - Install dependencies.
3. Step 3 - Login to Vercel.
4. Step 4 - Deploy.
5. Step 5 - Verify deployment.

## Where Is the Config File?

### Option A - Using `mcp-remote` (Recommended)

This is the simplest method. It uses `npx` to automatically handle the HTTP-to-MCP bridge.

### Option B - Direct HTTP Connection (Advanced Clients)

Some MCP clients (like Cursor) support direct HTTP connections without `npx`.

### Final Step

Restart Claude Desktop after updating your config.

## Setup in Cursor

1. Open Cursor.
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows).
3. Search for `Cursor Settings` and open Settings.
4. Navigate to `Features -> MCP Servers`.
5. Click `Add MCP Server`.
6. Paste your config and click Save.

## Verification

### Test via Browser

Visit your deployment URLs in the browser to confirm everything works.

### Test via Command Line (`curl`)

Run `curl` checks against your MCP and health endpoints.

## Tool Categories

1. Category 1: Text and Content (20 tools)
   Example: Summarize text
   Example: Convert text case
2. Category 2: Data and Math (15 tools)
   Example: Compound interest
3. Category 3: Web and Research (12 tools)
   Example: Generate SEO meta tags
4. Category 4: Date and Time (10 tools)
   Example: Timezone converter
5. Category 5: Business and Finance (12 tools)
   Example: Invoice generator
6. Category 6: Developer Tools (11 tools)
   Example: Generate mock data
7. Category 7: AI Prompts and Templates (10 tools)

## How to Use with Claude (Ask Naturally)

### Marketing and Content

- Generate SEO meta tags for my SaaS landing page about project management.
- Write 5 cold outreach emails for our B2B product launch.
- Create a 4-week content calendar for our LinkedIn + Twitter.
- Generate a press release for our Series A funding announcement.
- Summarize this 5000-word whitepaper into 5 key points.
- Check if this blog post is readable for a 10th-grade level.
- Convert all these usernames to lowercase slug format for our URLs.
- Count words in this article; we need it under 1500 words.

### Finance and Business Operations

- Generate an invoice for my client: 3 line items, 8% tax, net 30.
- Calculate our gross margin: $150K revenue, $95K COGS.
- What is our break-even point? $50K fixed costs, $200 price, $80 variable cost.
- Analyze this cash flow: income list and expense list for Q3.
- Calculate NPV: $100K investment, cash flows $30K/year for 5 years at 10%.
- Create a SWOT analysis template for our e-commerce business.
- Build a business plan outline for a SaaS startup in HR tech.
- Track our KPIs: $500K revenue, 2500 customers, 150 lost this month.
- What is our LTV:CAC ratio? $300 CAC, 3% monthly churn, $150 ARPU.
- Convert $85,000 annual salary to hourly rate.
- Create a 50/30/20 budget for $7,500 monthly income.
- Calculate ROI on our $50K trade show investment that generated $180K.

### Developer Productivity

- Generate 20 UUIDs for my database seed script.
- Write the SQL to get all users ordered by signup date with pagination.
- Scaffold REST API endpoints for a `products` resource.
- Give me 50 mock user records for our integration tests.
- Generate the regex pattern for validating US phone numbers.
- Parse this cron expression and tell me when it runs: `0 9 * * 1-5`.
- Create a conventional commit message for adding authentication.
- Check the cyclomatic complexity of this function.
- Generate a `.env` template for a Node.js Express API.
- Create a color palette from our brand color `#2563EB`.
- Build a SQL `INSERT` query for the users table.
- Generate 10 mock orders with random statuses for testing.

### Data and Research

- Convert this JSON API response to a CSV I can open in Excel.
- Parse and validate this JSON file and show me the structure.
- Calculate statistics for these sales numbers: `[1200, 1450, ...]`.
- Convert 50 miles to kilometers.
- What is 15% of $847.50? (tip calculation)
- How many working days between January 15, 2025 and March 30, 2025?
- Calculate BMI for 75kg and 178cm.
- What is $10,000 at 7% compound interest for 25 years?
- Convert this CSV to JSON for our API.

### Writing and Editing

- Extract all email addresses from this newsletter subscriber dump.
- Find and replace `customer` with `client` throughout this document.
- Compare these two contract versions and show what changed.
- Encode this data as Base64 for our API header.
- Generate 10 strong passwords for our team's shared accounts.
- Truncate these 50 product descriptions to 150 characters each.
- Convert this Markdown README to HTML for our website.
- Strip all HTML from this scraped content and give me plain text.
- Generate lorem ipsum for 3 paragraphs as placeholder content.
- Is `racecar` a palindrome?

### Scheduling and Time

- How many days until our product launch on December 15?
- Convert our 2 PM EST standup to London, Tokyo, and Sydney times.
- What week number is March 15, 2025?
- Is July 4, 2025 a US federal holiday?
- Add 90 days to March 1, 2025. What is the deadline?
- How many business days between our kick-off and delivery dates?
- Show me the calendar for October 2025.
- Convert this Unix timestamp to a readable date: `1735689600`.

### HR and Recruiting

- Write a job description for a Senior Backend Engineer, remote, $150-200K.
- Generate a meeting agenda for our quarterly planning session (90 min).
- Create a 1-on-1 agenda for a manager-IC meeting.
- Write user stories for the `team notifications` feature.
- Generate OKRs for our engineering team for Q2.
- Draft a rejection email for a candidate we loved but cannot hire.
- Write a follow-up email after a sales discovery call.
- Generate a welcome email for new employee onboarding.

## Common Issues and Fixes

### Validate Your Config JSON

Paste your `claude_desktop_config.json` into a JSON validator and confirm it is valid before restarting your client.

### Adding Your Own Tools

Adding a new tool is simple: add it to the `TOOLS` object in `api/mcp.js`.

### Connecting to External APIs

To add real-time data (weather, stocks, news), add API calls in your tool handlers.

Your Ultimate MCP Server is ready to power 103 tools.
