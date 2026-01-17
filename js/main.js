document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const COOKIE_CONSENT_KEY = "lp_cookie_consent";

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

  const getCookie = (name) => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    if (!cookieValue) return null;
    return decodeURIComponent(cookieValue.split("=").slice(1).join("="));
  };

  const getStoredConsent = () => {
    try {
      const fromStorage = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (fromStorage === "accepted" || fromStorage === "declined") return fromStorage;
    } catch {
      // ignore
    }

    const fromCookie = getCookie(COOKIE_CONSENT_KEY);
    if (fromCookie === "accepted" || fromCookie === "declined") return fromCookie;
    return null;
  };

  const storeConsent = (value) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      // ignore
    }

    document.cookie = `${COOKIE_CONSENT_KEY}=${encodeURIComponent(value)}; Max-Age=31536000; Path=/; SameSite=Lax`;
  };

  const showCookieBanner = () => {
    if (getStoredConsent()) return;
    if (document.getElementById("cookie-banner")) return;

    const banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.id = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML = `
      <p class="cookie-banner__text">
        We use cookies to enhance your browsing experience and analyze site traffic. By continuing to use our website, you consent to our use of cookies.
        <a class="cookie-banner__link" href="cookie-policy.html">Learn more</a>
      </p>
      <div class="cookie-banner__actions">
        <button type="button" class="btn btn-outline" data-cookie-decline>Decline</button>
        <button type="button" class="btn btn-primary" data-cookie-accept>Accept</button>
      </div>
    `.trim();

    const acceptBtn = banner.querySelector("[data-cookie-accept]");
    const declineBtn = banner.querySelector("[data-cookie-decline]");

    const dismiss = () => {
      banner.classList.add("is-hidden");
      window.setTimeout(() => banner.remove(), 250);
    };

    acceptBtn?.addEventListener("click", () => {
      storeConsent("accepted");
      dismiss();
    });

    declineBtn?.addEventListener("click", () => {
      storeConsent("declined");
      dismiss();
    });

    document.body.appendChild(banner);
    acceptBtn?.focus();
  };

  showCookieBanner();
});
