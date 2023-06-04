import type {
  BlendMode,
  ShaderFactory as CKShaderFactory,
  ColorSpace,
  EmbindEnumEntity,
  InputColor,
  InputFlexibleColorArray,
  InputMatrix,
  InputPoint,
  Shader,
} from "canvaskit-wasm";

import { nativeColor } from "../Core";

import { ColorShader } from "./ColorShader";
import { BlendShader } from "./BlendShader";
import type { ShaderJS } from "./Shader";
import { MakeLinearGradientShader } from "./MakeLinearGradientShader";
import { NoiseShader } from "./NoiseShader";

export const ShaderFactory: CKShaderFactory = {
  MakeBlend: function (mode: BlendMode, one: ShaderJS, two: ShaderJS): Shader {
    return new BlendShader(mode, one, two);
  },
  MakeColor: function (color: InputColor, _space: ColorSpace): Shader {
    return new ColorShader(nativeColor(color));
  },
  MakeFractalNoise: function (
    baseFreqX: number,
    baseFreqY: number,
    octaves: number,
    seed: number,
    _tileW: number,
    _tileH: number
  ): Shader {
    return new NoiseShader(baseFreqX, baseFreqY, octaves, seed);
  },
  MakeLinearGradient: function (
    start: InputPoint,
    end: InputPoint,
    colors: InputFlexibleColorArray,
    pos: number[] | null,
    mode: EmbindEnumEntity,
    localMatrix?: InputMatrix | undefined,
    flags?: number | undefined,
    colorSpace?: ColorSpace | undefined
  ): Shader {
    return new MakeLinearGradientShader(
      start,
      end,
      colors,
      pos,
      mode,
      localMatrix,
      flags,
      colorSpace
    );
  },
  MakeRadialGradient: function (
    _center: InputPoint,
    _radius: number,
    _colors: InputFlexibleColorArray,
    _pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _flags?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    throw new Error("Function not implemented.");
  },
  MakeSweepGradient: function (
    _cx: number,
    _cy: number,
    _colors: InputFlexibleColorArray,
    _pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | null | undefined,
    _flags?: number | undefined,
    _startAngle?: number | undefined,
    _endAngle?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    throw new Error("Function not implemented.");
  },
  MakeTurbulence: function (
    baseFreqX: number,
    baseFreqY: number,
    octaves: number,
    seed: number,
    _tileW: number,
    _tileH: number
  ): Shader {
    return new NoiseShader(baseFreqX, baseFreqY, octaves, seed, "turbulence");
  },
  MakeTwoPointConicalGradient: function (
    _start: InputPoint,
    _startRadius: number,
    _end: InputPoint,
    _endRadius: number,
    _colors: InputFlexibleColorArray,
    _pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _flags?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ): Shader {
    throw new Error("Function not implemented.");
  },
};
