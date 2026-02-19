/**
 * GET /tools — Returns all available tools grouped by category
 */

const TOOL_CATALOG = {
  "Text & Content": [
    "summarize_text", "word_count", "extract_emails", "extract_urls", "extract_phone_numbers",
    "text_to_slug", "text_case_converter", "find_replace", "text_diff", "truncate_text",
    "generate_lorem_ipsum", "palindrome_check", "text_statistics", "validate_email", "validate_url",
    "text_encode_decode", "generate_password", "generate_username", "check_readability", "anagram_checker"
  ],
  "Data & Math": [
    "calculator", "unit_converter", "percentage_calculator", "statistics_calculator", "prime_checker",
    "fibonacci", "bmi_calculator", "compound_interest", "loan_calculator", "currency_converter",
    "roman_numeral_converter", "number_formatter", "tip_calculator", "tax_calculator", "age_calculator"
  ],
  "Web & Research": [
    "generate_seo_meta", "generate_robots_txt", "http_status_lookup", "color_converter", "generate_qr_data",
    "parse_json", "json_to_csv", "csv_to_json", "markdown_to_html", "html_to_text",
    "generate_sitemap", "parse_user_agent"
  ],
  "Date & Time": [
    "date_formatter", "date_difference", "add_time", "working_days_calculator", "timezone_converter",
    "countdown_to", "calendar_generator", "unix_timestamp", "week_number", "is_holiday"
  ],
  "Business & Finance": [
    "invoice_generator", "profit_margin_calculator", "cash_flow_analyzer", "npv_calculator",
    "break_even_analysis", "salary_to_hourly", "stock_return_calculator", "budget_planner",
    "kpi_tracker", "generate_business_plan_outline", "swot_template", "roi_calculator"
  ],
  "Developer Tools": [
    "generate_uuid", "hash_generator", "generate_regex", "code_complexity", "api_endpoint_generator",
    "sql_query_builder", "generate_mock_data", "color_palette_generator", "cron_expression_parser",
    "git_commit_message", "environment_variable_generator"
  ],
  "AI Prompts & Templates": [
    "generate_system_prompt", "chain_of_thought_prompt", "few_shot_template", "email_template_generator",
    "job_description_generator", "meeting_agenda_generator", "user_story_generator", "okr_generator",
    "content_calendar_generator", "press_release_template"
  ]
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const totalTools = Object.values(TOOL_CATALOG).reduce((a, v) => a + v.length, 0);
  
  res.status(200).json({
    server: "Ultimate All-in-One MCP Server",
    version: "1.0.0",
    total_tools: totalTools,
    categories: Object.entries(TOOL_CATALOG).map(([category, tools]) => ({
      category,
      count: tools.length,
      tools
    }))
  });
}
