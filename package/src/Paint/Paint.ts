import type {
  Color,
  ColorSpace,
  EmbindEnumEntity,
  Paint,
  PathEffect,
} from "canvaskit-wasm";

import type { InputColor } from "../Core";
import { StrokeJoin, nativeColor, StrokeCap, PaintStyle } from "../Core";
import type { ShaderJS } from "../Shader";
import type { ImageFilterJS } from "../ImageFilter";
import { HostObject } from "../HostObject";
import type { MaskFilterJS } from "../MaskFilter/MaskFilter";
import { createOffscreenTexture } from "../Core/Platform";
import type { ColorFilterJS } from "../ColorFilter/ColorFilter";
import type { SVGContext } from "../SVG";

import { getBlendMode } from "./BlendMode";

interface PaintContext {
  ctx: CanvasRenderingContext2D;
  svgCtx: SVGContext;
}

export class PaintJS extends HostObject<Paint> implements Paint {
  private style = PaintStyle.Fill;
  private color: Color | null = null;
  private strokeWidth: number | null = null;
  private strokeMiter: number | null = null;
  private shader: ShaderJS | null = null;
  private colorFilter: ColorFilterJS | null = null;
  private imageFilter: ImageFilterJS | null = null;
  private maskFilter: MaskFilterJS | null = null;
  private strokeJoin: Miter | null = null;
  private strokeCap: Cap | null = null;
  private blendMode: GlobalCompositeOperation | null = null;

