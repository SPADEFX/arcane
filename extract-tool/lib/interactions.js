// Micro interaction engine — disabled for now.
// The scroll reveal was too aggressive and broke legitimate CSS transforms.
// Only smooth scroll is kept as it's safe.

module.exports = `<script>
(function() {
  document.documentElement.style.scrollBehavior = "smooth";
})();
<\/script>`;
