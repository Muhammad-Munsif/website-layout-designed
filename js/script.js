// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Check for saved theme or prefer-color-scheme
const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
body.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  themeToggle.classList.add("clicked");
  setTimeout(() => {
    themeToggle.classList.remove("clicked");
  }, 300);
});

// Mobile Navigation Toggle
const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.querySelector(".nav-links");

mobileToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  mobileToggle.innerHTML = navLinks.classList.contains("active")
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  updateActiveNavLink();
});

// API Configuration
const API_BASE_URL = "http://localhost:5000/api";

// Contact Form Submission
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    try {
      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };

      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showNotification(
          "Message sent successfully! We will get back to you soon.",
          "success"
        );
        contactForm.reset();
      } else {
        showNotification(
          data.message || "Failed to send message. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Network error. Please check your connection.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// Portfolio Filter
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    portfolioItems.forEach((item) => {
      if (
        filterValue === "all" ||
        item.getAttribute("data-category") === filterValue
      ) {
        item.style.display = "block";
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, 10);
      } else {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  });
});

// Load Projects from API
async function loadProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    const data = await response.json();

    if (data.success && data.data.length > 0) {
      const portfolioGrid = document.querySelector(".portfolio-grid");
      if (portfolioGrid) {
        portfolioGrid.innerHTML = data.data
          .map(
            (project) => `
          <div class="portfolio-item" data-category="${project.category}">
            <img src="${project.imageUrl}" alt="${
              project.title
            }" class="portfolio-img">
            <div class="portfolio-overlay">
              <h3>${project.title}</h3>
              <p>${project.description.substring(0, 100)}...</p>
              ${
                project.liveUrl
                  ? `<a href="${project.liveUrl}" target="_blank" class="btn btn-primary mt-2">View Live</a>`
                  : ""
              }
            </div>
          </div>
        `
          )
          .join("");
      }
    }
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

// Load Testimonials from API
async function loadTestimonials() {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials/approved`);
    const data = await response.json();

    if (data.success && data.data.length > 0) {
      const testimonialSlider = document.querySelector(".testimonial-slider");
      if (testimonialSlider) {
        testimonialSlider.innerHTML = data.data
          .map(
            (testimonial) => `
          <div class="testimonial-card">
            <div class="testimonial-text">${testimonial.testimonial}</div>
            <div class="client-info">
              <img src="${
                testimonial.clientAvatar ||
                "https://images.unsplash.com/photo-1494790108755-2616b786d4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
              }" 
                   alt="${testimonial.clientName}" class="client-avatar">
              <div>
                <h4>${testimonial.clientName}</h4>
                <p>${testimonial.clientRole}${
              testimonial.clientCompany ? `, ${testimonial.clientCompany}` : ""
            }</p>
              </div>
            </div>
          </div>
        `
          )
          .join("");
      }
    }
  } catch (error) {
    console.error("Error loading testimonials:", error);
  }
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${
      type === "success"
        ? "check-circle"
        : type === "error"
        ? "exclamation-circle"
        : "info-circle"
    }"></i>
    <span>${message}</span>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Close button
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    });

  // Auto remove
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Add notification styles
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-card);
    border-left: 4px solid var(--primary-color);
    padding: 15px 20px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10000;
    transform: translateX(150%);
    transition: transform 0.3s ease;
    max-width: 400px;
  }
  .notification.show {
    transform: translateX(0);
  }
  .notification-success {
    border-left-color: var(--success-color);
  }
  .notification-success i {
    color: var(--success-color);
  }
  .notification-error {
    border-left-color: #ef4444;
  }
  .notification-error i {
    color: #ef4444;
  }
  .notification-close {
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    margin-left: auto;
    padding: 5px;
  }
  .notification-close:hover {
    color: var(--text-primary);
  }
`;
document.head.appendChild(notificationStyles);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Update active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 150) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// Interactive effects
document.querySelectorAll(".feature-card, .portfolio-item").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.zIndex = "10";
  });

  card.addEventListener("mouseleave", function () {
    this.style.zIndex = "1";
  });
});

// Load data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  loadTestimonials();
  updateActiveNavLink();
});
