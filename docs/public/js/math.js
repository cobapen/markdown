/// Mathjax helper (user-code)
/// Add onClick handlers to mjx-math, to copy TeX to clipboard
(function() {
  const LEFT = 0;
  let eventListenerAdded = false;
  const elements = document.getElementsByTagName("mjx-math");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const next = element.nextElementSibling;
    if (next && next.localName === "mjx-copytext" && next.textContent) {
      const tex = next.textContent;

      element.addEventListener("mousedown", ev => {
        if (ev instanceof MouseEvent && ev.button === LEFT) {
          copyToClipboard(tex);
        }
      });
      enableClickFeedback(element);
      element.style.cursor = "pointer";
    }

    if (!eventListenerAdded) {
      const style = document.createElement("style");
      style.textContent = `
      mjx-math {
        border: 1px solid transparent;
      }
      mjx-math.is-active {
        border: 1px solid #007BFF;
        border-radius: 4px;
        translate: 0 1px;
      }`;
      document.head.appendChild(style);
      eventListenerAdded = true;
    }
  }

  // private functions

  /** @param {string} text */
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(showToast)
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  }

  function showToast() {
    const visibleTime = 800;
    const fadeLength = 300;
    const toast = document.createElement("div");
    toast.style.opacity = "1";
    toast.className = "mjx-toast";
    toast.textContent = "copied";
    toast.style.position = "fixed";
    toast.style.top = "8px";
    toast.style.right = "8px";
    toast.style.opacity = "0";
    toast.style.backgroundColor = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "8px";
    toast.style.borderRadius = "4px";
    toast.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
    toast.style.transition = `opacity ${fadeLength}ms ease-in-out`;
    toast.style.zIndex = 1000;
    document.body.appendChild(toast);

    // change opacity on next tick
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    // fade out, then remove after delay.
    setTimeout(() => { 
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), fadeLength + 10);
    }, visibleTime);
  }

  /** @param {HTMLElement} element */
  function enableClickFeedback(element) {
    const setActive = ev => {
      if (ev instanceof MouseEvent && ev.button === LEFT) {
        element.classList.add("is-active");
      }
    };
    const setInactive = ev => {
      if (ev instanceof MouseEvent && ev.button === LEFT) {
        element.classList.remove("is-active");
      }
    };

    element.addEventListener("touchstart", setActive, { passive: true });
    element.addEventListener("touchend", setInactive);
    element.addEventListener("mousedown", setActive);
    element.addEventListener("mouseup", setInactive);
    element.addEventListener("mouseleave", setInactive);
  }
})();
