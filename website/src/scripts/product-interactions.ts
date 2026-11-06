const riskSlider = document.querySelector<HTMLInputElement>("[data-risk-slider]");
const riskOutput = document.querySelector<HTMLElement>("[data-risk-output]");
const riskState = document.querySelector<HTMLElement>("[data-risk-state]");

function describeRisk(value: number) {
  if (value >= 900) return `Illustrative value ${value} / 1000: at or above both source markers. No wallet data is read and no action occurs.`;
  if (value >= 700) return `Illustrative value ${value} / 1000: at or above the source warning marker. No wallet data is read and no action occurs.`;
  return `Illustrative value ${value} / 1000: below the source warning marker. No wallet data is read and no action occurs.`;
}

if (riskSlider && riskOutput && riskState) {
  const updateRisk = () => {
    const value = Number(riskSlider.value);
    riskOutput.textContent = `${value} / 1000`;
    riskState.textContent = describeRisk(value);
  };
  riskSlider.addEventListener("input", updateRisk);
  updateRisk();
}

const yieldChoices = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-yield-candidate]"));
const yieldStatus = document.querySelector<HTMLElement>("[data-yield-status]");

for (const choice of yieldChoices) {
  choice.addEventListener("click", () => {
    for (const item of yieldChoices) item.setAttribute("aria-pressed", String(item === choice));
    if (yieldStatus) {
      yieldStatus.textContent = `${choice.dataset.yieldCandidate} selected. This is a conceptual candidate, not a current protocol offer or yield figure.`;
    }
  });
}

const routeToggle = document.querySelector<HTMLButtonElement>("[data-route-toggle]");
const routeView = document.querySelector<HTMLElement>("[data-route-view]");
const routeStatus = document.querySelector<HTMLElement>("[data-route-status]");

if (routeToggle && routeView && routeStatus) {
  routeToggle.addEventListener("click", () => {
    const showDifference = routeToggle.getAttribute("aria-pressed") !== "true";
    routeToggle.setAttribute("aria-pressed", String(showDifference));
    routeView.dataset.routeView = showDifference ? "difference" : "paired";
    routeToggle.textContent = showDifference ? "Show both routes" : "Inspect the difference";
    routeStatus.textContent = showDifference
      ? "Illustrative model comparison only. No prices are fetched and no trade is sent."
      : "Two schematic routes. The drawing contains no live prices or execution proof.";
  });
}

const allocationToggle = document.querySelector<HTMLButtonElement>("[data-allocation-toggle]");
const allocationView = document.querySelector<HTMLElement>("[data-allocation-view]");
const allocationStatus = document.querySelector<HTMLElement>("[data-allocation-status]");

if (allocationToggle && allocationView && allocationStatus) {
  allocationToggle.addEventListener("click", () => {
    const proposed = allocationToggle.getAttribute("aria-pressed") !== "true";
    allocationToggle.setAttribute("aria-pressed", String(proposed));
    allocationView.dataset.allocationView = proposed ? "example" : "observed";
    allocationToggle.textContent = proposed ? "Return to observed pattern" : "Show illustrative target";
    allocationStatus.textContent = proposed
      ? "Illustrative target pattern shown. No wallet was connected, no holdings were read, and no orders were placed."
      : "Schematic observed pattern shown. It is not connected to a wallet or live portfolio.";
  });
}
