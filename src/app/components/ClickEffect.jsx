"use client";

import { useEffect } from "react";

export default function ClickEffect() {
  useEffect(() => {
    // ৪-কোণা ক্লাসিক স্পার্কল স্টার SVG পাথ
    const starSvg = `
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
      </svg>
    `;

    const createStarBurst = (x, y) => {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = `${x}px`;
      container.style.top = `${y}px`;
      container.style.pointerEvents = "none";
      container.style.zIndex = "999999";
      container.style.transform = "translate(-50%, -50%)";

      // ১. সেন্ট্রাল মিনি ফ্ল্যাশ স্টার
      const centerStar = document.createElement("div");
      centerStar.innerHTML = starSvg;
      centerStar.style.position = "absolute";
      centerStar.style.left = "50%";
      centerStar.style.top = "50%";
      centerStar.style.width = "18px";
      centerStar.style.height = "18px";
      centerStar.style.color = "#ffffff";
      centerStar.style.filter = "drop-shadow(0 0 6px #f97316)";
      centerStar.style.transform = "translate(-50%, -50%) scale(0.2) rotate(0deg)";
      centerStar.style.opacity = "1";
      centerStar.style.transition =
        "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out";
      container.appendChild(centerStar);

      // ২. চারদিকে ছড়িয়ে পড়া ছোট ছোট তারা (Mini Sparkling Stars)
      const starCount = 7;
      const starColors = ["#ea580c", "#f59e0b", "#fbbf24", "#fdba74", "#fff7ed"];
      const stars = [];

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.innerHTML = starSvg;

        const size = i % 2 === 0 ? 12 : 9;
        const color = starColors[i % starColors.length];
        const angle =
          (i * (360 / starCount) + (Math.random() * 24 - 12)) *
          (Math.PI / 180);
        const distance = 22 + Math.random() * 16;
        const rotate = Math.random() * 90 - 45;

        star.style.position = "absolute";
        star.style.left = "50%";
        star.style.top = "50%";
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.color = color;
        star.style.filter = `drop-shadow(0 0 4px ${color})`;
        star.style.transform = "translate(-50%, -50%) scale(0) rotate(0deg)";
        star.style.opacity = "1";
        star.style.transition =
          "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out";

        container.appendChild(star);
        stars.push({ el: star, angle, distance, rotate });
      }

      document.body.appendChild(container);

      // অ্যানিমেশন এক্সিকিউশন
      requestAnimationFrame(() => {
        centerStar.style.transform =
          "translate(-50%, -50%) scale(1.6) rotate(45deg)";
        centerStar.style.opacity = "0";

        stars.forEach(({ el, angle, distance, rotate }) => {
          const tx = Math.cos(angle) * distance;
          const ty = Math.sin(angle) * distance;
          el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.2) rotate(${rotate}deg)`;
          
          setTimeout(() => {
            el.style.transform = `translate(calc(-50% + ${tx * 1.25}px), calc(-50% + ${ty * 1.25}px)) scale(0) rotate(${rotate + 45}deg)`;
            el.style.opacity = "0";
          }, 150);
        });
      });

      // ক্লিনআপ
      setTimeout(() => {
        container.remove();
      }, 550);
    };

    const handlePointerDown = (e) => {
      createStarBurst(e.clientX, e.clientY);
    };

    window.addEventListener("pointerdown", handlePointerDown, true);
    return () => window.removeEventListener("pointerdown", handlePointerDown, true);
  }, []);

  return null;
}