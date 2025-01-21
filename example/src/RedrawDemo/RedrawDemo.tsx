import { useEffect, useRef } from "react";
import { mat4 } from "wgpu-matrix";

import { useLoop, useOnFrame } from "../components";
import type { Surface } from "../components/redraw";
import { RedrawInstance } from "../components/redraw";
import { CircleShader } from "../components/redraw/Drawings";
import { BlendMode } from "../components/redraw/Paint";
import {
  FillColor,
  FillShader,
  FillTexture,
} from "../components/redraw/Drawings/Fill";

const pd = window.devicePixelRatio;

export const RedrawDemo = () => {
  const progress = useLoop();
  const ref = useRef<HTMLCanvasElement>(null);
  const Redraw = useRef<RedrawInstance>();
  const surface = useRef<Surface>();
  useEffect(() => {
    (async () => {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error("WebGPU not supported");
      }
      const device = await adapter.requestDevice();
      Redraw.current = new RedrawInstance(device);
      surface.current = Redraw.current.Surface.MakeFromCanvas(ref.current!);
    })();
  });
  useOnFrame(() => {
    if (surface.current && Redraw.current) {
      const offscreen = Redraw.current.Surface.MakeOffscreen(1080 * 2, 720 * 2);
      let recorder = offscreen.getRecorder();
      let paint = {
        useColor: 1,
        style: 0,
        color: Float32Array.of(0, 0, 0, 1),
        strokeWidth: 0,
      };
      const matrix = mat4.identity();
      recorder.draw(
        "fill",
        FillShader,
        BlendMode.SrcOver,
        paint,
        matrix,
        {
          radius: 720,
          center: [1080, 720],
        },
        [],
        6
      );
      paint = {
        useColor: 1,
        style: 0,
        color: Float32Array.of(1, 0, 1, 1),
        strokeWidth: 0,
      };
      recorder.fill(
        "fillColor",
        FillColor,
        BlendMode.SrcOver,
        { color: [0.3, 0.6, 1, 1] },
        []
      );
      recorder.draw(
        "circle",
        CircleShader,
        BlendMode.SrcOver,
        paint,
        matrix,
        {
          radius: 720,
          center: [1080, 720],
        },
        [],
        6
      );
      offscreen.flush();
      recorder = surface.current.getRecorder();
      recorder.fill("fillTexture", FillTexture, BlendMode.SrcOver, null, [
        offscreen.getCurrentTexture(),
      ]);
      // recorder.execute(
      //   new BlurImageFilter(
      //     {
      //       iterations: 10,
      //       size: 10,
      //       resolution: Float32Array.of(1080 * 2, 720 * 2),
      //     },
      //     offscreen.getCurrentTexture()
      //   )
      // );
      surface.current.flush();
    }
  }, [progress]);
  return (
    <div
      style={{
        width: 1080,
        height: 720,
        backgroundColor: "cyan",
      }}
    >
      <canvas
        ref={ref}
        style={{ display: "flex", flex: 1, width: "100%", height: "100%" }}
      />
    </div>
  );
};
