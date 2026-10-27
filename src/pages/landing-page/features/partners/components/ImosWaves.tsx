import { FC, useCallback, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PARTNERS_COLOURS } from "../constants";

interface ImosWavesProps {
  isLive: boolean;
}

const TAU = Math.PI * 2;
const LINE_GAP = 13;
const STEP = 12;
const MAX_PIXEL_RATIO = 2;

const ImosWaves: FC<ImosWavesProps> = ({ isLive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useRef({ width: 0, height: 0, pixelRatio: 1 });
  const motion = useRef({ time: 0, speed: 0, target: 0, frame: 0, last: 0 });

  // Stable so the effects below run once, not on every render
  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { width: W, height: H, pixelRatio } = size.current;
    const t = motion.current.time;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Lines fade in from the text side, so they never sit behind the text
    const line = PARTNERS_COLOURS.imosWave;
    const gradient = ctx.createLinearGradient(0, 0, W, 0);
    gradient.addColorStop(0, alpha(line, 0));
    gradient.addColorStop(0.3, alpha(line, 0.035));
    gradient.addColorStop(0.62, alpha(line, 0.22));
    gradient.addColorStop(1, alpha(line, 0.2));
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;

    const slope = 0.4;
    const A1 = H * 0.12;
    const A2 = H * 0.035;
    const L1 = W * 1.25;
    const L2 = W * 0.42;
    const count = Math.ceil((H + slope * W + 2 * (A1 + A2)) / LINE_GAP);
    for (let i = 0; i < count; i++) {
      const offset = -(A1 + A2) + i * LINE_GAP;
      // Main swell, each line a bit out of phase
      const p1 = t * 0.9 + i * 0.045;
      // Short counter ripple
      const p2 = -t * 1.3 + i * 0.12;
      ctx.beginPath();
      for (let x = -STEP; x <= W + STEP; x += STEP) {
        // Bigger swell under the light band
        const fold = 0.7 + 0.5 * Math.exp(-Math.pow(x / W - 0.66, 2) / 0.06);
        const y =
          offset -
          slope * x +
          slope * W * 0.15 +
          fold * A1 * Math.sin((TAU * x) / L1 + p1) +
          A2 * Math.sin((TAU * x) / L2 + p2);
        if (x === -STEP) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, []);

  // Match the canvas to its box and redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = motion.current;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_PIXEL_RATIO
      );
      size.current = { width: rect.width, height: rect.height, pixelRatio };
      canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(state.frame);
    };
  }, [draw]);

  // Ease the waves in when live, and ease them to a stop when not
  useEffect(() => {
    const state = motion.current;
    state.target = isLive ? 1 : 0;
    if (state.frame || (!isLive && state.speed === 0)) return;

    const step = (now: number) => {
      const dt = Math.min((now - state.last) / 1000, 0.05);
      state.last = now;
      state.speed += (state.target - state.speed) * Math.min(1, dt * 2.5);
      state.time += state.speed * dt;
      draw();
      if (state.target || state.speed > 0.004) {
        state.frame = requestAnimationFrame(step);
      } else {
        state.frame = 0;
        state.speed = 0;
      }
    };
    state.last = performance.now();
    state.frame = requestAnimationFrame(step);
  }, [isLive, draw]);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default ImosWaves;
