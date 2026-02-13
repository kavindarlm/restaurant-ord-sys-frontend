/**
 * Simple input validation helpers to detect script-like input.
 * These checks block obvious script tags, inline event handlers (e.g., onclick=),
 * and javascript: URIs. This is a frontend defense to show an error and block saves.
 */

export function containsScriptOrEvent(input) {
  if (!input || typeof input !== "string") return false;

  // Detect <script> tags
  const scriptTag = /<\s*script\b/i;
  // Detect inline event handlers like onerror=, onclick=, onload=, etc.
  const eventHandler = /on\w+\s*=\s*/i;
  // Detect javascript: URIs
  const jsProtocol = /javascript\s*:/i;

  return scriptTag.test(input) || eventHandler.test(input) || jsProtocol.test(input);
}

export default containsScriptOrEvent;
