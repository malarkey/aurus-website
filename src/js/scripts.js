(() => {
  const panelSvgs = document.querySelectorAll("svg.panel-animated");

  if (!panelSvgs.length) {
    return;
  }

  const panelAnimationSelector =
    "#panel-2-person path, .panel-3-building > *, .panel-3-line, .panel-4-building > *, #panel-dark-item path, #panel-dark-row path, #panel-light-figure path, #panel-light-person path";

  const getPanelPaths = (panelSvg) => {
    return panelSvg.querySelectorAll(panelAnimationSelector);
  };

  const resetPanelAnimations = (panelSvg) => {
    const animatedPaths = getPanelPaths(panelSvg);

    animatedPaths.forEach((animatedPath) => {
      animatedPath.style.animation = "none";
    });

    // Force reflow so animation restart is applied consistently.
    void panelSvg.getBoundingClientRect();

    animatedPaths.forEach((animatedPath) => {
      animatedPath.style.animation = "";
      animatedPath.style.animationPlayState = "paused";
    });
  };

  const startPanelAnimations = (panelSvg) => {
    const animatedPaths = getPanelPaths(panelSvg);

    animatedPaths.forEach((animatedPath) => {
      animatedPath.style.animationPlayState = "running";
    });
  };

  panelSvgs.forEach((panelSvg) => {
    resetPanelAnimations(panelSvg);
  });

  if (!("IntersectionObserver" in window)) {
    panelSvgs.forEach((panelSvg) => {
      startPanelAnimations(panelSvg);
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, intersectionObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        startPanelAnimations(entry.target);
        intersectionObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.2,
    },
  );

  panelSvgs.forEach((panelSvg) => {
    observer.observe(panelSvg);
  });
})();

(() => {
  const carousel = document.querySelector("#panels");

  if (!carousel) {
    return;
  }

  const panels = Array.from(carousel.querySelectorAll(":scope > .panel"));

  if (panels.length < 2) {
    return;
  }

  const autoplayDelay = 10000;
  let activePanelIndex = 0;
  let autoplayTimer = null;

  const controls = document.createElement("nav");
  controls.className = "panel-carousel-controls";
  controls.setAttribute("aria-label", "Panels");

  const dots = panels.map((panel, index) => {
    const panelId = panel.id || `home-panel-${index + 1}`;
    const dot = document.createElement("button");

    panel.id = panelId;
    dot.className = "panel-carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-controls", panelId);
    dot.setAttribute("aria-label", `Show panel ${index + 1}`);
    dot.addEventListener("click", () => {
      setActivePanel(index);
      startAutoplay();
    });

    controls.append(dot);
    return dot;
  });

  carousel.insertAdjacentElement("afterend", controls);

  const stopAutoplay = () => {
    if (autoplayTimer === null) {
      return;
    }

    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  function setActivePanel(nextIndex) {
    const normalizedIndex = (nextIndex + panels.length) % panels.length;

    activePanelIndex = normalizedIndex;

    panels.forEach((panel, index) => {
      const isActive = index === activePanelIndex;

      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    dots.forEach((dot, index) => {
      const isActive = index === activePanelIndex;

      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  const startAutoplay = () => {
    stopAutoplay();

    autoplayTimer = window.setInterval(() => {
      setActivePanel(activePanelIndex + 1);
    }, autoplayDelay);
  };

  [carousel, controls].forEach((item) => {
    item.addEventListener("focusin", stopAutoplay);
    item.addEventListener("pointerenter", stopAutoplay);
    item.addEventListener("pointerleave", startAutoplay);
  });

  controls.addEventListener("focusout", (event) => {
    if (event.relatedTarget && controls.contains(event.relatedTarget)) {
      return;
    }

    startAutoplay();
  });

  carousel.addEventListener("focusout", (event) => {
    if (event.relatedTarget && carousel.contains(event.relatedTarget)) {
      return;
    }

    startAutoplay();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  });

  setActivePanel(0);
  startAutoplay();
})();
