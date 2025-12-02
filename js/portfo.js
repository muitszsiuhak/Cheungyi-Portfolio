// portfo.js – FINAL WORKING VERSION
document.addEventListener("DOMContentLoaded", () => {
  const mainImage = document.getElementById("mainImage");
  const thumbnails = document.querySelectorAll(".thumbnail");

  if (!thumbnails.length) return;

  // Initial state
  mainImage.src = thumbnails[0].dataset.src;

  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.dataset.src;

      thumbnails.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
});