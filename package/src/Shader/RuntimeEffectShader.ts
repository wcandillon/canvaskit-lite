import type { RuntimeEffectContext } from "../RuntimeEffect";

import { ShaderJS } from "./Shader";

export class RuntimeEffectShader extends ShaderJS {
  constructor(private readonly ctx: RuntimeEffectContext) {
    super();
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const { gl } = this.ctx;
    const { width, height } = ctx.canvas;
    const canvas = gl.canvas as OffscreenCanvas;

    gl.canvas.width = width;
    gl.canvas.height = height;
    this.ctx.children.forEach(({ shader, index, texture, id }) => {
      // const child = shader.paint(ctx);
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Upload the image into the texture
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        (shader as any).image
      );
    });
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    const bitmap = canvas.transferToImageBitmap();
    return bitmap;
  }
}
