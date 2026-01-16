document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  const setScrolled = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("menu-open")) return;
    const target = event.target;
    if (menuToggle && (menuToggle.contains(target) || navLinks.contains(target))) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("scroll", setScrolled);
  setScrolled();

  const registerAccordion = (toggleSelector) => {
    document.querySelectorAll(toggleSelector).forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        if (panel) {
          panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : "0px";
        }
      });
    });
  };

  registerAccordion(".accordion-toggle");
  registerAccordion(".faqpage-toggle");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      closeMenu();
    });
  });

  document.querySelectorAll("[data-services-menu-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".services-menu");
      if (!section) return;
      const isExpanded = section.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", String(isExpanded));
      btn.textContent = isExpanded ? "Show less" : "Show more";
    });
  });

  const currentPath = location.pathname.split("/").pop() || "index.html";
  const currentHash = location.hash || "";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href) return;
    let linkPath = link.getAttribute("data-path");
    let linkHash = "";

    try {
      const url = new URL(href, location.href);
      linkPath = url.pathname.split("/").pop() || linkPath;
      linkHash = url.hash || "";
    } catch {
      // ignore
    }

    if (linkPath !== currentPath) return;
    if (linkHash) {
      if (linkHash === currentHash) link.classList.add("active");
      return;
    }
    if (!currentHash) link.classList.add("active");
  });
});
