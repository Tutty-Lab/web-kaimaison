import { useEffect } from "react";

const MOTION_SELECTOR = '[data-motion]:not([data-motion="menu-item"])';
const PARALLAX_SELECTOR = "[data-parallax]";
const SCROLLED_CLASS = "has-scrolled";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getMotionDelay(element) {
  const rawDelay = element.getAttribute("data-motion-delay");
  if (!rawDelay) return null;

  const numericDelay = Number(rawDelay);
  return Number.isFinite(numericDelay) ? `${numericDelay}ms` : rawDelay;
}

function revealElement(element) {
  const delay = getMotionDelay(element);

  if (delay) {
    element.style.setProperty("--motion-delay", delay);
  }

  element.classList.add("is-visible");
}

function isNearViewport(element) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.bottom > viewportHeight * -0.08 && rect.top < viewportHeight * 1.12;
}

export function useOjigiMotion(routeKey) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMotion = window.matchMedia("(min-width: 861px)");
    const motionElements = Array.from(document.querySelectorAll(MOTION_SELECTOR));
    const parallaxElements = Array.from(document.querySelectorAll(PARALLAX_SELECTOR));
    const pendingMotionElements = new Set(motionElements);
    let frame = 0;
    let observer;

    const updateScrolledState = () => {
      document.body.classList.toggle(SCROLLED_CLASS, window.scrollY > 12);
    };

    if (reducedMotion.matches) {
      motionElements.forEach(revealElement);
      parallaxElements.forEach((element) => element.style.setProperty("--parallax-y", "0px"));
      updateScrolledState();
      window.addEventListener("scroll", updateScrolledState, { passive: true });

      return () => {
        window.removeEventListener("scroll", updateScrolledState);
        document.body.classList.remove(SCROLLED_CLASS);
      };
    }

    motionElements.forEach((element) => element.classList.remove("is-visible"));

    const revealAndUnobserve = (element) => {
      if (!pendingMotionElements.has(element)) return;

      revealElement(element);
      pendingMotionElements.delete(element);
      observer?.unobserve(element);
    };

    const revealNearViewport = () => {
      pendingMotionElements.forEach((element) => {
        if (isNearViewport(element)) {
          revealAndUnobserve(element);
        }
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealAndUnobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px 12% 0px",
        threshold: 0.12,
      },
    );

    requestAnimationFrame(() => {
      motionElements.forEach((element) => observer.observe(element));
      revealNearViewport();
    });

    const updateParallax = () => {
      if (!desktopMotion.matches) {
        parallaxElements.forEach((element) => element.style.setProperty("--parallax-y", "0px"));
        return;
      }

      const viewportCenter = window.innerHeight / 2;

      parallaxElements.forEach((element) => {
        const strength = Number(element.getAttribute("data-parallax")) || 14;
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const progress = (elementCenter - viewportCenter) / viewportCenter;
        const offset = clamp(progress * -strength, -strength, strength);

        element.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
      });
    };

    const updateViewportMotion = () => {
      frame = 0;
      updateScrolledState();
      revealNearViewport();
      updateParallax();
    };

    const requestViewportMotionUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(updateViewportMotion);
    };

    updateViewportMotion();
    window.addEventListener("scroll", requestViewportMotionUpdate, { passive: true });
    window.addEventListener("resize", requestViewportMotionUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestViewportMotionUpdate);
      window.removeEventListener("resize", requestViewportMotionUpdate);
      document.body.classList.remove(SCROLLED_CLASS);

      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [routeKey]);
}
