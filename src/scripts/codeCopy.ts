// Liga os botões "Copiar" dos blocos de código (src/utils/transformers/codeBlock.ts).
// Os rótulos vêm do dicionário de UI, via data-* no <html>. Sem JavaScript o
// botão continua escondido.
const COPIED_MS = 1600;

const root = document.documentElement;
const copyLabel = root.dataset.copyLabel ?? "";
const copiedLabel = root.dataset.copiedLabel ?? "";

for (const button of document.querySelectorAll<HTMLButtonElement>(
  "[data-code-copy]"
)) {
  const code = button.closest(".code-block")?.querySelector("pre code");
  if (!code || !navigator.clipboard) continue;

  let timer: number | undefined;
  button.textContent = copyLabel;
  button.hidden = false;

  button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(code.textContent ?? "");
    button.textContent = copiedLabel;
    button.dataset.copied = "";
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      button.textContent = copyLabel;
      delete button.dataset.copied;
    }, COPIED_MS);
  });
}
