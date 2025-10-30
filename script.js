document.getElementById("year").textContent = new Date().getFullYear();

window.scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) {
    const headerOffset = 80; // height of fixed navbar
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger?.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("is-open");
});

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
if (
  savedTheme === "dark" ||
  (savedTheme === null &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  root.classList.add("dark");
}
themeToggle?.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
});

window.contactSubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById("sendBtn");
  btn.disabled = true;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const topic = form.topic.value || "General Inquiry";
  const message = form.message.value.trim();
  const subject = encodeURIComponent(`[Portfolio] ${name} — ${topic}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:irfanwaseem5628@gmail.com?subject=${subject}&body=${body}`;
  setTimeout(() => {
    btn.disabled = false;
  }, 1000);
  return false;
};

const posters = document.querySelectorAll(".poster-gallery img");
posters.forEach((img) => {
  img.addEventListener("click", () => {
    const viewer = document.createElement("div");
    viewer.classList.add("lightbox");
    viewer.innerHTML = `
      <div class="lightbox__overlay"></div>
      <div class="lightbox__content">
        <img src="${img.src}" alt="${img.alt}">
        <button class="lightbox__close" aria-label="Close">×</button>
      </div>
    `;
    document.body.appendChild(viewer);
    document.body.style.overflow = "hidden";
    viewer.querySelector(".lightbox__overlay").onclick =
      viewer.querySelector(".lightbox__close").onclick =
      () => {
        viewer.remove();
        document.body.style.overflow = "";
      };
  });
});
