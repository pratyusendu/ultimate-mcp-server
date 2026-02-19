export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'healthy',
    server: 'Ultimate All-in-One MCP Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    tools_available: 103,
    categories: ['Text & Content', 'Data & Math', 'Web & Research', 'Date & Time', 'Business & Finance', 'Developer Tools', 'AI Prompts']
  });
}
