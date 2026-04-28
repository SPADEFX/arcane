// Micro-interaction runtime injected into every clone.
// Conservative by design: only safe passive behaviors that don't
// interfere with the captured CSS/transform state.

module.exports = `<script>
(function() {
  // Smooth scrolling for anchor links
  document.documentElement.style.scrollBehavior = "smooth";

  // Restore any elements still invisible after capture (safety net for
  // scroll-reveal elements that were missed by the capture pass).
  // Only acts on elements with near-zero opacity set via inline style —
  // never touches CSS-class-based visibility.
  function revealForgottenElements() {
    var els = document.querySelectorAll("[style]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var st = el.style;
      // Only touch opacity that looks like a "hidden" initial state
      if (st.opacity !== undefined && parseFloat(st.opacity) < 0.05) {
        st.opacity = "1";
      }
      // Only clear translateY/translateX that look like scroll-reveal offsets
      // (significant pixel offsets, not part of a running animation)
      if (st.transform && st.transform !== "none") {
        var hasAnim = window.getComputedStyle(el).animationName !== "none";
        if (!hasAnim) {
          var bigOffset = /translate[YX]?\([^)]*[3-9]\d|translate[YX]?\([^)]*[1-9]\d\d/.test(st.transform);
          if (bigOffset) st.transform = "";
        }
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealForgottenElements);
  } else {
    revealForgottenElements();
  }
})();
<\/script>`;
