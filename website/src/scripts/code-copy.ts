const copyStatus = document.querySelector<HTMLElement>("[data-copy-status]");

function setStatus(message: string) {
  if (copyStatus) copyStatus.textContent = message;
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) throw new Error("Clipboard copy was unavailable");
  await navigator.clipboard.writeText(text);
}

for (const pre of document.querySelectorAll<HTMLPreElement>(".prose pre")) {
  if (pre.querySelector("[data-copy-code]")) continue;
  const code = pre.querySelector("code");
  if (!code) continue;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "code-copy-button";
  button.dataset.copyCode = "true";
  button.textContent = "Copy";
  button.setAttribute("aria-label", "Copy code sample");
  pre.append(button);

  button.addEventListener("click", async () => {
    try {
      await copyText(code.textContent ?? "");
      button.textContent = "Copied";
      button.setAttribute("aria-label", "Code sample copied");
      setStatus("Code sample copied to clipboard.");
      window.setTimeout(() => {
        button.textContent = "Copy";
        button.setAttribute("aria-label", "Copy code sample");
      }, 1600);
    } catch {
      button.textContent = "Select to copy";
      button.setAttribute("aria-label", "Clipboard unavailable; select the code block to copy it");
      setStatus("Clipboard unavailable. Select the code block and use your browser copy command.");
      window.setTimeout(() => {
        button.textContent = "Copy";
        button.setAttribute("aria-label", "Copy code sample");
      }, 2200);
    }
  });
}
