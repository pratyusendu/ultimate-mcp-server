export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ultimate All-in-One MCP Server</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0f; color: #e0e0f0; min-height: 100vh; }
  header { background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); padding: 60px 20px; text-align: center; border-bottom: 1px solid #1e3a5f; }
  h1 { font-size: 2.8em; font-weight: 800; background: linear-gradient(90deg, #00d2ff, #7b2ff7, #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; }
  .subtitle { color: #8899bb; font-size: 1.2em; max-width: 600px; margin: 0 auto 30px; }
  .badge { display: inline-block; background: #1e3a5f; border: 1px solid #00d2ff; color: #00d2ff; padding: 6px 16px; border-radius: 20px; font-size: 0.9em; margin: 5px; }
  .container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 40px 0; }
  .card { background: #0e1628; border: 1px solid #1e3a5f; border-radius: 12px; padding: 24px; transition: border-color 0.2s; }
  .card:hover { border-color: #00d2ff; }
  .card h3 { color: #00d2ff; margin-bottom: 12px; font-size: 1.1em; }
  .card ul { list-style: none; color: #8899bb; font-size: 0.9em; }
  .card ul li { padding: 3px 0; padding-left: 16px; position: relative; }
  .card ul li::before { content: '→'; position: absolute; left: 0; color: #7b2ff7; }
  .install-box { background: #0e1628; border: 1px solid #7b2ff7; border-radius: 12px; padding: 30px; margin: 30px 0; }
  .install-box h2 { color: #7b2ff7; margin-bottom: 20px; }
  pre { background: #050a14; padding: 16px; border-radius: 8px; overflow-x: auto; color: #a0e4ff; font-size: 0.9em; margin: 10px 0; border: 1px solid #1e3a5f; }
  .stat { text-align: center; padding: 20px; }
  .stat-num { font-size: 3em; font-weight: 800; background: linear-gradient(90deg, #00d2ff, #7b2ff7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-label { color: #8899bb; font-size: 0.9em; }
  .stats-bar { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin: 40px 0; padding: 30px; background: #0e1628; border-radius: 12px; }
  footer { text-align: center; padding: 40px; color: #4a5568; border-top: 1px solid #1e3a5f; }
  a { color: #00d2ff; text-decoration: none; }
  .endpoints { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 20px 0; }
  .endpoint { background: #050a14; padding: 12px; border-radius: 8px; border: 1px solid #1e3a5f; font-family: monospace; font-size: 0.85em; }
  .method { color: #ff6b6b; margin-right: 8px; font-weight: bold; }
  .path { color: #a0e4ff; }
</style>
</head>
<body>
<header>
  <h1>🚀 Ultimate MCP Server</h1>
  <p class="subtitle">All-in-One Model Context Protocol Server with 100+ tools. One server. Every task.</p>
  <div>
    <span class="badge">✓ 103 Tools</span>
    <span class="badge">✓ 7 Categories</span>
    <span class="badge">✓ Vercel Ready</span>
    <span class="badge">✓ Zero Config</span>
  </div>
</header>

<div class="container">
  <div class="stats-bar">
    <div class="stat"><div class="stat-num">103</div><div class="stat-label">Total Tools</div></div>
    <div class="stat"><div class="stat-num">7</div><div class="stat-label">Categories</div></div>
    <div class="stat"><div class="stat-num">∞</div><div class="stat-label">Use Cases</div></div>
    <div class="stat"><div class="stat-num">0</div><div class="stat-label">Setup Required</div></div>
  </div>

  <div class="install-box">
    <h2>⚡ Quick Setup — Claude Desktop</h2>
    <p style="color:#8899bb; margin-bottom:15px;">Add this to your <code>claude_desktop_config.json</code>:</p>
    <pre>{
  "mcpServers": {
    "ultimate-mcp": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://YOUR-VERCEL-URL.vercel.app/mcp"]
    }
  }
}</pre>
    <p style="color:#8899bb; margin-top:15px;">Or connect directly via any MCP-compatible client using:</p>
    <pre>https://YOUR-VERCEL-URL.vercel.app/mcp</pre>
  </div>

  <h2 style="color:#e0e0f0; margin: 30px 0 20px;">🔗 API Endpoints</h2>
  <div class="endpoints">
    <div class="endpoint"><span class="method">POST</span><span class="path">/mcp</span><br><small style="color:#4a5568">MCP Protocol endpoint</small></div>
    <div class="endpoint"><span class="method" style="color:#00d2ff">GET</span><span class="path">/health</span><br><small style="color:#4a5568">Health check</small></div>
    <div class="endpoint"><span class="method" style="color:#00d2ff">GET</span><span class="path">/tools</span><br><small style="color:#4a5568">List all tools</small></div>
  </div>

  <h2 style="color:#e0e0f0; margin: 30px 0 20px;">🛠️ Tool Categories</h2>
  <div class="grid">
    <div class="card">
      <h3>📝 Text & Content (20 tools)</h3>
      <ul>
        <li>Summarize text automatically</li>
        <li>Word/character counter</li>
        <li>Extract emails, URLs, phones</li>
        <li>Case converter (camel, snake...)</li>
        <li>Find & replace with regex</li>
        <li>Password & username generator</li>
        <li>Readability score checker</li>
        <li>Base64 & URL encoder/decoder</li>
      </ul>
    </div>
    <div class="card">
      <h3>🔢 Data & Math (15 tools)</h3>
      <ul>
        <li>Safe expression calculator</li>
        <li>Unit converter (30+ units)</li>
        <li>Statistics (mean, median, std)</li>
        <li>Compound interest calculator</li>
        <li>Loan & mortgage calculator</li>
        <li>Currency converter (30 currencies)</li>
        <li>BMI & health calculators</li>
        <li>Age & date calculations</li>
      </ul>
    </div>
    <div class="card">
      <h3>🌐 Web & Research (12 tools)</h3>
      <ul>
        <li>SEO meta tag generator</li>
        <li>JSON ↔ CSV converter</li>
        <li>Markdown to HTML</li>
        <li>QR code URL generator</li>
        <li>Color converter (HEX/RGB/HSL)</li>
        <li>XML sitemap generator</li>
        <li>User-agent parser</li>
        <li>HTTP status lookup</li>
      </ul>
    </div>
    <div class="card">
      <h3>📅 Date & Time (10 tools)</h3>
      <ul>
        <li>Multi-format date formatter</li>
        <li>Date difference calculator</li>
        <li>Timezone converter</li>
        <li>Working days calculator</li>
        <li>Countdown to events</li>
        <li>Calendar generator</li>
        <li>Unix timestamp converter</li>
        <li>Holiday checker (US Federal)</li>
      </ul>
    </div>
    <div class="card">
      <h3>💼 Business & Finance (12 tools)</h3>
      <ul>
        <li>Invoice data generator</li>
        <li>Profit margin calculator</li>
        <li>NPV & ROI calculator</li>
        <li>Break-even analysis</li>
        <li>Cash flow analyzer</li>
        <li>KPI tracker</li>
        <li>Budget planner (50/30/20)</li>
        <li>SWOT analysis template</li>
      </ul>
    </div>
    <div class="card">
      <h3>💻 Developer Tools (11 tools)</h3>
      <ul>
        <li>UUID generator (batch)</li>
        <li>Regex pattern library</li>
        <li>SQL query builder</li>
        <li>Mock data generator</li>
        <li>API endpoint scaffolder</li>
        <li>Cron expression parser</li>
        <li>Git commit message helper</li>
        <li>Color palette generator</li>
      </ul>
    </div>
    <div class="card">
      <h3>🤖 AI Prompts (10 tools)</h3>
      <ul>
        <li>System prompt generator</li>
        <li>Chain-of-thought templates</li>
        <li>Few-shot prompt builder</li>
        <li>Email template library</li>
        <li>Job description generator</li>
        <li>Meeting agenda builder</li>
        <li>OKR framework generator</li>
        <li>Content calendar planner</li>
      </ul>
    </div>
  </div>
</div>

<footer>
  <p>Ultimate MCP Server — Plug in once, unlock 100+ capabilities</p>
  <p style="margin-top:8px"><a href="/tools">View all tools</a> · <a href="/health">Health check</a></p>
</footer>
</body>
</html>`);
}
