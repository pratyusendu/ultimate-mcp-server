/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║           ULTIMATE ALL-IN-ONE MCP SERVER  v1.0.0                        ║
 * ║           100+ Tools | Deploy on Vercel | Plug & Play                   ║
 * ║                                                                          ║
 * ║  Categories:                                                             ║
 * ║  • Text & Content (20 tools)                                             ║
 * ║  • Data & Math (15 tools)                                                ║
 * ║  • Web & Research (12 tools)                                             ║
 * ║  • Date & Time (10 tools)                                                ║
 * ║  • File & Format (12 tools)                                              ║
 * ║  • Business & Finance (12 tools)                                         ║
 * ║  • Developer Tools (12 tools)                                            ║
 * ║  • AI Prompts & Templates (10 tools)                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { createServer } from 'http';
import { URL } from 'url';

// ─────────────────────────────────────────────────────────────────────────────
// TOOL REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

const TOOLS = {

  // ══════════════════════════════════════════
  // 📝 TEXT & CONTENT TOOLS (20 tools)
  // ══════════════════════════════════════════

  summarize_text: {
    category: "Text & Content",
    description: "Summarize long text into key points",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Text to summarize" },
        max_sentences: { type: "number", description: "Max sentences in summary", default: 3 }
      },
      required: ["text"]
    },
    handler: ({ text, max_sentences = 3 }) => {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      const wordFreq = {};
      text.toLowerCase().split(/\W+/).forEach(w => {
        if (w.length > 4) wordFreq[w] = (wordFreq[w] || 0) + 1;
      });
      const scored = sentences.map(s => ({
        s,
        score: s.toLowerCase().split(/\W+/).reduce((a, w) => a + (wordFreq[w] || 0), 0)
      }));
      scored.sort((a, b) => b.score - a.score);
      const summary = scored.slice(0, max_sentences).map(x => x.s.trim()).join(' ');
      return { summary, original_sentences: sentences.length, summary_sentences: Math.min(max_sentences, sentences.length) };
    }
  },

  word_count: {
    category: "Text & Content",
    description: "Count words, characters, sentences, and paragraphs in text",
    inputSchema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"]
    },
    handler: ({ text }) => ({
      characters: text.length,
      characters_no_spaces: text.replace(/\s/g, '').length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
      sentences: (text.match(/[.!?]+/g) || []).length,
      paragraphs: text.split(/\n\s*\n/).filter(Boolean).length,
      reading_time_minutes: Math.ceil(text.trim().split(/\s+/).length / 200),
      speaking_time_minutes: Math.ceil(text.trim().split(/\s+/).length / 130)
    })
  },

  extract_emails: {
    category: "Text & Content",
    description: "Extract all email addresses from text",
    inputSchema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"]
    },
    handler: ({ text }) => {
      const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      return { emails: [...new Set(emails)], count: [...new Set(emails)].length };
    }
  },

  extract_urls: {
    category: "Text & Content",
    description: "Extract all URLs from text",
    inputSchema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"]
    },
    handler: ({ text }) => {
      const urls = text.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/g) || [];
      return { urls: [...new Set(urls)], count: [...new Set(urls)].length };
    }
  },

  extract_phone_numbers: {
    category: "Text & Content",
    description: "Extract phone numbers from text",
    inputSchema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"]
    },
    handler: ({ text }) => {
      const phones = text.match(/(\+?1?\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/g) || [];
      return { phones: [...new Set(phones.map(p => p.trim()))], count: [...new Set(phones)].length };
    }
  },

  text_to_slug: {
    category: "Text & Content",
    description: "Convert text to URL-friendly slug",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        separator: { type: "string", default: "-" }
      },
      required: ["text"]
    },
    handler: ({ text, separator = "-" }) => ({
      slug: text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, separator)
        .replace(/^-+|-+$/g, '')
    })
  },

  text_case_converter: {
    category: "Text & Content",
    description: "Convert text between cases: upper, lower, title, camel, snake, kebab, pascal",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        case_type: { type: "string", enum: ["upper", "lower", "title", "camel", "snake", "kebab", "pascal", "sentence"] }
      },
      required: ["text", "case_type"]
    },
    handler: ({ text, case_type }) => {
      const words = text.replace(/[-_]/g, ' ').split(/\s+/);
      const conversions = {
        upper: text.toUpperCase(),
        lower: text.toLowerCase(),
        title: words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
        camel: words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
        snake: words.map(w => w.toLowerCase()).join('_'),
        kebab: words.map(w => w.toLowerCase()).join('-'),
        pascal: words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
        sentence: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      };
      return { result: conversions[case_type], case_type };
    }
  },

  find_replace: {
    category: "Text & Content",
    description: "Find and replace text with optional regex support",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        find: { type: "string" },
        replace: { type: "string" },
        use_regex: { type: "boolean", default: false },
        case_sensitive: { type: "boolean", default: true }
      },
      required: ["text", "find", "replace"]
    },
    handler: ({ text, find, replace, use_regex = false, case_sensitive = true }) => {
      let result, count = 0;
      if (use_regex) {
        const flags = case_sensitive ? 'g' : 'gi';
        const regex = new RegExp(find, flags);
        result = text.replace(regex, (...args) => { count++; return replace; });
      } else {
        const flags = case_sensitive ? 'g' : 'gi';
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, flags);
        result = text.replace(regex, () => { count++; return replace; });
      }
      return { result, replacements_made: count };
    }
  },

  text_diff: {
    category: "Text & Content",
    description: "Compare two texts and find differences",
    inputSchema: {
      type: "object",
      properties: {
        text1: { type: "string" },
        text2: { type: "string" }
      },
      required: ["text1", "text2"]
    },
    handler: ({ text1, text2 }) => {
      const lines1 = text1.split('\n');
      const lines2 = text2.split('\n');
      const added = lines2.filter(l => !lines1.includes(l));
      const removed = lines1.filter(l => !lines2.includes(l));
      const similarity = 1 - (Math.abs(text1.length - text2.length) / Math.max(text1.length, text2.length));
      return {
        are_identical: text1 === text2,
        similarity_percent: Math.round(similarity * 100),
        lines_added: added.length,
        lines_removed: removed.length,
        added_lines: added.slice(0, 20),
        removed_lines: removed.slice(0, 20)
      };
    }
  },

  truncate_text: {
    category: "Text & Content",
    description: "Truncate text to specified length with ellipsis",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        max_length: { type: "number" },
        ellipsis: { type: "string", default: "..." },
        break_on_word: { type: "boolean", default: true }
      },
      required: ["text", "max_length"]
    },
    handler: ({ text, max_length, ellipsis = "...", break_on_word = true }) => {
      if (text.length <= max_length) return { result: text, truncated: false };
      let truncated = text.slice(0, max_length - ellipsis.length);
      if (break_on_word) truncated = truncated.slice(0, truncated.lastIndexOf(' '));
      return { result: truncated + ellipsis, truncated: true, original_length: text.length };
    }
  },

  generate_lorem_ipsum: {
    category: "Text & Content",
    description: "Generate Lorem Ipsum placeholder text",
    inputSchema: {
      type: "object",
      properties: {
        paragraphs: { type: "number", default: 1 },
        sentences_per_paragraph: { type: "number", default: 5 }
      }
    },
    handler: ({ paragraphs = 1, sentences_per_paragraph = 5 }) => {
      const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"];
      const rnd = (n) => Math.floor(Math.random() * n);
      const sentence = () => {
        const len = 8 + rnd(10);
        const w = Array.from({ length: len }, () => words[rnd(words.length)]);
        w[0] = w[0].charAt(0).toUpperCase() + w[0].slice(1);
        return w.join(' ') + '.';
      };
      const paras = Array.from({ length: paragraphs }, () =>
        Array.from({ length: sentences_per_paragraph }, sentence).join(' ')
      );
      return { text: paras.join('\n\n'), paragraphs, word_count: paras.join(' ').split(' ').length };
    }
  },

  palindrome_check: {
    category: "Text & Content",
    description: "Check if text is a palindrome",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        ignore_spaces: { type: "boolean", default: true },
        ignore_case: { type: "boolean", default: true }
      },
      required: ["text"]
    },
    handler: ({ text, ignore_spaces = true, ignore_case = true }) => {
      let cleaned = text;
      if (ignore_spaces) cleaned = cleaned.replace(/\s/g, '');
      if (ignore_case) cleaned = cleaned.toLowerCase();
      cleaned = cleaned.replace(/[^a-z0-9]/gi, '');
      const reversed = cleaned.split('').reverse().join('');
      return { is_palindrome: cleaned === reversed, cleaned_text: cleaned, reversed };
    }
  },

  text_statistics: {
    category: "Text & Content",
    description: "Advanced text statistics including top words, avg word length, etc.",
    inputSchema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"]
    },
    handler: ({ text }) => {
      const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
      const freq = {};
      words.forEach(w => freq[w] = (freq[w] || 0) + 1);
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      const avgWordLen = words.reduce((a, w) => a + w.length, 0) / (words.length || 1);
      return {
        total_words: words.length,
        unique_words: Object.keys(freq).length,
        avg_word_length: Math.round(avgWordLen * 10) / 10,
        top_10_words: sorted.slice(0, 10).map(([word, count]) => ({ word, count })),
        longest_word: words.sort((a, b) => b.length - a.length)[0] || '',
        lexical_diversity: Math.round((Object.keys(freq).length / words.length) * 100) / 100
      };
    }
  },

  validate_email: {
    category: "Text & Content",
    description: "Validate email address format",
    inputSchema: {
      type: "object",
      properties: { email: { type: "string" } },
      required: ["email"]
    },
    handler: ({ email }) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = regex.test(email);
      const parts = email.split('@');
      return {
        is_valid: valid,
        email,
        local_part: parts[0] || '',
        domain: parts[1] || '',
        issues: valid ? [] : ['Invalid email format']
      };
    }
  },

  validate_url: {
    category: "Text & Content",
    description: "Validate and parse a URL",
    inputSchema: {
      type: "object",
      properties: { url: { type: "string" } },
      required: ["url"]
    },
    handler: ({ url }) => {
      try {
        const parsed = new URL(url);
        return {
          is_valid: true,
          protocol: parsed.protocol,
          hostname: parsed.hostname,
          port: parsed.port || 'default',
          pathname: parsed.pathname,
          search: parsed.search,
          hash: parsed.hash,
          params: Object.fromEntries(parsed.searchParams)
        };
      } catch {
        return { is_valid: false, url, error: 'Invalid URL format' };
      }
    }
  },

  text_encode_decode: {
    category: "Text & Content",
    description: "Encode or decode text: base64, URI, HTML entities",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        operation: { type: "string", enum: ["encode_base64", "decode_base64", "encode_uri", "decode_uri", "encode_html", "decode_html"] }
      },
      required: ["text", "operation"]
    },
    handler: ({ text, operation }) => {
      const htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      const htmlDecode = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
      const ops = {
        encode_base64: () => Buffer.from(text).toString('base64'),
        decode_base64: () => Buffer.from(text, 'base64').toString('utf-8'),
        encode_uri: () => encodeURIComponent(text),
        decode_uri: () => decodeURIComponent(text),
        encode_html: () => text.replace(/[&<>"']/g, m => htmlEntities[m]),
        decode_html: () => text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, m => htmlDecode[m])
      };
      try {
        return { result: ops[operation](), operation };
      } catch (e) {
        return { error: e.message, operation };
      }
    }
  },

  generate_password: {
    category: "Text & Content",
    description: "Generate secure random passwords",
    inputSchema: {
      type: "object",
      properties: {
        length: { type: "number", default: 16 },
        include_uppercase: { type: "boolean", default: true },
        include_numbers: { type: "boolean", default: true },
        include_symbols: { type: "boolean", default: true },
        count: { type: "number", default: 1 }
      }
    },
    handler: ({ length = 16, include_uppercase = true, include_numbers = true, include_symbols = true, count = 1 }) => {
      let chars = 'abcdefghijklmnopqrstuvwxyz';
      if (include_uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (include_numbers) chars += '0123456789';
      if (include_symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const gen = () => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const passwords = Array.from({ length: Math.min(count, 20) }, gen);
      const strength = length >= 16 && include_uppercase && include_numbers && include_symbols ? 'Strong' :
        length >= 12 ? 'Medium' : 'Weak';
      return { passwords, strength, length };
    }
  },

  generate_username: {
    category: "Text & Content",
    description: "Generate creative usernames from a name or keyword",
    inputSchema: {
      type: "object",
      properties: {
        base_word: { type: "string" },
        count: { type: "number", default: 5 }
      },
      required: ["base_word"]
    },
    handler: ({ base_word, count = 5 }) => {
      const adjectives = ['cool', 'super', 'mega', 'ultra', 'ninja', 'epic', 'turbo', 'alpha', 'prime', 'ace'];
      const suffixes = ['pro', 'dev', 'hq', 'io', 'hub', 'lab', 'kit', 'box', 'app', 'ai'];
      const base = base_word.toLowerCase().replace(/\s+/g, '');
      const suggestions = [];
      for (let i = 0; i < count && i < 20; i++) {
        const rnd = Math.random();
        if (rnd < 0.33) suggestions.push(`${adjectives[Math.floor(Math.random() * adjectives.length)]}_${base}`);
        else if (rnd < 0.66) suggestions.push(`${base}_${suffixes[Math.floor(Math.random() * suffixes.length)]}`);
        else suggestions.push(`${base}${Math.floor(Math.random() * 9999)}`);
      }
      return { suggestions: [...new Set(suggestions)].slice(0, count) };
    }
  },

  check_readability: {
    category: "Text & Content",
    description: "Check text readability score (Flesch-Kincaid)",
    inputSchema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"]
    },
    handler: ({ text }) => {
      const sentences = (text.match(/[.!?]+/g) || []).length || 1;
      const words = text.trim().split(/\s+/).length;
      const syllables = text.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiou]+/g)?.length || 1;
      const fk_score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
      const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
      const level = fk_score >= 80 ? 'Very Easy' : fk_score >= 60 ? 'Easy' : fk_score >= 50 ? 'Medium' : fk_score >= 30 ? 'Hard' : 'Very Hard';
      return {
        flesch_kincaid_score: Math.round(fk_score),
        grade_level: Math.round(grade),
        readability_level: level,
        avg_words_per_sentence: Math.round(words / sentences),
        avg_syllables_per_word: Math.round((syllables / words) * 10) / 10
      };
    }
  },

  anagram_checker: {
    category: "Text & Content",
    description: "Check if two words are anagrams of each other",
    inputSchema: {
      type: "object",
      properties: {
        word1: { type: "string" },
        word2: { type: "string" }
      },
      required: ["word1", "word2"]
    },
    handler: ({ word1, word2 }) => {
      const sort = s => s.toLowerCase().replace(/\s/g, '').split('').sort().join('');
      return {
        is_anagram: sort(word1) === sort(word2),
        word1_sorted: sort(word1),
        word2_sorted: sort(word2)
      };
    }
  },

  // ══════════════════════════════════════════
  // 🔢 DATA & MATH TOOLS (15 tools)
  // ══════════════════════════════════════════

  calculator: {
    category: "Data & Math",
    description: "Evaluate mathematical expressions safely",
    inputSchema: {
      type: "object",
      properties: { expression: { type: "string", description: "Math expression, e.g. '2 + 2 * 10'" } },
      required: ["expression"]
    },
    handler: ({ expression }) => {
      try {
        const safe = expression.replace(/[^0-9+\-*/().%\s^]/g, '');
        const result = Function('"use strict"; return (' + safe + ')')();
        return { expression, result, formatted: result.toLocaleString() };
      } catch (e) {
        return { expression, error: 'Invalid expression' };
      }
    }
  },

  unit_converter: {
    category: "Data & Math",
    description: "Convert between units: length, weight, temperature, area, volume, speed",
    inputSchema: {
      type: "object",
      properties: {
        value: { type: "number" },
        from_unit: { type: "string" },
        to_unit: { type: "string" },
        category: { type: "string", enum: ["length", "weight", "temperature", "area", "volume", "speed"] }
      },
      required: ["value", "from_unit", "to_unit", "category"]
    },
    handler: ({ value, from_unit, to_unit, category }) => {
      const conversions = {
        length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, inch: 0.0254, ft: 0.3048, yard: 0.9144, mile: 1609.34 },
        weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
        area: { m2: 1, km2: 1e6, cm2: 0.0001, ft2: 0.092903, acre: 4046.86, hectare: 10000 },
        volume: { l: 1, ml: 0.001, m3: 1000, gallon: 3.78541, quart: 0.946353, cup: 0.236588, tbsp: 0.0147868, tsp: 0.00492892 },
        speed: { ms: 1, kmh: 0.277778, mph: 0.44704, knot: 0.514444, fps: 0.3048 }
      };
      if (category === 'temperature') {
        let celsius;
        if (from_unit === 'c') celsius = value;
        else if (from_unit === 'f') celsius = (value - 32) * 5 / 9;
        else celsius = value - 273.15;
        const result = to_unit === 'c' ? celsius : to_unit === 'f' ? celsius * 9 / 5 + 32 : celsius + 273.15;
        return { value, from_unit, to_unit, result: Math.round(result * 1000) / 1000 };
      }
      const cat = conversions[category];
      if (!cat[from_unit] || !cat[to_unit]) return { error: `Unknown unit. Available: ${Object.keys(cat).join(', ')}` };
      const result = value * cat[from_unit] / cat[to_unit];
      return { value, from_unit, to_unit, result: Math.round(result * 1000000) / 1000000 };
    }
  },

  percentage_calculator: {
    category: "Data & Math",
    description: "Various percentage calculations",
    inputSchema: {
      type: "object",
      properties: {
        operation: { type: "string", enum: ["percent_of", "what_percent", "percent_change", "add_percent", "subtract_percent"] },
        value1: { type: "number" },
        value2: { type: "number" }
      },
      required: ["operation", "value1", "value2"]
    },
    handler: ({ operation, value1, value2 }) => {
      const ops = {
        percent_of: () => ({ result: (value2 / 100) * value1, description: `${value1}% of ${value2} = ${(value2 / 100) * value1}` }),
        what_percent: () => ({ result: (value1 / value2) * 100, description: `${value1} is ${((value1 / value2) * 100).toFixed(2)}% of ${value2}` }),
        percent_change: () => ({ result: ((value2 - value1) / value1) * 100, description: `Change from ${value1} to ${value2} = ${(((value2 - value1) / value1) * 100).toFixed(2)}%` }),
        add_percent: () => ({ result: value1 + (value1 * value2 / 100), description: `${value1} + ${value2}% = ${value1 + (value1 * value2 / 100)}` }),
        subtract_percent: () => ({ result: value1 - (value1 * value2 / 100), description: `${value1} - ${value2}% = ${value1 - (value1 * value2 / 100)}` })
      };
      const res = ops[operation]();
      return { ...res, result: Math.round(res.result * 100) / 100 };
    }
  },

  statistics_calculator: {
    category: "Data & Math",
    description: "Calculate mean, median, mode, std dev, variance from a list of numbers",
    inputSchema: {
      type: "object",
      properties: {
        numbers: { type: "array", items: { type: "number" } }
      },
      required: ["numbers"]
    },
    handler: ({ numbers }) => {
      const n = numbers.length;
      if (!n) return { error: 'Empty array' };
      const sorted = [...numbers].sort((a, b) => a - b);
      const mean = numbers.reduce((a, b) => a + b, 0) / n;
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
      const freq = {}; numbers.forEach(x => freq[x] = (freq[x] || 0) + 1);
      const maxFreq = Math.max(...Object.values(freq));
      const mode = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
      const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
      const stddev = Math.sqrt(variance);
      return {
        count: n, sum: numbers.reduce((a, b) => a + b, 0),
        mean: Math.round(mean * 1000) / 1000,
        median, mode,
        min: sorted[0], max: sorted[n - 1],
        range: sorted[n - 1] - sorted[0],
        variance: Math.round(variance * 1000) / 1000,
        std_deviation: Math.round(stddev * 1000) / 1000,
        q1: sorted[Math.floor(n * 0.25)],
        q3: sorted[Math.floor(n * 0.75)]
      };
    }
  },

  prime_checker: {
    category: "Data & Math",
    description: "Check if a number is prime and find factors",
    inputSchema: {
      type: "object",
      properties: { number: { type: "number" } },
      required: ["number"]
    },
    handler: ({ number }) => {
      const n = Math.abs(Math.floor(number));
      const isPrime = n > 1 && !Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).some(i => n % i === 0);
      const factors = [];
      for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
      return { number: n, is_prime: isPrime, factors, factor_count: factors.length };
    }
  },

  fibonacci: {
    category: "Data & Math",
    description: "Generate Fibonacci sequence up to N terms",
    inputSchema: {
      type: "object",
      properties: { terms: { type: "number", description: "Number of terms (max 50)" } },
      required: ["terms"]
    },
    handler: ({ terms }) => {
      const n = Math.min(terms, 50);
      const seq = [0, 1];
      for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
      return { sequence: seq.slice(0, n), terms: n, last_value: seq[n - 1] };
    }
  },

  bmi_calculator: {
    category: "Data & Math",
    description: "Calculate BMI and category",
    inputSchema: {
      type: "object",
      properties: {
        weight_kg: { type: "number" },
        height_cm: { type: "number" }
      },
      required: ["weight_kg", "height_cm"]
    },
    handler: ({ weight_kg, height_cm }) => {
      const h = height_cm / 100;
      const bmi = weight_kg / (h * h);
      const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese';
      const ideal_min = 18.5 * h * h;
      const ideal_max = 24.9 * h * h;
      return {
        bmi: Math.round(bmi * 10) / 10,
        category,
        ideal_weight_range: `${Math.round(ideal_min)}-${Math.round(ideal_max)} kg`,
        height_cm, weight_kg
      };
    }
  },

  compound_interest: {
    category: "Data & Math",
    description: "Calculate compound interest",
    inputSchema: {
      type: "object",
      properties: {
        principal: { type: "number" },
        rate_percent: { type: "number" },
        years: { type: "number" },
        compounds_per_year: { type: "number", default: 12 }
      },
      required: ["principal", "rate_percent", "years"]
    },
    handler: ({ principal, rate_percent, years, compounds_per_year = 12 }) => {
      const r = rate_percent / 100;
      const n = compounds_per_year;
      const amount = principal * Math.pow(1 + r / n, n * years);
      const interest = amount - principal;
      const yearlyBreakdown = Array.from({ length: Math.min(years, 30) }, (_, i) => ({
        year: i + 1,
        balance: Math.round(principal * Math.pow(1 + r / n, n * (i + 1)) * 100) / 100
      }));
      return {
        principal, rate_percent, years, compounds_per_year,
        final_amount: Math.round(amount * 100) / 100,
        total_interest: Math.round(interest * 100) / 100,
        interest_earned_percent: Math.round((interest / principal) * 10000) / 100,
        yearly_breakdown: yearlyBreakdown
      };
    }
  },

  loan_calculator: {
    category: "Data & Math",
    description: "Calculate monthly loan payment, total interest",
    inputSchema: {
      type: "object",
      properties: {
        principal: { type: "number" },
        annual_rate_percent: { type: "number" },
        years: { type: "number" }
      },
      required: ["principal", "annual_rate_percent", "years"]
    },
    handler: ({ principal, annual_rate_percent, years }) => {
      const r = annual_rate_percent / 100 / 12;
      const n = years * 12;
      const monthly = r === 0 ? principal / n : principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const total = monthly * n;
      return {
        principal, annual_rate_percent, years,
        monthly_payment: Math.round(monthly * 100) / 100,
        total_payment: Math.round(total * 100) / 100,
        total_interest: Math.round((total - principal) * 100) / 100,
        total_months: n
      };
    }
  },

  currency_converter: {
    category: "Data & Math",
    description: "Convert between major currencies using approximate rates",
    inputSchema: {
      type: "object",
      properties: {
        amount: { type: "number" },
        from: { type: "string", description: "Currency code e.g. USD" },
        to: { type: "string", description: "Currency code e.g. EUR" }
      },
      required: ["amount", "from", "to"]
    },
    handler: ({ amount, from, to }) => {
      // Approximate rates vs USD (static - in production, fetch from API)
      const rates = {
        USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53,
        CHF: 0.89, CNY: 7.24, INR: 83.1, MXN: 17.1, BRL: 4.97, KRW: 1325,
        SGD: 1.34, HKD: 7.82, NOK: 10.55, SEK: 10.42, DKK: 6.89,
        NZD: 1.63, ZAR: 18.63, TRY: 30.5, AED: 3.67, SAR: 3.75, THB: 35.1,
        IDR: 15640, MYR: 4.69, PHP: 56.8, PKR: 278, EGP: 30.9, NGN: 775
      };
      const fromRate = rates[from.toUpperCase()];
      const toRate = rates[to.toUpperCase()];
      if (!fromRate) return { error: `Unknown currency: ${from}` };
      if (!toRate) return { error: `Unknown currency: ${to}` };
      const result = (amount / fromRate) * toRate;
      return {
        amount, from: from.toUpperCase(), to: to.toUpperCase(),
        result: Math.round(result * 100) / 100,
        rate: Math.round((toRate / fromRate) * 10000) / 10000,
        note: 'Rates are approximate. Use a financial API for real-time rates.'
      };
    }
  },

  roman_numeral_converter: {
    category: "Data & Math",
    description: "Convert between Roman numerals and integers",
    inputSchema: {
      type: "object",
      properties: {
        value: { type: "string", description: "Integer or Roman numeral" },
        to: { type: "string", enum: ["roman", "integer"] }
      },
      required: ["value", "to"]
    },
    handler: ({ value, to }) => {
      const vals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
      if (to === 'roman') {
        let n = parseInt(value), roman = '';
        for (const [v, r] of vals) { while (n >= v) { roman += r; n -= v; } }
        return { input: value, result: roman };
      } else {
        const map = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 };
        const s = value.toString().toUpperCase();
        let result = 0;
        for (let i = 0; i < s.length; i++) {
          const curr = map[s[i]], next = map[s[i + 1]];
          result += curr < next ? -curr : curr;
        }
        return { input: value, result };
      }
    }
  },

  number_formatter: {
    category: "Data & Math",
    description: "Format numbers with commas, decimals, and convert to words",
    inputSchema: {
      type: "object",
      properties: {
        number: { type: "number" },
        format: { type: "string", enum: ["commas", "scientific", "binary", "hex", "octal", "words"] }
      },
      required: ["number", "format"]
    },
    handler: ({ number, format }) => {
      const toWords = (n) => {
        const ones = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
        const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
        if (n === 0) return 'zero';
        if (n < 0) return 'negative ' + toWords(-n);
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? '-' + ones[n%10] : '');
        if (n < 1000) return ones[Math.floor(n/100)] + ' hundred' + (n%100 ? ' ' + toWords(n%100) : '');
        if (n < 1e6) return toWords(Math.floor(n/1000)) + ' thousand' + (n%1000 ? ' ' + toWords(n%1000) : '');
        if (n < 1e9) return toWords(Math.floor(n/1e6)) + ' million' + (n%1e6 ? ' ' + toWords(n%1e6) : '');
        return toWords(Math.floor(n/1e9)) + ' billion' + (n%1e9 ? ' ' + toWords(n%1e9) : '');
      };
      const formats = {
        commas: number.toLocaleString(),
        scientific: number.toExponential(4),
        binary: Math.floor(number).toString(2),
        hex: Math.floor(number).toString(16).toUpperCase(),
        octal: Math.floor(number).toString(8),
        words: toWords(Math.floor(number))
      };
      return { number, format, result: formats[format] };
    }
  },

  tip_calculator: {
    category: "Data & Math",
    description: "Calculate tip and split bill",
    inputSchema: {
      type: "object",
      properties: {
        bill_amount: { type: "number" },
        tip_percent: { type: "number", default: 18 },
        people: { type: "number", default: 1 }
      },
      required: ["bill_amount"]
    },
    handler: ({ bill_amount, tip_percent = 18, people = 1 }) => {
      const tip = bill_amount * tip_percent / 100;
      const total = bill_amount + tip;
      return {
        bill_amount, tip_percent, people,
        tip_amount: Math.round(tip * 100) / 100,
        total: Math.round(total * 100) / 100,
        per_person: Math.round((total / people) * 100) / 100,
        tip_per_person: Math.round((tip / people) * 100) / 100
      };
    }
  },

  tax_calculator: {
    category: "Data & Math",
    description: "Calculate tax amount and total",
    inputSchema: {
      type: "object",
      properties: {
        amount: { type: "number" },
        tax_rate_percent: { type: "number" },
        tax_type: { type: "string", enum: ["add_tax", "remove_tax"], default: "add_tax" }
      },
      required: ["amount", "tax_rate_percent"]
    },
    handler: ({ amount, tax_rate_percent, tax_type = "add_tax" }) => {
      if (tax_type === 'add_tax') {
        const tax = amount * tax_rate_percent / 100;
        return { pre_tax: amount, tax_rate_percent, tax_amount: Math.round(tax * 100) / 100, total: Math.round((amount + tax) * 100) / 100 };
      } else {
        const pre = amount / (1 + tax_rate_percent / 100);
        const tax = amount - pre;
        return { total: amount, tax_rate_percent, tax_amount: Math.round(tax * 100) / 100, pre_tax: Math.round(pre * 100) / 100 };
      }
    }
  },

  age_calculator: {
    category: "Data & Math",
    description: "Calculate age and days until next birthday",
    inputSchema: {
      type: "object",
      properties: {
        birth_date: { type: "string", description: "Date in YYYY-MM-DD format" },
        reference_date: { type: "string", description: "Optional reference date, defaults to today" }
      },
      required: ["birth_date"]
    },
    handler: ({ birth_date, reference_date }) => {
      const birth = new Date(birth_date);
      const ref = reference_date ? new Date(reference_date) : new Date();
      let years = ref.getFullYear() - birth.getFullYear();
      let months = ref.getMonth() - birth.getMonth();
      let days = ref.getDate() - birth.getDate();
      if (days < 0) { months--; days += 30; }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((ref - birth) / (1000 * 60 * 60 * 24));
      const nextBday = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBday < ref) nextBday.setFullYear(nextBday.getFullYear() + 1);
      const daysToNextBday = Math.floor((nextBday - ref) / (1000 * 60 * 60 * 24));
      return { years, months, days, total_days_lived: totalDays, days_to_next_birthday: daysToNextBday };
    }
  },

  // ══════════════════════════════════════════
  // 🌐 WEB & RESEARCH TOOLS (12 tools)
  // ══════════════════════════════════════════

  generate_seo_meta: {
    category: "Web & Research",
    description: "Generate SEO meta tags for a webpage",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        keywords: { type: "array", items: { type: "string" } },
        url: { type: "string" },
        image_url: { type: "string" },
        author: { type: "string" }
      },
      required: ["title", "description"]
    },
    handler: ({ title, description, keywords = [], url = '', image_url = '', author = '' }) => {
      const truncTitle = title.slice(0, 60);
      const truncDesc = description.slice(0, 160);
      const html = `<!-- Primary Meta Tags -->
<title>${truncTitle}</title>
<meta name="title" content="${truncTitle}">
<meta name="description" content="${truncDesc}">
${keywords.length ? `<meta name="keywords" content="${keywords.join(', ')}">` : ''}
${author ? `<meta name="author" content="${author}">` : ''}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
${url ? `<meta property="og:url" content="${url}">` : ''}
<meta property="og:title" content="${truncTitle}">
<meta property="og:description" content="${truncDesc}">
${image_url ? `<meta property="og:image" content="${image_url}">` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
${url ? `<meta property="twitter:url" content="${url}">` : ''}
<meta property="twitter:title" content="${truncTitle}">
<meta property="twitter:description" content="${truncDesc}">
${image_url ? `<meta property="twitter:image" content="${image_url}">` : ''}`;
      return {
        html,
        title_length: title.length, title_ok: title.length <= 60,
        description_length: description.length, description_ok: description.length <= 160,
        warnings: [
          ...(title.length > 60 ? ['Title too long (max 60 chars)'] : []),
          ...(description.length > 160 ? ['Description too long (max 160 chars)'] : []),
          ...(keywords.length === 0 ? ['No keywords provided'] : [])
        ]
      };
    }
  },

  generate_robots_txt: {
    category: "Web & Research",
    description: "Generate robots.txt content",
    inputSchema: {
      type: "object",
      properties: {
        sitemap_url: { type: "string" },
        disallowed_paths: { type: "array", items: { type: "string" } },
        crawl_delay: { type: "number" },
        allow_all: { type: "boolean", default: true }
      }
    },
    handler: ({ sitemap_url, disallowed_paths = [], crawl_delay, allow_all = true }) => {
      let content = `User-agent: *\n`;
      if (allow_all) content += `Allow: /\n`;
      disallowed_paths.forEach(p => content += `Disallow: ${p}\n`);
      if (crawl_delay) content += `Crawl-delay: ${crawl_delay}\n`;
      if (sitemap_url) content += `\nSitemap: ${sitemap_url}\n`;
      return { robots_txt: content };
    }
  },

  http_status_lookup: {
    category: "Web & Research",
    description: "Look up HTTP status code meaning",
    inputSchema: {
      type: "object",
      properties: { code: { type: "number" } },
      required: ["code"]
    },
    handler: ({ code }) => {
      const codes = {
        100: 'Continue', 101: 'Switching Protocols', 200: 'OK', 201: 'Created',
        202: 'Accepted', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found',
        304: 'Not Modified', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
        404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 422: 'Unprocessable Entity',
        429: 'Too Many Requests', 500: 'Internal Server Error', 501: 'Not Implemented',
        502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout'
      };
      const category = code < 200 ? 'Informational' : code < 300 ? 'Success' : code < 400 ? 'Redirection' : code < 500 ? 'Client Error' : 'Server Error';
      return { code, name: codes[code] || 'Unknown', category, description: codes[code] ? `${code} ${codes[code]}` : 'Unknown status code' };
    }
  },

  color_converter: {
    category: "Web & Research",
    description: "Convert colors between HEX, RGB, HSL",
    inputSchema: {
      type: "object",
      properties: {
        color: { type: "string", description: "Color value e.g. #FF5733 or rgb(255,87,51) or hsl(11,100%,60%)" },
        from: { type: "string", enum: ["hex", "rgb", "hsl"] }
      },
      required: ["color", "from"]
    },
    handler: ({ color, from }) => {
      let r, g, b;
      if (from === 'hex') {
        const hex = color.replace('#', '');
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else if (from === 'rgb') {
        const m = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
        [r, g, b] = [+m[1], +m[2], +m[3]];
      } else return { error: 'HSL input conversion coming soon' };
      const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
      const l = (max + min) / 2;
      const s = max === min ? 0 : l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
      let h = 0;
      if (max !== min) {
        if (max === rn) h = ((gn - bn) / (max - min) + 6) % 6;
        else if (max === gn) h = (bn - rn) / (max - min) + 2;
        else h = (rn - gn) / (max - min) + 4;
        h *= 60;
      }
      return {
        hex, rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
        values: { r, g, b, h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
      };
    }
  },

  generate_qr_data: {
    category: "Web & Research",
    description: "Generate QR code URL using public API",
    inputSchema: {
      type: "object",
      properties: {
        data: { type: "string" },
        size: { type: "number", default: 200 },
        error_correction: { type: "string", enum: ["L", "M", "Q", "H"], default: "M" }
      },
      required: ["data"]
    },
    handler: ({ data, size = 200, error_correction = "M" }) => {
      const encoded = encodeURIComponent(data);
      const qr_url = `https://api.qrserver.com/v1/create-qr-code/?data=${encoded}&size=${size}x${size}&ecc=${error_correction}`;
      return { qr_image_url: qr_url, data, size, error_correction, embed_html: `<img src="${qr_url}" alt="QR Code" width="${size}" height="${size}">` };
    }
  },

  parse_json: {
    category: "Web & Research",
    description: "Parse, validate, and analyze JSON data",
    inputSchema: {
      type: "object",
      properties: {
        json_string: { type: "string" },
        path: { type: "string", description: "Dot notation path to extract, e.g. user.name" }
      },
      required: ["json_string"]
    },
    handler: ({ json_string, path }) => {
      try {
        const data = JSON.parse(json_string);
        const getType = v => Array.isArray(v) ? 'array' : typeof v;
        const countKeys = (obj) => {
          if (typeof obj !== 'object' || obj === null) return 0;
          return Object.keys(obj).length + Object.values(obj).reduce((a, v) => a + countKeys(v), 0);
        };
        let extracted = data;
        if (path) {
          const keys = path.split('.');
          for (const k of keys) {
            if (extracted && typeof extracted === 'object') extracted = extracted[k];
            else { extracted = undefined; break; }
          }
        }
        return {
          valid: true,
          root_type: getType(data),
          total_keys: countKeys(data),
          top_level_keys: typeof data === 'object' && data !== null ? Object.keys(data) : [],
          extracted_value: path ? extracted : undefined,
          formatted: JSON.stringify(data, null, 2).slice(0, 2000)
        };
      } catch (e) {
        return { valid: false, error: e.message };
      }
    }
  },

  json_to_csv: {
    category: "Web & Research",
    description: "Convert JSON array to CSV format",
    inputSchema: {
      type: "object",
      properties: {
        json_array: { type: "string", description: "JSON array string" },
        delimiter: { type: "string", default: "," }
      },
      required: ["json_array"]
    },
    handler: ({ json_array, delimiter = "," }) => {
      try {
        const data = JSON.parse(json_array);
        if (!Array.isArray(data)) return { error: 'Input must be a JSON array' };
        const headers = [...new Set(data.flatMap(Object.keys))];
        const rows = data.map(row => headers.map(h => {
          const v = row[h] ?? '';
          return typeof v === 'string' && v.includes(delimiter) ? `"${v}"` : v;
        }).join(delimiter));
        const csv = [headers.join(delimiter), ...rows].join('\n');
        return { csv, rows: data.length, columns: headers.length, headers };
      } catch (e) {
        return { error: e.message };
      }
    }
  },

  csv_to_json: {
    category: "Web & Research",
    description: "Convert CSV to JSON array",
    inputSchema: {
      type: "object",
      properties: {
        csv: { type: "string" },
        delimiter: { type: "string", default: "," }
      },
      required: ["csv"]
    },
    handler: ({ csv, delimiter = "," }) => {
      const lines = csv.trim().split('\n');
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
        return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
      });
      return { json: JSON.stringify(data, null, 2), rows: data.length, columns: headers.length, headers };
    }
  },

  markdown_to_html: {
    category: "Web & Research",
    description: "Convert Markdown text to HTML",
    inputSchema: {
      type: "object",
      properties: { markdown: { type: "string" } },
      required: ["markdown"]
    },
    handler: ({ markdown }) => {
      let html = markdown
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[a-z])(.+)$/gm, '<p>$1</p>');
      return { html, char_count: html.length };
    }
  },

  html_to_text: {
    category: "Web & Research",
    description: "Strip HTML tags and convert to plain text",
    inputSchema: {
      type: "object",
      properties: { html: { type: "string" } },
      required: ["html"]
    },
    handler: ({ html }) => {
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/h[1-6]>/gi, '\n\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      return { text, original_length: html.length, text_length: text.length };
    }
  },

  generate_sitemap: {
    category: "Web & Research",
    description: "Generate XML sitemap for a website",
    inputSchema: {
      type: "object",
      properties: {
        base_url: { type: "string" },
        pages: { type: "array", items: { type: "string" }, description: "List of page paths e.g. /about, /contact" },
        change_freq: { type: "string", enum: ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"], default: "weekly" },
        priority: { type: "number", default: 0.8 }
      },
      required: ["base_url", "pages"]
    },
    handler: ({ base_url, pages, change_freq = "weekly", priority = 0.8 }) => {
      const today = new Date().toISOString().split('T')[0];
      const urls = pages.map(p => `  <url>
    <loc>${base_url}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${change_freq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
      return { xml, page_count: pages.length };
    }
  },

  parse_user_agent: {
    category: "Web & Research",
    description: "Parse and analyze a User-Agent string",
    inputSchema: {
      type: "object",
      properties: { user_agent: { type: "string" } },
      required: ["user_agent"]
    },
    handler: ({ user_agent: ua }) => {
      const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : ua.includes('Edge') ? 'Edge' : ua.includes('Opera') ? 'Opera' : 'Unknown';
      const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac OS') ? 'macOS' : ua.includes('Linux') ? 'Linux' : ua.includes('Android') ? 'Android' : ua.includes('iOS') ? 'iOS' : 'Unknown';
      const device = ua.includes('Mobile') ? 'Mobile' : ua.includes('Tablet') ? 'Tablet' : 'Desktop';
      const version = ua.match(/Chrome\/([\d.]+)/) || ua.match(/Firefox\/([\d.]+)/) || ua.match(/Version\/([\d.]+)/);
      return { browser, browser_version: version ? version[1] : 'Unknown', os, device_type: device, is_bot: /bot|crawler|spider|crawl/i.test(ua), raw: ua };
    }
  },

  // ══════════════════════════════════════════
  // 📅 DATE & TIME TOOLS (10 tools)
  // ══════════════════════════════════════════

  date_formatter: {
    category: "Date & Time",
    description: "Format dates in various formats",
    inputSchema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Date string or 'now'" },
        format: { type: "string", enum: ["iso", "us", "eu", "long", "short", "unix", "relative", "custom"] },
        custom_format: { type: "string", description: "Custom format like 'DD/MM/YYYY'" }
      },
      required: ["date", "format"]
    },
    handler: ({ date, format, custom_format }) => {
      const d = date === 'now' ? new Date() : new Date(date);
      if (isNaN(d)) return { error: 'Invalid date' };
      const pad = n => n.toString().padStart(2, '0');
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const formats = {
        iso: d.toISOString(),
        us: `${pad(d.getMonth()+1)}/${pad(d.getDate())}/${d.getFullYear()}`,
        eu: `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`,
        long: `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
        short: `${months[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`,
        unix: Math.floor(d.getTime() / 1000).toString(),
        relative: (() => {
          const now = Date.now(), diff = now - d.getTime();
          if (Math.abs(diff) < 60000) return 'just now';
          const secs = Math.abs(diff) / 1000;
          const mins = secs / 60, hrs = mins / 60, dys = hrs / 24;
          if (dys > 365) return `${Math.floor(dys / 365)} years ${diff > 0 ? 'ago' : 'from now'}`;
          if (dys > 30) return `${Math.floor(dys / 30)} months ${diff > 0 ? 'ago' : 'from now'}`;
          if (dys > 1) return `${Math.floor(dys)} days ${diff > 0 ? 'ago' : 'from now'}`;
          if (hrs > 1) return `${Math.floor(hrs)} hours ${diff > 0 ? 'ago' : 'from now'}`;
          return `${Math.floor(mins)} minutes ${diff > 0 ? 'ago' : 'from now'}`;
        })(),
        custom: custom_format ? custom_format
          .replace('YYYY', d.getFullYear())
          .replace('MM', pad(d.getMonth()+1))
          .replace('DD', pad(d.getDate()))
          .replace('HH', pad(d.getHours()))
          .replace('mm', pad(d.getMinutes()))
          .replace('ss', pad(d.getSeconds())) : d.toISOString()
      };
      return { input: date, formatted: formats[format], format, day_of_week: days[d.getDay()], timezone: 'UTC' };
    }
  },

  date_difference: {
    category: "Date & Time",
    description: "Calculate difference between two dates",
    inputSchema: {
      type: "object",
      properties: {
        date1: { type: "string" },
        date2: { type: "string" }
      },
      required: ["date1", "date2"]
    },
    handler: ({ date1, date2 }) => {
      const d1 = new Date(date1), d2 = new Date(date2);
      const diff = Math.abs(d2 - d1);
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      return {
        date1, date2,
        total_milliseconds: diff,
        total_seconds: Math.floor(diff / 1000),
        total_minutes: Math.floor(diff / (1000 * 60)),
        total_hours: Math.floor(diff / (1000 * 60 * 60)),
        total_days: totalDays,
        total_weeks: Math.floor(totalDays / 7),
        total_months: Math.floor(totalDays / 30.44),
        total_years: Math.floor(totalDays / 365.25),
        earlier_date: d1 < d2 ? date1 : date2
      };
    }
  },

  add_time: {
    category: "Date & Time",
    description: "Add or subtract time from a date",
    inputSchema: {
      type: "object",
      properties: {
        date: { type: "string" },
        amount: { type: "number" },
        unit: { type: "string", enum: ["seconds", "minutes", "hours", "days", "weeks", "months", "years"] },
        operation: { type: "string", enum: ["add", "subtract"], default: "add" }
      },
      required: ["date", "amount", "unit"]
    },
    handler: ({ date, amount, unit, operation = "add" }) => {
      const d = new Date(date === 'now' ? new Date() : date);
      const mult = operation === 'subtract' ? -1 : 1;
      const ms = { seconds: 1000, minutes: 60000, hours: 3600000, days: 86400000, weeks: 604800000 };
      if (ms[unit]) {
        d.setTime(d.getTime() + mult * amount * ms[unit]);
      } else if (unit === 'months') {
        d.setMonth(d.getMonth() + mult * amount);
      } else if (unit === 'years') {
        d.setFullYear(d.getFullYear() + mult * amount);
      }
      return { original: date, result: d.toISOString(), result_formatted: d.toDateString(), operation, amount, unit };
    }
  },

  working_days_calculator: {
    category: "Date & Time",
    description: "Calculate working days between two dates (Mon-Fri)",
    inputSchema: {
      type: "object",
      properties: {
        start_date: { type: "string" },
        end_date: { type: "string" }
      },
      required: ["start_date", "end_date"]
    },
    handler: ({ start_date, end_date }) => {
      let d = new Date(start_date), end = new Date(end_date), count = 0, total = 0;
      while (d <= end) {
        const day = d.getDay();
        total++;
        if (day !== 0 && day !== 6) count++;
        d.setDate(d.getDate() + 1);
      }
      return { start_date, end_date, working_days: count, weekend_days: total - count, total_days: total };
    }
  },

  timezone_converter: {
    category: "Date & Time",
    description: "Convert time between timezones",
    inputSchema: {
      type: "object",
      properties: {
        datetime: { type: "string", description: "ISO datetime or 'now'" },
        from_timezone: { type: "string", description: "e.g. America/New_York" },
        to_timezone: { type: "string", description: "e.g. Asia/Tokyo" }
      },
      required: ["datetime", "from_timezone", "to_timezone"]
    },
    handler: ({ datetime, from_timezone, to_timezone }) => {
      try {
        const d = datetime === 'now' ? new Date() : new Date(datetime);
        const format = tz => d.toLocaleString('en-US', { timeZone: tz, dateStyle: 'full', timeStyle: 'long' });
        return {
          original: datetime,
          from_timezone, to_timezone,
          from_time: format(from_timezone),
          to_time: format(to_timezone),
          utc: d.toISOString()
        };
      } catch (e) {
        return { error: `Invalid timezone. Use IANA format like "America/New_York", "Europe/London", "Asia/Tokyo"` };
      }
    }
  },

  countdown_to: {
    category: "Date & Time",
    description: "Create a countdown to a future date",
    inputSchema: {
      type: "object",
      properties: {
        target_date: { type: "string", description: "Future date in YYYY-MM-DD format" },
        event_name: { type: "string" }
      },
      required: ["target_date"]
    },
    handler: ({ target_date, event_name = "Event" }) => {
      const target = new Date(target_date);
      const now = new Date();
      const diff = target - now;
      if (diff < 0) return { event_name, target_date, message: 'This date has already passed', past: true };
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      return { event_name, target_date, days, hours, minutes, seconds, total_hours: Math.floor(diff / 3600000), summary: `${days}d ${hours}h ${minutes}m ${seconds}s` };
    }
  },

  calendar_generator: {
    category: "Date & Time",
    description: "Generate a text calendar for any month",
    inputSchema: {
      type: "object",
      properties: {
        year: { type: "number" },
        month: { type: "number", description: "1-12" }
      },
      required: ["year", "month"]
    },
    handler: ({ year, month }) => {
      const firstDay = new Date(year, month - 1, 1).getDay();
      const daysInMonth = new Date(year, month, 0).getDate();
      const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      let cal = `   ${monthNames[month - 1]} ${year}\nSun Mon Tue Wed Thu Fri Sat\n`;
      cal += '    '.repeat(firstDay);
      for (let d = 1; d <= daysInMonth; d++) {
        cal += d.toString().padStart(3) + ' ';
        if ((firstDay + d) % 7 === 0) cal += '\n';
      }
      return { calendar: cal, year, month: monthNames[month - 1], days_in_month: daysInMonth, first_day_of_week: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][firstDay] };
    }
  },

  unix_timestamp: {
    category: "Date & Time",
    description: "Convert between Unix timestamps and human dates",
    inputSchema: {
      type: "object",
      properties: {
        value: { type: "string", description: "Unix timestamp (numbers) or date string" },
        to: { type: "string", enum: ["timestamp", "date"] }
      },
      required: ["value", "to"]
    },
    handler: ({ value, to }) => {
      if (to === 'timestamp') {
        const d = new Date(value === 'now' ? new Date() : value);
        return { input: value, unix_timestamp: Math.floor(d.getTime() / 1000), unix_ms: d.getTime() };
      } else {
        const d = new Date(Number(value) * 1000);
        return { input: value, date: d.toISOString(), formatted: d.toDateString(), time: d.toTimeString() };
      }
    }
  },

  week_number: {
    category: "Date & Time",
    description: "Get week number of a date",
    inputSchema: {
      type: "object",
      properties: { date: { type: "string", description: "Date string or 'now'" } },
      required: ["date"]
    },
    handler: ({ date }) => {
      const d = new Date(date === 'now' ? new Date() : date);
      const startOfYear = new Date(d.getFullYear(), 0, 1);
      const week = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
      return { date: d.toDateString(), week_number: week, year: d.getFullYear(), day_of_year: Math.floor((d - startOfYear) / 86400000) + 1 };
    }
  },

  is_holiday: {
    category: "Date & Time",
    description: "Check if a date is a US Federal holiday",
    inputSchema: {
      type: "object",
      properties: { date: { type: "string", description: "YYYY-MM-DD" } },
      required: ["date"]
    },
    handler: ({ date }) => {
      const d = new Date(date);
      const m = d.getMonth() + 1, day = d.getDate(), wd = d.getDay();
      const holidays = {
        '1-1': "New Year's Day", '7-4': "Independence Day", '12-25': "Christmas Day",
        '11-11': "Veterans Day", '6-19': "Juneteenth"
      };
      const key = `${m}-${day}`;
      const staticHoliday = holidays[key];
      const mlkDay = m === 1 && wd === 1 && day >= 15 && day <= 21 ? "MLK Jr. Day" : null;
      const memDay = m === 5 && wd === 1 && day >= 25 ? "Memorial Day" : null;
      const laborDay = m === 9 && wd === 1 && day <= 7 ? "Labor Day" : null;
      const thanksgiving = m === 11 && wd === 4 && day >= 22 && day <= 28 ? "Thanksgiving Day" : null;
      const holiday = staticHoliday || mlkDay || memDay || laborDay || thanksgiving || null;
      return { date, is_holiday: !!holiday, holiday_name: holiday, day_of_week: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][wd] };
    }
  },

  // ══════════════════════════════════════════
  // 💼 BUSINESS & FINANCE TOOLS (12 tools)
  // ══════════════════════════════════════════

  invoice_generator: {
    category: "Business & Finance",
    description: "Generate invoice data structure",
    inputSchema: {
      type: "object",
      properties: {
        company_name: { type: "string" },
        client_name: { type: "string" },
        items: { type: "array", items: { type: "object", properties: { name: { type: "string" }, quantity: { type: "number" }, price: { type: "number" } } } },
        tax_rate: { type: "number", default: 0 },
        currency: { type: "string", default: "USD" },
        due_days: { type: "number", default: 30 }
      },
      required: ["company_name", "client_name", "items"]
    },
    handler: ({ company_name, client_name, items, tax_rate = 0, currency = "USD", due_days = 30 }) => {
      const subtotal = items.reduce((a, i) => a + i.quantity * i.price, 0);
      const tax = subtotal * tax_rate / 100;
      const total = subtotal + tax;
      const invoiceNum = `INV-${Date.now().toString().slice(-8)}`;
      const today = new Date();
      const due = new Date(today); due.setDate(due.getDate() + due_days);
      return {
        invoice_number: invoiceNum, company: company_name, client: client_name,
        date: today.toISOString().split('T')[0], due_date: due.toISOString().split('T')[0],
        items: items.map(i => ({ ...i, total: Math.round(i.quantity * i.price * 100) / 100 })),
        subtotal: Math.round(subtotal * 100) / 100,
        tax_rate, tax_amount: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100, currency,
        status: 'draft'
      };
    }
  },

  profit_margin_calculator: {
    category: "Business & Finance",
    description: "Calculate profit margin, markup, and break-even",
    inputSchema: {
      type: "object",
      properties: {
        cost: { type: "number" },
        revenue: { type: "number" },
        fixed_costs: { type: "number", default: 0 },
        variable_cost_per_unit: { type: "number", default: 0 },
        units_sold: { type: "number", default: 1 }
      },
      required: ["cost", "revenue"]
    },
    handler: ({ cost, revenue, fixed_costs = 0, variable_cost_per_unit = 0, units_sold = 1 }) => {
      const gross_profit = revenue - cost;
      const gross_margin = (gross_profit / revenue) * 100;
      const markup = (gross_profit / cost) * 100;
      const net_profit = gross_profit - fixed_costs;
      const net_margin = (net_profit / revenue) * 100;
      const break_even_units = variable_cost_per_unit > 0 ? Math.ceil(fixed_costs / (revenue / units_sold - variable_cost_per_unit)) : 0;
      return {
        revenue, cost, gross_profit: Math.round(gross_profit * 100) / 100,
        gross_margin_percent: Math.round(gross_margin * 100) / 100,
        markup_percent: Math.round(markup * 100) / 100,
        net_profit: Math.round(net_profit * 100) / 100,
        net_margin_percent: Math.round(net_margin * 100) / 100,
        break_even_units: break_even_units || 'N/A (no variable costs provided)',
        roi_percent: Math.round(((revenue - cost) / cost) * 10000) / 100
      };
    }
  },

  cash_flow_analyzer: {
    category: "Business & Finance",
    description: "Analyze cash flow from income and expense lists",
    inputSchema: {
      type: "object",
      properties: {
        income: { type: "array", items: { type: "object", properties: { name: { type: "string" }, amount: { type: "number" } } } },
        expenses: { type: "array", items: { type: "object", properties: { name: { type: "string" }, amount: { type: "number" } } } }
      },
      required: ["income", "expenses"]
    },
    handler: ({ income, expenses }) => {
      const totalIncome = income.reduce((a, i) => a + i.amount, 0);
      const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
      const net = totalIncome - totalExpenses;
      const topExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];
      return {
        total_income: Math.round(totalIncome * 100) / 100,
        total_expenses: Math.round(totalExpenses * 100) / 100,
        net_cash_flow: Math.round(net * 100) / 100,
        status: net >= 0 ? 'Positive' : 'Negative',
        expense_ratio: Math.round((totalExpenses / totalIncome) * 10000) / 100 + '%',
        savings_rate: Math.round((net / totalIncome) * 10000) / 100 + '%',
        largest_expense: topExpense,
        income_breakdown: income.map(i => ({ ...i, percent: Math.round((i.amount / totalIncome) * 10000) / 100 })),
        expense_breakdown: expenses.map(e => ({ ...e, percent: Math.round((e.amount / totalExpenses) * 10000) / 100 }))
      };
    }
  },

  npv_calculator: {
    category: "Business & Finance",
    description: "Calculate Net Present Value (NPV) of cash flows",
    inputSchema: {
      type: "object",
      properties: {
        initial_investment: { type: "number" },
        cash_flows: { type: "array", items: { type: "number" } },
        discount_rate_percent: { type: "number" }
      },
      required: ["initial_investment", "cash_flows", "discount_rate_percent"]
    },
    handler: ({ initial_investment, cash_flows, discount_rate_percent }) => {
      const r = discount_rate_percent / 100;
      const pvs = cash_flows.map((cf, i) => cf / Math.pow(1 + r, i + 1));
      const npv = pvs.reduce((a, b) => a + b, 0) - initial_investment;
      return {
        initial_investment, discount_rate_percent,
        cash_flows: cash_flows.map((cf, i) => ({ year: i + 1, cash_flow: cf, present_value: Math.round(pvs[i] * 100) / 100 })),
        total_pv: Math.round(pvs.reduce((a, b) => a + b, 0) * 100) / 100,
        npv: Math.round(npv * 100) / 100,
        decision: npv > 0 ? 'Accept (positive NPV)' : 'Reject (negative NPV)'
      };
    }
  },

  break_even_analysis: {
    category: "Business & Finance",
    description: "Calculate break-even point for a business",
    inputSchema: {
      type: "object",
      properties: {
        fixed_costs: { type: "number" },
        price_per_unit: { type: "number" },
        variable_cost_per_unit: { type: "number" }
      },
      required: ["fixed_costs", "price_per_unit", "variable_cost_per_unit"]
    },
    handler: ({ fixed_costs, price_per_unit, variable_cost_per_unit }) => {
      const contribution_margin = price_per_unit - variable_cost_per_unit;
      const break_even_units = fixed_costs / contribution_margin;
      const break_even_revenue = break_even_units * price_per_unit;
      const margin_of_safety_percent = ((price_per_unit - variable_cost_per_unit) / price_per_unit) * 100;
      return {
        fixed_costs, price_per_unit, variable_cost_per_unit,
        contribution_margin: Math.round(contribution_margin * 100) / 100,
        break_even_units: Math.ceil(break_even_units),
        break_even_revenue: Math.round(break_even_revenue * 100) / 100,
        contribution_margin_ratio: Math.round(margin_of_safety_percent * 100) / 100 + '%'
      };
    }
  },

  salary_to_hourly: {
    category: "Business & Finance",
    description: "Convert salary to hourly rate and vice versa",
    inputSchema: {
      type: "object",
      properties: {
        amount: { type: "number" },
        from: { type: "string", enum: ["hourly", "daily", "weekly", "biweekly", "monthly", "annually"] },
        hours_per_week: { type: "number", default: 40 },
        weeks_per_year: { type: "number", default: 52 }
      },
      required: ["amount", "from"]
    },
    handler: ({ amount, from, hours_per_week = 40, weeks_per_year = 52 }) => {
      const annual = {
        hourly: amount * hours_per_week * weeks_per_year,
        daily: amount * 5 * weeks_per_year,
        weekly: amount * weeks_per_year,
        biweekly: amount * 26,
        monthly: amount * 12,
        annually: amount
      }[from];
      const hourly = annual / (hours_per_week * weeks_per_year);
      return {
        input: `${amount} ${from}`,
        hourly: Math.round(hourly * 100) / 100,
        daily: Math.round(annual / (5 * weeks_per_year) * 100) / 100,
        weekly: Math.round(annual / weeks_per_year * 100) / 100,
        biweekly: Math.round(annual / 26 * 100) / 100,
        monthly: Math.round(annual / 12 * 100) / 100,
        annually: Math.round(annual * 100) / 100
      };
    }
  },

  stock_return_calculator: {
    category: "Business & Finance",
    description: "Calculate stock investment returns",
    inputSchema: {
      type: "object",
      properties: {
        buy_price: { type: "number" },
        sell_price: { type: "number" },
        shares: { type: "number" },
        dividends_received: { type: "number", default: 0 },
        buy_commission: { type: "number", default: 0 },
        sell_commission: { type: "number", default: 0 }
      },
      required: ["buy_price", "sell_price", "shares"]
    },
    handler: ({ buy_price, sell_price, shares, dividends_received = 0, buy_commission = 0, sell_commission = 0 }) => {
      const cost_basis = buy_price * shares + buy_commission;
      const proceeds = sell_price * shares - sell_commission + dividends_received;
      const profit = proceeds - cost_basis;
      const return_pct = (profit / cost_basis) * 100;
      return {
        shares, buy_price, sell_price,
        cost_basis: Math.round(cost_basis * 100) / 100,
        proceeds: Math.round(proceeds * 100) / 100,
        profit_loss: Math.round(profit * 100) / 100,
        return_percent: Math.round(return_pct * 100) / 100,
        outcome: profit >= 0 ? 'Profit' : 'Loss'
      };
    }
  },

  budget_planner: {
    category: "Business & Finance",
    description: "Create a budget plan using 50/30/20 or custom rules",
    inputSchema: {
      type: "object",
      properties: {
        monthly_income: { type: "number" },
        rule: { type: "string", enum: ["50-30-20", "70-20-10", "custom"], default: "50-30-20" },
        custom_splits: { type: "array", items: { type: "object" }, description: "[{name, percent}]" }
      },
      required: ["monthly_income"]
    },
    handler: ({ monthly_income, rule = "50-30-20", custom_splits }) => {
      let splits;
      if (rule === "50-30-20") splits = [{ name: "Needs", percent: 50 }, { name: "Wants", percent: 30 }, { name: "Savings", percent: 20 }];
      else if (rule === "70-20-10") splits = [{ name: "Living", percent: 70 }, { name: "Savings", percent: 20 }, { name: "Debt/Giving", percent: 10 }];
      else splits = custom_splits || [];
      return {
        monthly_income, rule,
        budget: splits.map(s => ({ ...s, amount: Math.round(monthly_income * s.percent / 100 * 100) / 100 })),
        annual_income: monthly_income * 12,
        annual_savings: splits.find(s => s.name.toLowerCase().includes('sav'))?.amount * 12 || 'N/A'
      };
    }
  },

  kpi_tracker: {
    category: "Business & Finance",
    description: "Calculate and track KPIs from business metrics",
    inputSchema: {
      type: "object",
      properties: {
        revenue: { type: "number" },
        customers: { type: "number" },
        new_customers: { type: "number" },
        lost_customers: { type: "number" },
        marketing_spend: { type: "number" },
        support_tickets: { type: "number" },
        resolved_tickets: { type: "number" }
      },
      required: ["revenue", "customers"]
    },
    handler: ({ revenue, customers, new_customers = 0, lost_customers = 0, marketing_spend = 0, support_tickets = 0, resolved_tickets = 0 }) => {
      const arpu = revenue / customers;
      const churn_rate = (lost_customers / customers) * 100;
      const growth_rate = ((new_customers - lost_customers) / customers) * 100;
      const cac = marketing_spend > 0 && new_customers > 0 ? marketing_spend / new_customers : 0;
      const ltv = churn_rate > 0 ? arpu / (churn_rate / 100) : 0;
      const resolution_rate = support_tickets > 0 ? (resolved_tickets / support_tickets) * 100 : 0;
      return {
        revenue, customers,
        arpu: Math.round(arpu * 100) / 100,
        churn_rate_percent: Math.round(churn_rate * 100) / 100,
        growth_rate_percent: Math.round(growth_rate * 100) / 100,
        customer_acquisition_cost: Math.round(cac * 100) / 100,
        lifetime_value: Math.round(ltv * 100) / 100,
        ltv_cac_ratio: cac > 0 ? Math.round((ltv / cac) * 100) / 100 : 'N/A',
        ticket_resolution_rate: Math.round(resolution_rate * 100) / 100 + '%'
      };
    }
  },

  generate_business_plan_outline: {
    category: "Business & Finance",
    description: "Generate a business plan outline for any industry",
    inputSchema: {
      type: "object",
      properties: {
        business_name: { type: "string" },
        industry: { type: "string" },
        business_type: { type: "string", enum: ["startup", "small_business", "enterprise", "nonprofit"] }
      },
      required: ["business_name", "industry"]
    },
    handler: ({ business_name, industry, business_type = "startup" }) => {
      const sections = [
        { section: "1. Executive Summary", points: ["Business description", "Mission statement", "Products/services overview", "Financial highlights", "Funding requirements"] },
        { section: "2. Company Overview", points: ["Business history", "Legal structure", "Location and facilities", "Team overview"] },
        { section: "3. Market Analysis", points: [`${industry} industry overview`, "Target market definition", "Market size (TAM/SAM/SOM)", "Competitor analysis", "Market trends"] },
        { section: "4. Products & Services", points: ["Product/service description", "Unique value proposition", "Pricing strategy", "Intellectual property"] },
        { section: "5. Marketing Strategy", points: ["Customer acquisition channels", "Brand positioning", "Digital marketing plan", "Sales strategy"] },
        { section: "6. Operations Plan", points: ["Day-to-day operations", "Supply chain", "Technology infrastructure", "Key partnerships"] },
        { section: "7. Financial Projections", points: ["Revenue model", "3-year projections", "Break-even analysis", "Funding needs & use of funds"] },
        { section: "8. Risk Analysis", points: ["Key risks identified", "Mitigation strategies", "Contingency plans"] }
      ];
      return { business_name, industry, business_type, outline: sections, estimated_pages: sections.length * 2 };
    }
  },

  swot_template: {
    category: "Business & Finance",
    description: "Generate a SWOT analysis template for a business",
    inputSchema: {
      type: "object",
      properties: {
        business_name: { type: "string" },
        industry: { type: "string" }
      },
      required: ["business_name"]
    },
    handler: ({ business_name, industry = "your industry" }) => ({
      business: business_name,
      swot: {
        strengths: { label: "Strengths (Internal, Positive)", prompts: ["What does the company do well?", "Unique resources or capabilities?", "Strong brand/reputation?", "Patent or proprietary technology?", "Cost advantages?"] },
        weaknesses: { label: "Weaknesses (Internal, Negative)", prompts: ["What could be improved?", "Limited resources?", "Gaps in expertise?", "Negative brand perception?", "High operational costs?"] },
        opportunities: { label: "Opportunities (External, Positive)", prompts: [`Emerging trends in ${industry}?`, "New market segments?", "Technology changes?", "Competitor vulnerabilities?", "Regulatory changes?"] },
        threats: { label: "Threats (External, Negative)", prompts: ["New competitors?", "Changing customer needs?", "Economic downturns?", "Supply chain risks?", "Regulatory challenges?"] }
      }
    })
  },

  roi_calculator: {
    category: "Business & Finance",
    description: "Calculate ROI for any investment",
    inputSchema: {
      type: "object",
      properties: {
        investment: { type: "number" },
        returns: { type: "number" },
        time_period_months: { type: "number", default: 12 }
      },
      required: ["investment", "returns"]
    },
    handler: ({ investment, returns, time_period_months = 12 }) => {
      const roi = ((returns - investment) / investment) * 100;
      const annualized = roi * (12 / time_period_months);
      return {
        investment, returns, time_period_months,
        profit: Math.round((returns - investment) * 100) / 100,
        roi_percent: Math.round(roi * 100) / 100,
        annualized_roi_percent: Math.round(annualized * 100) / 100,
        payback_months: Math.ceil(investment / ((returns - investment) / time_period_months))
      };
    }
  },

  // ══════════════════════════════════════════
  // 💻 DEVELOPER TOOLS (12 tools)
  // ══════════════════════════════════════════

  generate_uuid: {
    category: "Developer Tools",
    description: "Generate UUIDs in v4 format",
    inputSchema: {
      type: "object",
      properties: { count: { type: "number", default: 1 } }
    },
    handler: ({ count = 1 }) => {
      const genUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      const uuids = Array.from({ length: Math.min(count, 50) }, genUUID);
      return { uuids, count: uuids.length };
    }
  },

  hash_generator: {
    category: "Developer Tools",
    description: "Generate checksums and hashes (CRC32, basic hashes)",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        algorithm: { type: "string", enum: ["simple32", "djb2", "sdbm", "adler32"] }
      },
      required: ["text", "algorithm"]
    },
    handler: ({ text, algorithm }) => {
      const algorithms = {
        simple32: (s) => {
          let h = 0;
          for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
          return (h >>> 0).toString(16).padStart(8, '0');
        },
        djb2: (s) => {
          let h = 5381;
          for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
          return (h >>> 0).toString(16);
        },
        sdbm: (s) => {
          let h = 0;
          for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + (h << 6) + (h << 16) - h;
          return (h >>> 0).toString(16);
        },
        adler32: (s) => {
          let a = 1, b = 0;
          for (let i = 0; i < s.length; i++) { a = (a + s.charCodeAt(i)) % 65521; b = (b + a) % 65521; }
          return ((b << 16) | a).toString(16);
        }
      };
      return { text, algorithm, hash: algorithms[algorithm](text), note: 'For cryptographic hashing use SHA-256 via Node.js crypto module' };
    }
  },

  generate_regex: {
    category: "Developer Tools",
    description: "Generate common regex patterns",
    inputSchema: {
      type: "object",
      properties: {
        pattern_type: { type: "string", enum: ["email", "phone_us", "url", "ip_address", "credit_card", "zip_code", "date_us", "date_iso", "hex_color", "username", "strong_password", "ssn", "mac_address"] }
      },
      required: ["pattern_type"]
    },
    handler: ({ pattern_type }) => {
      const patterns = {
        email: { pattern: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/', description: 'Standard email validation' },
        phone_us: { pattern: '/^(\\+1)?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$/', description: 'US phone number' },
        url: { pattern: '/https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&\\/=]*)/', description: 'URL with http/https' },
        ip_address: { pattern: '/^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$/', description: 'IPv4 address' },
        credit_card: { pattern: '/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11})$/', description: 'Visa, MC, Amex, Discover' },
        zip_code: { pattern: '/^\\d{5}(-\\d{4})?$/', description: 'US ZIP code' },
        date_us: { pattern: '/^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/(19|20)\\d{2}$/', description: 'US date MM/DD/YYYY' },
        date_iso: { pattern: '/^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/', description: 'ISO date YYYY-MM-DD' },
        hex_color: { pattern: '/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', description: 'Hexadecimal color' },
        username: { pattern: '/^[a-zA-Z0-9_]{3,20}$/', description: 'Username 3-20 chars, letters, numbers, underscore' },
        strong_password: { pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/', description: 'Min 8 chars, upper, lower, number, special char' },
        ssn: { pattern: '/^\\d{3}-\\d{2}-\\d{4}$/', description: 'US Social Security Number' },
        mac_address: { pattern: '/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/', description: 'MAC address' }
      };
      return { pattern_type, ...patterns[pattern_type] };
    }
  },

  code_complexity: {
    category: "Developer Tools",
    description: "Analyze code complexity metrics",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string" },
        language: { type: "string", enum: ["javascript", "python", "java", "generic"] }
      },
      required: ["code"]
    },
    handler: ({ code, language = "generic" }) => {
      const lines = code.split('\n');
      const codeLines = lines.filter(l => l.trim() && !l.trim().startsWith('//') && !l.trim().startsWith('#') && !l.trim().startsWith('*'));
      const functions = (code.match(/function\s+\w+|def\s+\w+|const\s+\w+\s*=\s*(?:async\s*)?\(/g) || []).length;
      const conditionals = (code.match(/\bif\b|\belse\b|\bswitch\b|\bcase\b|\bwhile\b|\bfor\b|\bcatch\b/g) || []).length;
      const complexity = 1 + conditionals;
      const level = complexity <= 5 ? 'Low' : complexity <= 10 ? 'Medium' : complexity <= 20 ? 'High' : 'Very High';
      return {
        total_lines: lines.length,
        code_lines: codeLines.length,
        blank_lines: lines.filter(l => !l.trim()).length,
        comment_lines: lines.length - codeLines.length - lines.filter(l => !l.trim()).length,
        functions_detected: functions,
        cyclomatic_complexity: complexity,
        complexity_level: level,
        avg_line_length: Math.round(lines.reduce((a, l) => a + l.length, 0) / lines.length),
        recommendation: complexity > 10 ? 'Consider refactoring complex functions' : 'Code complexity is acceptable'
      };
    }
  },

  api_endpoint_generator: {
    category: "Developer Tools",
    description: "Generate RESTful API endpoint structure",
    inputSchema: {
      type: "object",
      properties: {
        resource: { type: "string", description: "Resource name e.g. 'users', 'products'" },
        base_url: { type: "string", default: "https://api.example.com/v1" },
        include_auth: { type: "boolean", default: true }
      },
      required: ["resource"]
    },
    handler: ({ resource, base_url = "https://api.example.com/v1", include_auth = true }) => {
      const r = resource.toLowerCase();
      const R = resource.charAt(0).toUpperCase() + resource.slice(1);
      const auth = include_auth ? { headers: { Authorization: "Bearer {token}" } } : {};
      return {
        resource, endpoints: [
          { method: "GET", url: `${base_url}/${r}`, description: `List all ${r}`, ...auth, query_params: ["page", "limit", "sort", "filter"] },
          { method: "POST", url: `${base_url}/${r}`, description: `Create a new ${r.slice(0, -1)}`, ...auth, body: `{${r.slice(0, -1)} object}` },
          { method: "GET", url: `${base_url}/${r}/{id}`, description: `Get a specific ${r.slice(0, -1)}`, ...auth },
          { method: "PUT", url: `${base_url}/${r}/{id}`, description: `Update a ${r.slice(0, -1)} (full)`, ...auth, body: `{${r.slice(0, -1)} object}` },
          { method: "PATCH", url: `${base_url}/${r}/{id}`, description: `Partially update a ${r.slice(0, -1)}`, ...auth, body: `{partial ${r.slice(0, -1)} fields}` },
          { method: "DELETE", url: `${base_url}/${r}/{id}`, description: `Delete a ${r.slice(0, -1)}`, ...auth }
        ],
        openapi_tag: R
      };
    }
  },

  sql_query_builder: {
    category: "Developer Tools",
    description: "Build common SQL queries",
    inputSchema: {
      type: "object",
      properties: {
        query_type: { type: "string", enum: ["select", "insert", "update", "delete", "create_table"] },
        table: { type: "string" },
        columns: { type: "array", items: { type: "string" } },
        conditions: { type: "string" },
        values: { type: "object" }
      },
      required: ["query_type", "table"]
    },
    handler: ({ query_type, table, columns = ['*'], conditions, values = {} }) => {
      const queries = {
        select: `SELECT ${columns.join(', ')}\nFROM ${table}${conditions ? `\nWHERE ${conditions}` : ''};`,
        insert: `INSERT INTO ${table} (${Object.keys(values).join(', ')})\nVALUES (${Object.values(values).map(v => typeof v === 'string' ? `'${v}'` : v).join(', ')});`,
        update: `UPDATE ${table}\nSET ${Object.entries(values).map(([k, v]) => `${k} = ${typeof v === 'string' ? `'${v}'` : v}`).join(', ')}${conditions ? `\nWHERE ${conditions}` : ''};`,
        delete: `DELETE FROM ${table}${conditions ? `\nWHERE ${conditions}` : ''};`,
        create_table: `CREATE TABLE IF NOT EXISTS ${table} (\n  id SERIAL PRIMARY KEY,\n  ${columns.filter(c => c !== '*').map(c => `${c} VARCHAR(255)`).join(',\n  ')},\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`
      };
      return { query: queries[query_type], query_type, table, warning: query_type === 'delete' && !conditions ? '⚠️ No WHERE clause - this will delete ALL rows!' : null };
    }
  },

  generate_mock_data: {
    category: "Developer Tools",
    description: "Generate realistic mock/test data",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["users", "products", "orders", "companies", "addresses"] },
        count: { type: "number", default: 5 }
      },
      required: ["type"]
    },
    handler: ({ type, count = 5 }) => {
      const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
      const rndNum = (min, max) => Math.floor(Math.random() * (max - min) + min);
      const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Hank', 'Iris', 'Jack'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Martinez'];
      const companies = ['Acme Corp', 'Initech', 'Globex', 'Hooli', 'Pied Piper', 'Vandelay Industries', 'Sterling Cooper'];
      const products = ['Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Headphones', 'Webcam', 'Speaker', 'Printer'];
      const streets = ['Main St', 'Oak Ave', 'Park Rd', 'Elm St', 'Maple Dr', 'Cedar Ln', 'Pine Way', 'Lake Blvd'];
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
      const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA'];
      const generators = {
        users: () => ({ id: rndNum(1000, 9999), name: `${rnd(firstNames)} ${rnd(lastNames)}`, email: `${rnd(firstNames).toLowerCase()}.${rnd(lastNames).toLowerCase()}@email.com`, age: rndNum(18, 65), company: rnd(companies), phone: `+1-${rndNum(200,999)}-${rndNum(100,999)}-${rndNum(1000,9999)}` }),
        products: () => ({ id: rndNum(100, 999), name: rnd(products), price: rndNum(10, 999) + 0.99, sku: `SKU-${rndNum(10000, 99999)}`, stock: rndNum(0, 500), category: 'Electronics' }),
        orders: () => ({ id: `ORD-${rndNum(10000, 99999)}`, customer: `${rnd(firstNames)} ${rnd(lastNames)}`, total: rndNum(20, 2000) + 0.99, status: rnd(['pending', 'shipped', 'delivered', 'cancelled']), date: new Date(Date.now() - rndNum(0, 30) * 86400000).toISOString().split('T')[0] }),
        companies: () => ({ name: rnd(companies), industry: rnd(['Tech', 'Finance', 'Healthcare', 'Retail']), employees: rndNum(10, 10000), revenue: `$${rndNum(1, 500)}M`, founded: rndNum(1980, 2020) }),
        addresses: () => ({ street: `${rndNum(1, 9999)} ${rnd(streets)}`, city: rnd(cities), state: rnd(states), zip: rndNum(10000, 99999).toString(), country: 'USA' })
      };
      return { type, data: Array.from({ length: Math.min(count, 100) }, generators[type]) };
    }
  },

  color_palette_generator: {
    category: "Developer Tools",
    description: "Generate color palettes from a base color",
    inputSchema: {
      type: "object",
      properties: {
        base_hex: { type: "string", description: "Base color in hex e.g. #3B82F6" },
        palette_type: { type: "string", enum: ["monochromatic", "complementary", "triadic", "analogous"], default: "monochromatic" }
      },
      required: ["base_hex"]
    },
    handler: ({ base_hex, palette_type = "monochromatic" }) => {
      const hex = base_hex.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const toHex = (r, g, b) => '#' + [r, g, b].map(x => Math.min(255, Math.max(0, Math.round(x))).toString(16).padStart(2, '0')).join('').toUpperCase();
      let palette = [];
      if (palette_type === 'monochromatic') {
        palette = [
          { name: 'Darkest', hex: toHex(r * 0.3, g * 0.3, b * 0.3) },
          { name: 'Dark', hex: toHex(r * 0.6, g * 0.6, b * 0.6) },
          { name: 'Base', hex: base_hex.toUpperCase() },
          { name: 'Light', hex: toHex(r + (255 - r) * 0.4, g + (255 - g) * 0.4, b + (255 - b) * 0.4) },
          { name: 'Lightest', hex: toHex(r + (255 - r) * 0.8, g + (255 - g) * 0.8, b + (255 - b) * 0.8) }
        ];
      } else if (palette_type === 'complementary') {
        palette = [
          { name: 'Primary', hex: base_hex.toUpperCase() },
          { name: 'Complement', hex: toHex(255 - r, 255 - g, 255 - b) }
        ];
      } else if (palette_type === 'triadic') {
        palette = [
          { name: 'Color 1', hex: base_hex.toUpperCase() },
          { name: 'Color 2', hex: toHex(g, b, r) },
          { name: 'Color 3', hex: toHex(b, r, g) }
        ];
      } else {
        palette = [
          { name: 'Analogous 1', hex: toHex(r, g * 0.8, b * 1.2) },
          { name: 'Base', hex: base_hex.toUpperCase() },
          { name: 'Analogous 2', hex: toHex(r * 1.2, g, b * 0.8) }
        ];
      }
      return { base_color: base_hex, palette_type, palette };
    }
  },

  cron_expression_parser: {
    category: "Developer Tools",
    description: "Parse and explain cron expressions",
    inputSchema: {
      type: "object",
      properties: { expression: { type: "string", description: "Cron expression e.g. '0 9 * * 1-5'" } },
      required: ["expression"]
    },
    handler: ({ expression }) => {
      const parts = expression.trim().split(/\s+/);
      if (parts.length !== 5) return { error: 'Cron must have 5 parts: minute hour day month weekday' };
      const [min, hour, day, month, weekday] = parts;
      const explain = (val, name, special) => val === '*' ? `Every ${name}` : val.includes('-') ? `${name}s ${val}` : val.includes('/') ? `Every ${val.split('/')[1]} ${name}s` : val.includes(',') ? `${name}s: ${val}` : `${name} ${val}${special ? ` (${special[val] || ''})` : ''}`;
      const months = { 1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December' };
      const days = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
      const common = {
        '* * * * *': 'Every minute', '0 * * * *': 'Every hour', '0 9 * * 1-5': 'Every weekday at 9 AM',
        '0 0 * * *': 'Daily at midnight', '0 0 * * 0': 'Weekly on Sunday', '0 0 1 * *': 'Monthly on 1st'
      };
      return {
        expression, human_readable: common[expression] || `At ${explain(min, 'minute')} | ${explain(hour, 'hour')} | ${explain(day, 'day')} | ${explain(month, 'month', months)} | ${explain(weekday, 'weekday', days)}`,
        breakdown: { minute: explain(min, 'minute'), hour: explain(hour, 'hour'), day: explain(day, 'day'), month: explain(month, 'month', months), weekday: explain(weekday, 'weekday', days) },
        common_patterns: ['* * * * * (Every minute)', '0 * * * * (Every hour)', '0 9 * * 1-5 (Weekdays 9AM)', '0 0 * * * (Daily midnight)', '0 0 1 * * (Monthly)']
      };
    }
  },

  git_commit_message: {
    category: "Developer Tools",
    description: "Generate conventional git commit messages",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["feat", "fix", "docs", "style", "refactor", "test", "chore", "perf", "ci", "build"] },
        scope: { type: "string" },
        description: { type: "string" },
        breaking_change: { type: "boolean", default: false },
        body: { type: "string" }
      },
      required: ["type", "description"]
    },
    handler: ({ type, scope, description, breaking_change = false, body }) => {
      const header = `${type}${scope ? `(${scope})` : ''}${breaking_change ? '!' : ''}: ${description}`;
      const full = [header, body ? '' : null, body ? body : null, breaking_change ? '\nBREAKING CHANGE: This is a breaking change' : null].filter(Boolean).join('\n');
      return { commit_message: full, header, conventional_commits_compliant: true, type_description: { feat: 'New feature', fix: 'Bug fix', docs: 'Documentation', style: 'Formatting', refactor: 'Code restructure', test: 'Tests', chore: 'Maintenance', perf: 'Performance', ci: 'CI/CD', build: 'Build system' }[type] };
    }
  },

  environment_variable_generator: {
    category: "Developer Tools",
    description: "Generate .env file template from a list of variables",
    inputSchema: {
      type: "object",
      properties: {
        app_name: { type: "string" },
        variables: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, default_value: { type: "string" }, required: { type: "boolean" } } } },
        environments: { type: "array", items: { type: "string" }, default: ["development", "production"] }
      },
      required: ["app_name", "variables"]
    },
    handler: ({ app_name, variables, environments = ["development", "production"] }) => {
      const envFile = `# ${app_name} Environment Variables\n# Generated: ${new Date().toISOString()}\n\n` +
        variables.map(v => `# ${v.description || v.name}${v.required ? ' (REQUIRED)' : ''}\n${v.name}=${v.default_value || ''}`).join('\n\n');
      return { app_name, env_file: envFile, variable_count: variables.length, environments };
    }
  },

  // ══════════════════════════════════════════
  // 🤖 AI PROMPTS & TEMPLATES (10 tools)
  // ══════════════════════════════════════════

  generate_system_prompt: {
    category: "AI Prompts",
    description: "Generate system prompts for AI assistants",
    inputSchema: {
      type: "object",
      properties: {
        role: { type: "string", description: "e.g. customer support agent" },
        company: { type: "string" },
        tone: { type: "string", enum: ["professional", "friendly", "technical", "concise"] },
        capabilities: { type: "array", items: { type: "string" } },
        restrictions: { type: "array", items: { type: "string" } }
      },
      required: ["role"]
    },
    handler: ({ role, company = "our company", tone = "professional", capabilities = [], restrictions = [] }) => {
      const prompt = `You are a ${tone} ${role} for ${company}.

## Your Capabilities
${capabilities.length ? capabilities.map(c => `- ${c}`).join('\n') : '- Answer questions related to your role\n- Provide helpful and accurate information\n- Escalate complex issues appropriately'}

## Guidelines
- Always be ${tone} and respectful
- Stay focused on your role as ${role}
- If you don't know something, say so honestly
- Never make up information

${restrictions.length ? `## Restrictions\n${restrictions.map(r => `- ${r}`).join('\n')}` : ''}

## Response Format
- Keep responses clear and concise
- Use bullet points for lists
- Ask clarifying questions when needed`;
      return { system_prompt: prompt, character_count: prompt.length, role, company };
    }
  },

  chain_of_thought_prompt: {
    category: "AI Prompts",
    description: "Wrap a problem in chain-of-thought reasoning prompt",
    inputSchema: {
      type: "object",
      properties: {
        problem: { type: "string" },
        domain: { type: "string", enum: ["math", "logic", "business", "coding", "general"] }
      },
      required: ["problem"]
    },
    handler: ({ problem, domain = "general" }) => ({
      enhanced_prompt: `Let's think through this step by step.

Problem: ${problem}

Please:
1. Identify the key components of this problem
2. List any assumptions you're making
3. Work through the solution systematically
4. Show your reasoning at each step
5. State your final answer clearly
6. Verify the answer makes sense

Domain context: ${domain}

Think carefully and show all your work.`,
      original_problem: problem, domain
    })
  },

  few_shot_template: {
    category: "AI Prompts",
    description: "Generate few-shot learning prompt templates",
    inputSchema: {
      type: "object",
      properties: {
        task: { type: "string" },
        examples: { type: "array", items: { type: "object", properties: { input: { type: "string" }, output: { type: "string" } } } },
        new_input: { type: "string" }
      },
      required: ["task", "examples"]
    },
    handler: ({ task, examples, new_input }) => {
      const examplesText = examples.map((e, i) => `Example ${i + 1}:\nInput: ${e.input}\nOutput: ${e.output}`).join('\n\n');
      const prompt = `Task: ${task}\n\nHere are some examples:\n\n${examplesText}\n\nNow apply the same pattern to:\nInput: ${new_input || '[YOUR INPUT HERE]'}\nOutput:`;
      return { prompt, task, example_count: examples.length };
    }
  },

  email_template_generator: {
    category: "AI Prompts",
    description: "Generate professional email templates",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["welcome", "follow_up", "cold_outreach", "apology", "rejection", "proposal", "invoice_reminder", "thank_you", "announcement"] },
        recipient_name: { type: "string" },
        sender_name: { type: "string" },
        company: { type: "string" },
        key_details: { type: "string" }
      },
      required: ["type", "recipient_name", "sender_name"]
    },
    handler: ({ type, recipient_name, sender_name, company = "our company", key_details = "" }) => {
      const templates = {
        welcome: { subject: `Welcome to ${company}!`, body: `Hi ${recipient_name},\n\nWelcome to ${company}! We're thrilled to have you on board.\n\n${key_details}\n\nIf you have any questions, don't hesitate to reach out.\n\nBest regards,\n${sender_name}` },
        follow_up: { subject: `Following up on our conversation`, body: `Hi ${recipient_name},\n\nI wanted to follow up on our recent conversation. ${key_details}\n\nWould you be available for a quick call this week?\n\nBest,\n${sender_name}` },
        cold_outreach: { subject: `Quick question about ${company}`, body: `Hi ${recipient_name},\n\nI hope this finds you well. I came across your work and was impressed by what you're doing.\n\n${key_details}\n\nWould you be open to a brief 15-minute call?\n\nBest regards,\n${sender_name}` },
        apology: { subject: `Our sincere apologies`, body: `Dear ${recipient_name},\n\nWe sincerely apologize for the inconvenience caused. ${key_details}\n\nWe take full responsibility and are committed to making this right. Please let us know how we can help.\n\nSincerely,\n${sender_name}` },
        proposal: { subject: `Proposal from ${company}`, body: `Dear ${recipient_name},\n\nThank you for the opportunity to present our proposal.\n\n${key_details}\n\nI'd be happy to walk you through the details at your convenience.\n\nBest regards,\n${sender_name}` },
        invoice_reminder: { subject: `Invoice Payment Reminder`, body: `Dear ${recipient_name},\n\nThis is a friendly reminder that your invoice is due.\n\n${key_details}\n\nPlease let us know if you have any questions.\n\nThank you,\n${sender_name}` },
        thank_you: { subject: `Thank you, ${recipient_name}!`, body: `Dear ${recipient_name},\n\nThank you so much for your time and support.\n\n${key_details}\n\nIt's a pleasure working with you.\n\nWarm regards,\n${sender_name}` },
        rejection: { subject: `Regarding your application`, body: `Dear ${recipient_name},\n\nThank you for your interest and the time you invested. ${key_details}\n\nWhile we won't be moving forward at this time, we encourage you to apply for future opportunities.\n\nBest wishes,\n${sender_name}` },
        announcement: { subject: `Exciting News from ${company}!`, body: `Dear ${recipient_name},\n\nWe're excited to share some news with you!\n\n${key_details}\n\nStay tuned for more updates. Thank you for your continued support!\n\nBest,\n${sender_name}` }
      };
      return templates[type];
    }
  },

  job_description_generator: {
    category: "AI Prompts",
    description: "Generate job description template",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        company: { type: "string" },
        department: { type: "string" },
        employment_type: { type: "string", enum: ["full-time", "part-time", "contract", "internship"] },
        experience_years: { type: "number" },
        location: { type: "string" },
        salary_range: { type: "string" }
      },
      required: ["title", "company"]
    },
    handler: ({ title, company, department = "General", employment_type = "full-time", experience_years = 3, location = "Remote", salary_range = "Competitive" }) => ({
      job_description: `# ${title}\n**Company:** ${company}\n**Department:** ${department}\n**Type:** ${employment_type}\n**Location:** ${location}\n**Salary:** ${salary_range}\n\n## About the Role\nWe are looking for an experienced ${title} to join our ${department} team at ${company}. You will play a key role in driving our mission forward.\n\n## Requirements\n- ${experience_years}+ years of experience in a related role\n- Strong communication and collaboration skills\n- Problem-solving mindset\n- [Add specific technical skills]\n- [Add domain expertise]\n\n## Responsibilities\n- Lead key initiatives within the ${department} team\n- Collaborate cross-functionally to deliver results\n- Drive continuous improvement\n- Mentor junior team members\n- [Add role-specific responsibilities]\n\n## What We Offer\n- Competitive salary: ${salary_range}\n- Health, dental, and vision insurance\n- Flexible work arrangements\n- Professional development budget\n- [Add company perks]\n\n## How to Apply\nSend your resume and cover letter to careers@${company.toLowerCase().replace(/\s/g, '')}.com`,
      title, company, employment_type
    })
  },

  meeting_agenda_generator: {
    category: "AI Prompts",
    description: "Generate a structured meeting agenda",
    inputSchema: {
      type: "object",
      properties: {
        meeting_title: { type: "string" },
        duration_minutes: { type: "number", default: 60 },
        attendees: { type: "array", items: { type: "string" } },
        topics: { type: "array", items: { type: "string" } },
        meeting_type: { type: "string", enum: ["team_standup", "project_kickoff", "retrospective", "planning", "all_hands", "one_on_one", "custom"] }
      },
      required: ["meeting_title"]
    },
    handler: ({ meeting_title, duration_minutes = 60, attendees = [], topics = [], meeting_type = "custom" }) => {
      const defaultTopics = {
        team_standup: ["What did you accomplish yesterday?", "What will you work on today?", "Any blockers?"],
        project_kickoff: ["Project overview & goals", "Roles & responsibilities", "Timeline & milestones", "Risk identification", "Next steps"],
        retrospective: ["What went well?", "What could be improved?", "Action items for next sprint"],
        planning: ["Priority review", "Sprint goal setting", "Task assignment", "Capacity planning"],
        all_hands: ["Company updates", "Department highlights", "Q&A session", "Upcoming events"],
        one_on_one: ["Check-in & wellbeing", "Progress on goals", "Challenges & support needed", "Feedback exchange"],
        custom: topics.length ? topics : ["Topic 1", "Topic 2", "Discussion"]
      };
      const agendaTopics = topics.length ? topics : defaultTopics[meeting_type];
      const timePerTopic = Math.floor((duration_minutes - 10) / agendaTopics.length);
      const agenda = `# ${meeting_title}\n**Duration:** ${duration_minutes} minutes\n**Attendees:** ${attendees.length ? attendees.join(', ') : 'TBD'}\n\n## Agenda\n\n${agendaTopics.map((t, i) => `${i + 1}. ${t} *(${timePerTopic} min)*`).join('\n')}\n\n## Action Items\n- [ ] \n- [ ] \n\n## Notes\n\n## Decisions Made\n`;
      return { agenda, meeting_title, duration_minutes, topics: agendaTopics, estimated_time_per_topic: timePerTopic };
    }
  },

  user_story_generator: {
    category: "AI Prompts",
    description: "Generate Agile user stories with acceptance criteria",
    inputSchema: {
      type: "object",
      properties: {
        feature: { type: "string" },
        user_type: { type: "string", default: "user" },
        goal: { type: "string" },
        reason: { type: "string" }
      },
      required: ["feature", "goal"]
    },
    handler: ({ feature, user_type = "user", goal, reason = "achieve my objective" }) => ({
      user_story: `As a **${user_type}**, I want to **${goal}** so that I can **${reason}**.`,
      feature,
      acceptance_criteria: [
        `Given I am a ${user_type}`,
        `When I interact with the ${feature} feature`,
        `Then I should be able to ${goal}`,
        `And the system should respond within acceptable time`,
        `And I should receive appropriate feedback`
      ],
      definition_of_done: ["Feature implemented and tested", "Unit tests written and passing", "Code reviewed and approved", "Documentation updated", "Product owner sign-off"],
      story_points_estimate: "TBD",
      priority: "Medium"
    })
  },

  okr_generator: {
    category: "AI Prompts",
    description: "Generate OKR (Objectives & Key Results) framework",
    inputSchema: {
      type: "object",
      properties: {
        objective: { type: "string" },
        team: { type: "string" },
        timeframe: { type: "string", default: "Q1 2025" },
        key_results_count: { type: "number", default: 3 }
      },
      required: ["objective"]
    },
    handler: ({ objective, team = "Team", timeframe = "Q1 2025", key_results_count = 3 }) => ({
      okr: {
        objective: { statement: objective, owner: team, timeframe },
        key_results: Array.from({ length: key_results_count }, (_, i) => ({
          id: i + 1,
          description: `Key Result ${i + 1}: [Specific, measurable outcome related to "${objective}"]`,
          metric: "Define metric (e.g., increase X from Y to Z)",
          baseline: "Current value",
          target: "Target value",
          progress: "0%"
        }))
      },
      tips: ["Make key results measurable (numbers, %)", "Aim for 70% completion as success (stretch goals)", "Review weekly, reassess quarterly"]
    })
  },

  content_calendar_generator: {
    category: "AI Prompts",
    description: "Generate a content calendar for social media",
    inputSchema: {
      type: "object",
      properties: {
        brand: { type: "string" },
        industry: { type: "string" },
        platforms: { type: "array", items: { type: "string" } },
        posts_per_week: { type: "number", default: 5 },
        content_pillars: { type: "array", items: { type: "string" } }
      },
      required: ["brand", "industry"]
    },
    handler: ({ brand, industry, platforms = ["LinkedIn", "Twitter", "Instagram"], posts_per_week = 5, content_pillars = ["Educational", "Entertaining", "Promotional", "Inspirational", "Engagement"] }) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const calendar = days.slice(0, posts_per_week).map((day, i) => ({
        day, platform: platforms[i % platforms.length],
        content_pillar: content_pillars[i % content_pillars.length],
        post_idea: `${content_pillars[i % content_pillars.length]} post about ${industry} for ${brand}`,
        best_time: ['9:00 AM', '12:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'][i],
        hashtag_tip: `#${industry.replace(/\s/g, '')} #${brand.replace(/\s/g, '')} #[trending hashtag]`
      }));
      return { brand, industry, platforms, weekly_calendar: calendar, content_pillars, monthly_posts_estimate: posts_per_week * 4 };
    }
  },

  press_release_template: {
    category: "AI Prompts",
    description: "Generate a press release template",
    inputSchema: {
      type: "object",
      properties: {
        company: { type: "string" },
        headline: { type: "string" },
        subheadline: { type: "string" },
        city: { type: "string" },
        news_summary: { type: "string" },
        quote_person: { type: "string" },
        quote_title: { type: "string" }
      },
      required: ["company", "headline"]
    },
    handler: ({ company, headline, subheadline = "", city = "San Francisco", news_summary = "", quote_person = "CEO", quote_title = "Chief Executive Officer" }) => ({
      press_release: `FOR IMMEDIATE RELEASE

${headline.toUpperCase()}
${subheadline}

${city}, ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — ${company} today announced [key announcement here].

${news_summary}

"[Compelling quote about why this matters]," said ${quote_person}, ${quote_title} of ${company}. "[Second sentence expanding on the quote]."

[Additional paragraph with supporting details, data, or context]

About ${company}
${company} is [brief 2-3 sentence company description]. For more information, visit [website].

###

Media Contact:
[Name]
[Title]
[Email]
[Phone]`,
      company, headline
    })
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MCP REQUEST HANDLER
// ─────────────────────────────────────────────────────────────────────────────

function handleMCPRequest(body) {
  const { method, params, id } = body;

  if (method === 'initialize') {
    return {
      jsonrpc: "2.0", id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "Ultimate All-in-One MCP Server", version: "1.0.0" }
      }
    };
  }

  if (method === 'tools/list') {
    const tools = Object.entries(TOOLS).map(([name, def]) => ({
      name,
      description: `[${def.category}] ${def.description}`,
      inputSchema: def.inputSchema
    }));
    return { jsonrpc: "2.0", id, result: { tools } };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;
    const tool = TOOLS[name];
    if (!tool) {
      return { jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown tool: ${name}` } };
    }
    try {
      const result = tool.handler(args || {});
      return {
        jsonrpc: "2.0", id,
        result: {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        }
      };
    } catch (err) {
      return { jsonrpc: "2.0", id, error: { code: -32000, message: err.message } };
    }
  }

  return { jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown method: ${method}` } };
}

// ─────────────────────────────────────────────────────────────────────────────
// VERCEL SERVERLESS EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const response = handleMCPRequest(body);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({ jsonrpc: "2.0", error: { code: -32700, message: 'Parse error' } });
  }
}
