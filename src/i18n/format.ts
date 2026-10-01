/**
 * Replace `{{key}}` placeholders in UI strings.
 * Translators can reorder placeholders freely within the sentence.
 */
export function tplStr(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = vars[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}

/** "1 post", "3 posts". */
export function countLabel(
  n: number,
  forms: { one: string; other: string }
): string {
  return tplStr(n === 1 ? forms.one : forms.other, { n });
}
