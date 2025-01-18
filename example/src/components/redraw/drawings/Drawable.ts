import type { Paint } from "../Paint";
import { GPUBlendModes } from "../Paint";

export interface DrawingCommand {
  paint: Paint;
  pipeline: GPURenderPipeline;
  vertexCount: number;
}

export class GPUResources {
  public modules: Map<string, GPUShaderModule> = new Map();
  public pipelines: Map<string, GPURenderPipeline> = new Map();
  public computePipelines: Map<string, GPUComputePipeline> = new Map();
  private static instances: Map<GPUDevice, GPUResources> = new Map();

  private constructor() {}

  static getInstance(device: GPUDevice) {
    if (!GPUResources.instances.has(device)) {
      GPUResources.instances.set(device, new GPUResources());
    }
    return GPUResources.instances.get(device)!;
  }
}

export const makeDrawable = (
  device: GPUDevice,
  key: string,
  module: string,
  paint: Paint,
  vertexCount: number
): DrawingCommand => {
  const resources = GPUResources.getInstance(device);
  if (!resources.modules.has(key)) {
    resources.modules.set(key, device.createShaderModule({ code: module }));
  }
  const blendMode = paint.getBlendMode();
  const mod = resources.modules.get(key)!;
  const pipelineKey = `${key}-${blendMode}`;
  if (!resources.pipelines.has(pipelineKey)) {
    const format = navigator.gpu.getPreferredCanvasFormat();
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      label: "Fill",
      vertex: {
        module: mod,
      },
      fragment: {
        module: mod,
        targets: [
          {
            format,
            blend: GPUBlendModes[blendMode],
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
    resources.pipelines.set(pipelineKey, pipeline);
  }
  const pipeline = resources.pipelines.get(pipelineKey)!;
  const layout = pipeline.getBindGroupLayout(0);
  layout.label = "Circle Bind Group Layout";
  return {
    pipeline,
    vertexCount,
    paint,
  };
};
