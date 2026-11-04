const map = document.querySelector<HTMLElement>("[data-architecture-map]");

if (map) {
  const stage = map.querySelector<HTMLElement>("[data-architecture-stage]");
  const detail = map.querySelector<HTMLElement>("#architecture-detail");
  const nodes = Array.from(map.querySelectorAll<HTMLButtonElement>("[data-node-id]"));
  const templates = new Map(
    Array.from(map.querySelectorAll<HTMLTemplateElement>("template[data-node-template]")).map((template) => [
      template.dataset.nodeTemplate ?? "",
      template,
    ]),
  );

  if (stage && detail && nodes.length > 0) {
    stage.hidden = false;

    const selectNode = (node: HTMLButtonElement) => {
      const id = node.dataset.nodeId ?? "";
      const template = templates.get(id);
      if (!template) return;
      for (const item of nodes) item.setAttribute("aria-pressed", String(item === node));
      detail.replaceChildren(template.content.cloneNode(true));
    };

    for (const node of nodes) {
      node.addEventListener("click", () => selectNode(node));
    }

    const initialNode = nodes.find((node) => node.dataset.nodeId === "browser") ?? nodes[0];
    if (initialNode) selectNode(initialNode);
  }
}
