const selector = document.querySelector<HTMLElement>("[data-agent-selector]");

if (selector) {
  const choices = Array.from(selector.querySelectorAll<HTMLButtonElement>("[data-agent-choice]"));
  const panel = selector.querySelector<HTMLElement>("[data-agent-explanation]");
  const status = selector.querySelector<HTMLElement>("[data-agent-status]");
  const title = selector.querySelector<HTMLElement>("[data-agent-title]");
  const copy = selector.querySelector<HTMLElement>("[data-agent-copy]");
  const link = selector.querySelector<HTMLAnchorElement>("[data-agent-link]");

  const agentDetails: Record<string, { name: string; status: string; copy: string; href: string }> = {
    yield: {
      name: "Yield optimizer",
      status: "Prototype · source-level candidate selection",
      copy: "The repository contains a yield-optimizer service and a Solidity contract prototype. Candidate selection is not a live offer or realized return.",
      href: "/product#yield-optimizer",
    },
    arbitrage: {
      name: "Arbitrage bot",
      status: "Simulated · no live execution verified",
      copy: "The current arbitrage model includes a simulated execution path. A model comparison is not proof of a profitable or settled trade.",
      href: "/product#arbitrage-bot",
    },
    risk: {
      name: "Risk manager",
      status: "Prototype · thresholds are not guarantees",
      copy: "A contract prototype defines risk-score markers. They are not an audited risk model, an oracle guarantee, or proof that losses can be prevented.",
      href: "/product#risk-manager",
    },
    rebalance: {
      name: "Portfolio rebalancer",
      status: "Simulated · no order is placed",
      copy: "The Python workflow produces rebalance candidates and explicitly simulates its trade path. No holdings are read or moved by this page.",
      href: "/product#portfolio-rebalancer",
    },
  };

  const closePanel = (restoreFocus: boolean) => {
    if (panel) panel.hidden = true;
    for (const choice of choices) choice.setAttribute("aria-expanded", "false");
    if (restoreFocus) choices.find((choice) => choice.getAttribute("aria-pressed") === "true")?.focus();
  };

  const selectChoice = (choice: HTMLButtonElement, open = true) => {
    const key = choice.dataset.agentChoice ?? "";
    const detail = agentDetails[key];
    if (!detail || !panel || !status || !title || !copy || !link) return;

    const wasSelected = choice.getAttribute("aria-pressed") === "true";
    const shouldOpen = open && !(wasSelected && !panel.hidden);
    for (const item of choices) {
      const selected = item === choice && shouldOpen;
      item.setAttribute("aria-pressed", String(selected));
      item.setAttribute("aria-expanded", String(selected));
    }

    panel.hidden = !shouldOpen;
    if (shouldOpen) {
      status.textContent = detail.status;
      title.textContent = detail.name;
      copy.textContent = detail.copy;
      link.href = detail.href;
    }
  };

  for (const choice of choices) {
    choice.addEventListener("click", () => selectChoice(choice));
    choice.addEventListener("keydown", (event) => {
      const index = choices.indexOf(choice);
      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % choices.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + choices.length) % choices.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = choices.length - 1;
      else if (event.key === "Escape") {
        if (!panel?.hidden) {
          event.preventDefault();
          closePanel(true);
        }
        return;
      } else return;

      event.preventDefault();
      const nextChoice = choices[nextIndex];
      nextChoice?.focus();
      if (nextChoice) selectChoice(nextChoice);
    });
  }
}
