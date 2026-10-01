import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize untrusted HTML before rendering (e.g. policy/blog previews).
 */
export function sanitizeHtml(html) {
  if (html == null || html === "") {
    return "";
  }
  return DOMPurify.sanitize(String(html));
}
