import DOMPurify from "dompurify";

export const sanitizeInput = (input: string) => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}