const header = document.querySelector<HTMLElement>("[data-site-header]");
const navigation = document.querySelector<HTMLElement>("[data-site-navigation]");
const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");

if (header && navigation && menuToggle) {
  header.dataset.enhanced = "true";
  navigation.dataset.open = "false";

  const closeMenu = (restoreFocus: boolean) => {
    navigation.dataset.open = "false";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open site navigation");
    if (restoreFocus) menuToggle.focus();
  };

  const openMenu = () => {
    navigation.dataset.open = "true";
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close site navigation");
    navigation.querySelector<HTMLAnchorElement>("a")?.focus();
  };

  menuToggle.addEventListener("click", () => {
    if (navigation.dataset.open === "true") closeMenu(false);
    else openMenu();
  });

  navigation.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
  });

  document.addEventListener("pointerdown", (event) => {
    if (navigation.dataset.open !== "true") return;
    if (event.target instanceof Node && !header.contains(event.target)) closeMenu(false);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu(false);
  });

  const desktopQuery = window.matchMedia("(min-width: 981px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) closeMenu(false);
  });

  const updateScrollState = () => {
    header.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
  };

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
}

export {};
