const root = document.querySelector<HTMLElement>("[data-system-sequence]");

if (root) {
  const replayButton = root.querySelector<HTMLButtonElement>("[data-sequence-replay]");
  const status = root.querySelector<HTMLElement>("[data-sequence-status]");
  const stageItems = Array.from(root.querySelectorAll<HTMLElement>("[data-sequence-stage]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  type SequenceStage = "ready" | "receive" | "evaluate" | "risk" | "interface" | "complete";
  const schedule: Array<[number, SequenceStage]> = [
    [400, "receive"],
    [1050, "evaluate"],
    [1700, "risk"],
    [2300, "interface"],
    [3500, "complete"],
  ];
  const stageCopy = {
    ready: "Ready: a sample signal waits at the edge.",
    receive: "Receive: the signal follows one constrained route.",
    evaluate: "Evaluate: a specialist module marks a candidate state.",
    risk: "Risk: a threshold is a review point, not a guarantee.",
    interface: "Interface: the illustration reaches a contract boundary.",
    complete: "Sequence complete. Illustrative path; no live data or transaction.",
  } as const;

  let timers: number[] = [];
  let running = false;
  let autoPlayed = false;

  const setStage = (stage: SequenceStage) => {
    root.dataset.step = stage;
    for (const item of stageItems) {
      if (item.dataset.sequenceStage === stage) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    }
    if (status) status.textContent = stageCopy[stage];
  };

  const stopTimers = () => {
    for (const timer of timers) window.clearTimeout(timer);
    timers = [];
  };

  const finish = () => {
    stopTimers();
    running = false;
    setStage("complete");
  };

  const play = () => {
    stopTimers();
    if (prefersReducedMotion.matches || document.visibilityState !== "visible") {
      finish();
      return;
    }

    running = true;
    setStage("ready");
    for (const [delay, stage] of schedule) {
      timers.push(window.setTimeout(() => setStage(stage), delay));
    }
    timers.push(window.setTimeout(() => {
      running = false;
    }, 3600));
  };

  replayButton?.addEventListener("click", play);

  if (!prefersReducedMotion.matches) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && !autoPlayed) {
          autoPlayed = true;
          play();
        } else if (!entry.isIntersecting && running) {
          finish();
        }
      }, { threshold: 0.2 });
      observer.observe(root);
    } else {
      autoPlayed = true;
      play();
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" && running) finish();
  });

  prefersReducedMotion.addEventListener("change", (event) => {
    if (event.matches && running) finish();
  });
}
