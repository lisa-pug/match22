document.addEventListener('DOMContentLoaded', () => {
  fetch('/partials/nav.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar-placeholder').innerHTML = html;
      highlightActiveLink();
    });
});

function highlightActiveLink() {
  const links = document.querySelectorAll('.navbar-links a');
  links.forEach(link => {
    if (link.getAttribute('href') === window.location.pathname) {
      link.classList.add('active');
    }
  });
}  