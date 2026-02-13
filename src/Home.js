import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const STEP = 140;
const SAFE_GAP = 100;

export default function Home() {
  const navigate = useNavigate();

  const noRef = useRef(null);
  const yesRef = useRef(null);

  const [noPosition, setNoPosition] = useState({ top: 350, left: 600 });
  const [hideNo, setHideNo] = useState(false);

  const directions = [
    { x: STEP, y: STEP },
    { x: STEP, y: -STEP },
    { x: -STEP, y: STEP },
    { x: -STEP, y: -STEP },
  ];

  const getYesRect = () => {
    return yesRef.current?.getBoundingClientRect();
  };

  const isOverlappingYes = (nextTop, nextLeft) => {
    const yesRect = getYesRect();
    const noEl = noRef.current;

    if (!yesRect || !noEl) return false;

    const noWidth = noEl.offsetWidth;
    const noHeight = noEl.offsetHeight;

    return !(
      nextLeft + noWidth + SAFE_GAP < yesRect.left ||
      nextLeft > yesRect.right + SAFE_GAP ||
      nextTop + noHeight + SAFE_GAP < yesRect.top ||
      nextTop > yesRect.bottom + SAFE_GAP
    );
  };

  const clamp = (top, left) => {
    const maxLeft = window.innerWidth - 140;
    const maxTop = window.innerHeight - 90;

    return {
      top: Math.max(0, Math.min(top, maxTop)),
      left: Math.max(0, Math.min(left, maxLeft)),
    };
  };

  const moveNoButton = () => {
    let attempts = 0;
    let next;

    do {
      const dir = directions[Math.floor(Math.random() * directions.length)];

      next = clamp(
        noPosition.top + dir.y,
        noPosition.left + dir.x
      );

      attempts++;
    } while (isOverlappingYes(next.top, next.left) && attempts < 12);

    setNoPosition(next);
  };

  return (
    <div className="valentine-bg">
      <div className="container">
        <h1 className="title">Hey Girlie! 💖</h1>
        <h2 className="subtitle">Will you be my  Valentine??</h2>
       
        <button
          ref={yesRef}
          className="yes-btn"
          onClick={() => navigate("/note")}
        >
          Yes 💘
        </button>

        {!hideNo && (
          <button
            ref={noRef}
            className="no-btn"
            style={{
              top: noPosition.top,
              left: noPosition.left,
              position: "absolute"
            }}
            onMouseEnter={moveNoButton}
            onClick={() => setHideNo(true)}
          >
            No 🙈
          </button>
        )}
      </div>
    </div>
  );
}
