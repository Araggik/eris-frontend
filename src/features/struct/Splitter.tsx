import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import styles from "./Splitter.module.css";

interface SplitterProps {
  left: ReactNode;
  right: ReactNode;
  defaultRatio?: number;
  minRatio?: number;
  maxRatio?: number;
}

const KEYBOARD_STEP = 0.02;

export function Splitter({
  left,
  right,
  defaultRatio = 0.3,
  minRatio = 0.15,
  maxRatio = 0.85,
}: SplitterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(defaultRatio);
  const [dragging, setDragging] = useState(false);

  const clamp = (value: number) => Math.min(maxRatio, Math.max(minRatio, value));

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }
    const rect = container.getBoundingClientRect();
    setRatio(clamp((event.clientX - rect.left) / rect.width));
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      setRatio((prev) => clamp(prev - KEYBOARD_STEP));
    } else if (event.key === "ArrowRight") {
      setRatio((prev) => clamp(prev + KEYBOARD_STEP));
    } else if (event.key === "Home") {
      setRatio(defaultRatio);
    } else {
      return;
    }
    event.preventDefault();
  };

  const dividerClass = dragging
    ? `${styles["splitter__divider"]} ${styles["splitter__divider--active"]}`
    : styles["splitter__divider"];

  return (
    <div className={styles["splitter"]} ref={containerRef}>
      <div className={styles["splitter__pane"]} style={{ flexBasis: `${ratio * 100}%` }}>
        {left}
      </div>
      <div
        className={dividerClass}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={Math.round(minRatio * 100)}
        aria-valuemax={Math.round(maxRatio * 100)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onKeyDown={handleKeyDown}
      />
      <div className={`${styles["splitter__pane"]} ${styles["splitter__pane--grow"]}`}>
        {right}
      </div>
    </div>
  );
}
