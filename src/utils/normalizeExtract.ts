export function normalizeExtract(extract: string) {
  const [content] = extract.split("<|endoftext|>");
  return content ?? "";
}
