function showAlert() {
    alert('Hello! Welcome to My Advanced Website.');
}

// Scroll animation
document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.2 });
    elements.forEach(el => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", function() {
    function revealSections() {
        let sections = document.querySelectorAll(".hero, .about, .features, .contact");
        sections.forEach(section => {
            let position = section.getBoundingClientRect().top;
            let screenPosition = window.innerHeight / 1.3;
            if (position < screenPosition) {
                section.classList.add("show");
            }
        });
    }
    
    window.addEventListener("scroll", revealSections);
    revealSections(); // Trigger on page load
});