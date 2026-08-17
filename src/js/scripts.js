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

(() => {
  const gate = document.querySelector("[data-investor-gate]");

  if (!gate) {
    return;
  }

  const storageKey = "aurusInvestorInformationConfirmed";
  const exitFallbackUrl = "https://www.fca.org.uk/";
  const dialog = gate.querySelector('[role="dialog"]');
  const confirmButton = gate.querySelector("[data-investor-gate-confirm]");
  const exitButton = gate.querySelector("[data-investor-gate-exit]");
  const readButton = gate.querySelector("[data-investor-gate-read]");
  const bodyPanel = gate.querySelector(".investor-gate__body");
  const summaryPanel = gate.querySelector("[data-investor-gate-summary]");
  const noticePanel = gate.querySelector("[data-investor-gate-notice]");
  const noticeScroll = gate.querySelector("[data-investor-gate-scroll]");
  const confirmHint = gate.querySelector("[data-investor-gate-confirm-hint]");
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  if (!dialog || !confirmButton || !exitButton || !readButton || !bodyPanel || !summaryPanel || !noticePanel || !noticeScroll || !confirmHint) {
    return;
  }

  const readConfirmation = () => {
    try {
      return window.localStorage.getItem(storageKey) === "true";
    } catch (error) {
      return false;
    }
  };

  const writeConfirmation = () => {
    try {
      window.localStorage.setItem(storageKey, "true");
    } catch (error) {
      // Storage can be unavailable in private browsing; closing still works.
    }
  };

  if (readConfirmation()) {
    return;
  }

  let previousFocus = null;
  let gatedSiblings = [];
  let hasOpenedNotice = false;
  let hasScrolledNotice = false;
  const scrollEndTolerance = 4;

  const disableConfirmation = () => {
    confirmButton.disabled = true;
    confirmButton.setAttribute("aria-disabled", "true");
    confirmButton.setAttribute("title", "Read the full Important Notice first to enable this button.");
    confirmHint.hidden = false;
  };

  const enableConfirmation = () => {
    confirmButton.disabled = false;
    confirmButton.removeAttribute("aria-disabled");
    confirmButton.removeAttribute("title");
    confirmHint.hidden = true;
  };

  const hasContainerReachedEnd = (container) => {
    const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);

    if (maxScrollTop <= scrollEndTolerance) {
      return false;
    }

    return Math.ceil(container.scrollTop) >= maxScrollTop - scrollEndTolerance;
  };

  const hasReadNoticeToEnd = () => {
    return hasContainerReachedEnd(noticeScroll);
  };

  const updateConfirmationAvailability = () => {
    if (!hasOpenedNotice) {
      disableConfirmation();
      return;
    }

    if (hasScrolledNotice && hasReadNoticeToEnd()) {
      enableConfirmation();
      return;
    }

    disableConfirmation();
  };

  const handleNoticeScroll = () => {
    if (noticeScroll.scrollTop > 0) {
      hasScrolledNotice = true;
    }

    updateConfirmationAvailability();
  };

  const handleNoticeProgress = () => {
    window.requestAnimationFrame(updateConfirmationAvailability);
  };

  const resetNoticePosition = () => {
    bodyPanel.scrollTop = 0;
    noticeScroll.scrollTop = 0;
  };

  const showNotice = () => {
    summaryPanel.hidden = true;
    noticePanel.hidden = false;
    gate.setAttribute("data-investor-gate-reading", "true");
    hasOpenedNotice = true;
    hasScrolledNotice = false;
    disableConfirmation();
    resetNoticePosition();

    window.requestAnimationFrame(() => {
      try {
        noticeScroll.focus({ preventScroll: true });
      } catch (error) {
        noticeScroll.focus();
      }

      resetNoticePosition();
      updateConfirmationAvailability();
    });
  };

  const getFocusableItems = () => {
    return Array.from(dialog.querySelectorAll(focusableSelector)).filter((item) => {
      return item.offsetParent !== null || item === document.activeElement;
    });
  };

  const setPageInert = (isInert) => {
    if (isInert) {
      gatedSiblings = Array.from(document.body.children)
        .filter((item) => item !== gate && item.tagName !== "SCRIPT")
        .map((item) => {
          const state = {
            element: item,
            ariaHidden: item.getAttribute("aria-hidden"),
            inert: item.inert,
          };

          item.inert = true;
          item.setAttribute("aria-hidden", "true");
          return state;
        });
      return;
    }

    gatedSiblings.forEach(({ element, ariaHidden, inert }) => {
      element.inert = inert;

      if (ariaHidden === null) {
        element.removeAttribute("aria-hidden");
        return;
      }

      element.setAttribute("aria-hidden", ariaHidden);
    });
    gatedSiblings = [];
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableItems = getFocusableItems();

    if (!focusableItems.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  };

  const closeGate = () => {
    gate.hidden = true;
    gate.removeAttribute("data-investor-gate-reading");
    document.body.classList.remove("has-investor-gate");
    setPageInert(false);
    document.removeEventListener("keydown", handleKeydown, true);

    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus();
    }
  };

  const exitWebsite = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign(exitFallbackUrl);
  };

  const showGate = () => {
    previousFocus = document.activeElement;
    gate.hidden = false;
    document.body.classList.add("has-investor-gate");
    setPageInert(true);
    document.addEventListener("keydown", handleKeydown, true);
    hasOpenedNotice = false;
    hasScrolledNotice = false;
    gate.removeAttribute("data-investor-gate-reading");
    disableConfirmation();

    window.requestAnimationFrame(() => {
      readButton.focus();
    });
  };

  readButton.addEventListener("click", showNotice);
  noticeScroll.addEventListener("scroll", handleNoticeScroll, { passive: true });
  noticeScroll.addEventListener("wheel", handleNoticeProgress, { passive: true });
  noticeScroll.addEventListener("touchmove", handleNoticeProgress, { passive: true });
  noticeScroll.addEventListener("keyup", handleNoticeProgress);

  confirmButton.addEventListener("click", () => {
    if (confirmButton.disabled || !hasOpenedNotice || !hasScrolledNotice || !hasReadNoticeToEnd()) {
      disableConfirmation();
      return;
    }

    writeConfirmation();
    closeGate();
  });

  exitButton.addEventListener("click", exitWebsite);

  showGate();
})();