  apply(
    paintCtx: PaintContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    draw: (ctx: CanvasRenderingContext2D) => any,
    path?: boolean
  ) {
    const { ctx } = paintCtx;
    ctx.save();
    this.processFilter(paintCtx);
    this.processStyle(ctx);
    if (this.blendMode) {
      ctx.globalCompositeOperation = this.blendMode;
    }
    if (!path) {
      ctx.beginPath();
      draw(ctx);
      if (this.style === PaintStyle.Fill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    } else {
      const p = draw(ctx);
      if (this.style === PaintStyle.Fill) {
        ctx.fill(p);
      } else {
        ctx.stroke(p);
      }
    }
    ctx.restore();
  }

  private processStyle(ctx: CanvasRenderingContext2D) {
    let style: CanvasPattern | string | null = null;
    if (this.shader) {
      const texture = this.shader.paint(
        createOffscreenTexture(ctx.canvas.width, ctx.canvas.height)
      );
      const pattern = ctx.createPattern(texture, null)!;
      pattern.setTransform(ctx.getTransform());
      style = pattern;
      texture.close();
    } else if (this.color !== null) {
      style = nativeColor(this.color);
    }
    if (style && this.style === PaintStyle.Fill) {
      ctx.fillStyle = style;
    } else if (style) {
      ctx.strokeStyle = style;
    }
    if (this.strokeMiter !== null) {
      ctx.miterLimit = this.strokeMiter;
    }
    if (this.strokeWidth !== null) {
      ctx.lineWidth = this.strokeWidth;
    }
    if (this.strokeCap !== null) {
      ctx.lineCap = this.strokeCap;
    }
    if (this.strokeJoin !== null) {
      ctx.lineJoin = this.strokeJoin;
    }
  }

  private processFilter(paintCtx: PaintContext) {
    const { ctx, svgCtx } = paintCtx;
    if (this.maskFilter || this.imageFilter || this.colorFilter) {
      const filter: string[] = [];
      if (this.maskFilter) {
        const { id, filters } = this.maskFilter;
        const url = svgCtx.create(id, filters);
        filter.push(url);
      }
      if (this.imageFilter) {
        const { id, filters } = this.imageFilter;
        const url = svgCtx.create(id, filters);
        filter.push(url);
      }
      if (this.colorFilter) {
        const { id, filters } = this.colorFilter;
        const url = svgCtx.create(id, filters);
        filter.push(url);
      }
      ctx.filter = filter.join(" ");
    }
  }

  copy(): Paint {
    const {
      style,
      color,
      strokeWidth,
      strokeMiter,
      strokeJoin,
      strokeCap,
      blendMode,
      shader,
      imageFilter,
      colorFilter,
      maskFilter,
    } = this;
    const paint = new PaintJS();
    paint.setStyle(style);
    if (color !== null) {
      paint.color = color;
    }
    paint.strokeWidth = strokeWidth;
    paint.strokeMiter = strokeMiter;
    paint.strokeJoin = strokeJoin;
    paint.strokeCap = strokeCap;
    paint.blendMode = blendMode;
    if (shader) {
      paint.setShader(shader);
    }
    if (imageFilter) {
      paint.imageFilter = imageFilter;
    }
    if (colorFilter) {
      paint.colorFilter = colorFilter;
    }
    if (maskFilter) {
      paint.maskFilter = maskFilter;
    }
    return paint;
  }
  getColor() {
    return this.color ?? Float32Array.of(0, 0, 0, 1);
  }
  getStrokeCap(): EmbindEnumEntity {
    return lineCap(this.strokeCap);
  }
  getStrokeJoin(): EmbindEnumEntity {
    return lineJoin(this.strokeJoin);
  }
  getStrokeMiter() {
    return this.strokeMiter ?? 10;
  }
  getStrokeWidth() {
    return this.strokeWidth ?? 1;
  }
  setAlphaf(alpha: number) {
    if (this.color === null) {
      this.color = Float32Array.of(0, 0, 0, alpha);
    } else {
      this.color[3] = alpha;
    }
  }
  setAntiAlias(_aa: boolean): void {}
  setBlendMode(mode: EmbindEnumEntity): void {
    this.blendMode = getBlendMode(mode);
  }
  setColor(color: InputColor, _colorSpace?: ColorSpace | undefined): void {
    if (color instanceof Float32Array) {
      this.color = color;
    } else {
      this.color = Float32Array.from(color);
    }
  }
  setColorComponents(
    r: number,
    g: number,
    b: number,
    a: number,
    _colorSpace?: ColorSpace | undefined
  ): void {
    this.color = new Float32Array([r, g, b, a]);
  }
  setColorFilter(filter: ColorFilterJS | null): void {
    this.colorFilter = filter;
  }
  setColorInt(_color: number, _colorSpace?: ColorSpace | undefined): void {
    throw new Error("Method not implemented.");
  }
  setDither(_shouldDither: boolean): void {
    throw new Error("Method not implemented.");
  }
  setImageFilter(filter: ImageFilterJS | null): void {
    this.imageFilter = filter;
  }
  setMaskFilter(filter: MaskFilterJS | null): void {
    this.maskFilter = filter;
  }
  setPathEffect(_effect: PathEffect | null): void {
    throw new Error("Method not implemented.");
  }
  setShader(shader: ShaderJS | null): void {
    this.shader = shader;
  }
  setStrokeCap(cap: EmbindEnumEntity): void {
    this.strokeCap = nativeLineCap(cap);
  }
  setStrokeJoin(join: EmbindEnumEntity): void {
    this.strokeJoin = nativeLineJoin(join);
  }
  setStrokeMiter(limit: number): void {
    this.strokeMiter = limit;
  }
  setStrokeWidth(width: number): void {
    this.strokeWidth = width;
  }
  setStyle(style: EmbindEnumEntity): void {
    this.style = style;
  }
}

const lineCap = (cap: Cap | null) => {
  if (cap === null) {
    return StrokeCap.Butt;
  }
  switch (cap) {
    case "butt":
      return StrokeCap.Butt;
    case "round":
      return StrokeCap.Round;
    case "square":
      return StrokeCap.Square;
    default:
      throw new Error(`Unknown line cap: ${cap}`);
  }
};

const nativeLineCap = (cap: EmbindEnumEntity) => {
  switch (cap.value) {
    case 0:
      return "butt";
    case 1:
      return "round";
    case 2:
      return "square";
    default:
      throw new Error(`Unknown line cap: ${cap.value}`);
  }
};

const lineJoin = (join: string | null) => {
  if (join === null) {
    return StrokeJoin.Miter;
  }
  switch (join) {
    case "miter":
      return StrokeJoin.Miter;
    case "round":
      return StrokeJoin.Round;
    case "bevel":
      return StrokeJoin.Bevel;
    default:
      throw new Error(`Unknown line cap: ${join}`);
  }
};

const nativeLineJoin = (join: EmbindEnumEntity) => {
  switch (join.value) {
    case 0:
      return "miter";
    case 1:
      return "round";
    case 2:
      return "bevel";
    default:
      throw new Error(`Unknown line cap: ${join.value}`);
  }
};

type Miter = "miter" | "round" | "bevel";
type Cap = "butt" | "round" | "square";
