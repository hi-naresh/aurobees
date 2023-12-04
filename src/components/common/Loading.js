import React, { useEffect, useRef } from "react";
import "./Loading.css";
// import Logo from "../../icons/a.svg";

const Loading = () => {
  const colorSvgRef = useRef(null);

  useEffect(() => {
    const colorSvg = colorSvgRef.current;
    if (!colorSvg) return;

    // Create clipPath
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.setAttribute("id", "clip");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", 0);
    rect.setAttribute("y", "100%");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    clipPath.appendChild(rect);
    colorSvg.prepend(clipPath);

    // Apply clipPath to all paths in the colored SVG
    const paths = colorSvg.querySelectorAll("path");
    paths.forEach((path) => {
      path.setAttribute("clip-path", "url(#clip)");
    });

    // Animate the rect in clipPath
    rect.animate([{ y: "100%" }, { y: "0%" }], {
      duration: 2500,
      fill: "forwards",
      iterations: Infinity,
      direction: 'alternate'
    });
  }, []);

  return (
    <div className="loading-container">
      <svg
        ref={colorSvgRef}
        width="231"
        height="206.5"
        viewBox="0 0 462 413"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M417.186 122.979C409.986 88.1606 389.657 62.5166 358.503 46.6487C326.845 30.54 293.916 29.2638 261.802 46.0226C250.953 51.6812 241.353 59.7476 230.048 67.4528C228.056 65.8154 225.536 63.8891 223.184 61.7943C202.231 43.1573 178.086 33.8869 149.788 34.8019C112.682 35.9818 83.7608 52.4517 62.3517 81.876C45.7668 104.655 39.5025 130.708 42.8866 159.073C45.7908 183.44 54.9833 204.678 72.1922 222.063C122.667 272.966 173.309 323.651 223.928 374.386C226.064 376.529 228.656 378.238 231.152 380.237C233.337 378.359 234.921 377.155 236.313 375.758C287.747 324.133 339.638 272.966 390.401 220.69C416.682 193.602 424.819 159.964 417.162 122.979H417.186ZM78.3605 145.227C79.4165 101.597 112.466 73.328 149.164 71.4499C170.525 70.3423 188.046 77.6381 202.999 92.7837C217.16 107.111 216.92 106.87 231.152 121.1L125.907 224.856C112.586 211.516 114.626 213.563 101.258 200.272C85.8489 184.957 77.8565 166.176 78.3605 145.227ZM229.664 328.226C227.792 326.541 225.08 324.326 222.608 321.822C204.511 303.69 186.462 285.535 168.389 267.379L272.699 162.733C285.347 175.446 297.972 188.16 310.525 200.97C317.773 208.362 325.045 212.961 335.582 211.516C339.086 211.035 347.294 206.845 351.303 206.845C311.701 246.358 268.666 289.315 229.688 328.202L229.664 328.226Z"
          fill="url(#paint0_linear_171_27)"
        />
        <rect
          width="148.088"
          height="64.6985"
          transform="matrix(0.705965 -0.708247 0.705965 0.708247 124.707 223.84)"
          fill="#1F2557"
        />
        <path
          d="M331.11 75.2415C354.559 75.41 371.84 94.5768 372.8 118.8C373.544 137.461 352.303 161.131 330.27 160.649C306.629 160.143 286.66 137.846 287.356 116.585C288.028 96.2382 307.277 73.1948 331.11 75.2415Z"
          fill="#1F2557"
        />
        <defs>
          <linearGradient
            id="paint0_linear_171_27"
            x1="230.957"
            y1="34"
            x2="230.957"
            y2="380.237"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FDDC74" />
            <stop offset="0.291667" stop-color="#FDB63F" />
            <stop offset="0.640625" stop-color="#F6992A" />
            <stop offset="0.994792" stop-color="#EF7700" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Loading;
