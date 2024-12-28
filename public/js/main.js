// Update main.js
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.querySelector("[data-mobile-menu]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const menuOpenIcon = document.querySelector(".menu-open");
  const menuCloseIcon = document.querySelector(".menu-close");
  const mainNav = document.getElementById("mainNav");

  // Scroll handler for navigation backdrop
  function handleScroll() {
    if (window.scrollY > 50) {
      mainNav.classList.add("scrolled");
    } else {
      mainNav.classList.remove("scrolled");
    }
  }

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);
  // Initial check
  handleScroll();

  function toggleMenu() {
    const isExpanded =
      mobileMenuButton.getAttribute("aria-expanded") === "true";
    mobileMenuButton.setAttribute("aria-expanded", !isExpanded);
    mobileNav.classList.toggle("hidden");
    document.body.classList.toggle("menu-open");

    // Toggle icons
    menuOpenIcon.classList.toggle("hidden");
    menuCloseIcon.classList.toggle("hidden");
  }

  mobileMenuButton.addEventListener("click", toggleMenu);

  // Close menu when clicking a link
  const mobileLinks = mobileNav.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !mobileNav.classList.contains("hidden") &&
      !mobileNav.contains(e.target) &&
      !mobileMenuButton.contains(e.target)
    ) {
      toggleMenu();
    }
  });
});
