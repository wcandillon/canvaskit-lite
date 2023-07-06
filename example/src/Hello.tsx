/* eslint-disable max-len */
import type { Canvas as CKCanvas } from "canvaskit-wasm";

import type { AnimationValue, Info } from "./components";
import { Canvas, useOnDraw, useLoop } from "./components";

/*
<svg width="3953" height="1292" viewBox="0 0 3953 1292" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2868.7 857.215C2743.92 830.042 2639.02 874.78 2593.13 1021.22C2561.17 1123.15 2403.3 1319.97 2305.55 1209.16C2218.33 1110.1 2292 793.509 2312.54 698.292C2332.8 604.293 2369.58 340.888 2490.83 345.598C2515.49 346.566 2536.16 364.754 2542.62 388.558C2590.42 563.642 2401.73 790.514 2291.69 959.482C2280.79 976.204 2268.53 997.669 2256.04 1017.51C2198.69 1113.38 2068.01 1319.85 1970.24 1209.03C1883.01 1109.98 1956.72 793.384 1977.23 698.168C1997.49 604.168 2034.26 340.763 2155.52 345.474C2180.18 346.441 2200.84 364.629 2207.34 388.434C2255.1 563.517 2066.42 790.389 1956.41 959.358C1912.64 1026.53 1857.51 1126.83 1780.02 1194.68C1703.51 1261.66 1578.07 1250.28 1521.29 1181.2C1474.46 1124.27 1473.3 1010.55 1502.55 934.742C1539.98 837.654 1707.6 798.75 1707.6 920.11C1707.6 1016.11 1635.61 1081.03 1523.41 1160.33C1455.48 1208.32 1332.57 1299.88 1287.87 1181.98C1258.93 1098.31 1371.97 905.135 1243.07 897.117C1131.46 890.16 1016.95 1142.8 985.079 1238.7C986.609 963.412 1023.04 634.554 1140.3 436.166C1168.71 387.965 1214.44 326.661 1274.16 341.168C1438.53 381.039 1245.13 619.112 1068.34 822.96C967.285 939.516 803 1217.49 643 1063C483 908.513 464.659 -26.1337 51 153.001M2868.7 857.215C2728.5 814.692 2618.8 917.677 2593.13 1022.16C2574.93 1096.32 2595.88 1175.03 2676.21 1217.49C2892.52 1331.8 3124.34 955.177 2868.7 857.215ZM2868.7 857.215C2814.88 862.207 2791.4 933.588 2813.69 1005.37C2848.03 1118.28 3004.12 1131.69 3094 1093.41C3661.6 855.629 2987 35 3903 51" stroke="black" stroke-width="100" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
*/
const colors = [
  "#3FCEBC",
  "#3СВСЕВ",
  "#5F96E7",
  "#816FE3",
  "#9F5EE2",
  "#BD4CEO",
  "#DE589F",
  "#FF645E",
  "#FDA859",
  "#FAEC54",
  "#9EE671",
  "#41E08D",
].map((cl) => CanvasKit.parseColorString(cl));

const paint = new CanvasKit.Paint();
paint.setStyle(CanvasKit.PaintStyle.Stroke);
paint.setStrokeWidth(75);
paint.setStrokeCap(CanvasKit.StrokeCap.Round);
paint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
paint.setShader(
  CanvasKit.Shader.MakeLinearGradient(
    Float32Array.of(0, 0),
    Float32Array.of(1838.4, 0),
    colors,
    null,
    CanvasKit.TileMode.Clamp
  )
);

const path = CanvasKit.Path.MakeFromSVGString(
  "M50 798.409C50 798.409 172.047 665.479 275.44 546.213C456.322 337.625 654.197 94.016 486.028 53.2177C424.924 38.3733 378.131 101.103 349.064 150.425C229.094 353.427 191.818 689.933 190.253 971.626C222.865 873.493 340.025 614.976 454.214 622.095C586.099 630.3 470.44 827.97 500.05 913.589C545.789 1034.23 671.541 940.533 741.045 891.434C855.841 810.285 929.497 743.852 929.497 645.623C929.497 521.44 758.006 561.249 719.708 660.595C689.78 738.169 690.962 854.531 738.873 912.791C796.974 983.47 925.313 995.122 1003.6 926.582C1082.88 857.148 1139.29 754.514 1184.07 685.783C1296.63 512.885 1489.68 280.737 1440.81 101.582C1434.17 77.2243 1413.02 58.6128 1387.79 57.6232C1263.73 52.8027 1226.1 322.333 1205.37 418.519C1184.39 515.949 1108.97 839.91 1198.22 941.267C1298.26 1054.66 1431.96 843.389 1490.64 745.288C1503.41 724.985 1515.97 703.021 1527.11 685.91C1639.71 513.012 1832.76 280.864 1783.86 101.71C1777.25 77.3519 1756.1 58.7404 1730.87 57.7508C1606.81 52.9304 1569.18 322.461 1548.45 418.646C1527.43 516.077 1452.05 840.037 1541.3 941.394C1641.3 1054.79 1802.83 853.381 1835.54 749.087C1882.49 599.238 1989.81 553.46 2117.48 581.265C1974.03 537.753 1861.79 643.133 1835.54 750.045C1816.92 825.927 1838.35 906.47 1920.53 949.918C2141.85 1066.89 2379.05 681.505 2117.48 581.265C2062.42 586.373 2038.4 659.414 2061.2 732.87C2096.34 848.401 2256.04 862.128 2348 822.958"
)!;

const drawShader = (
  progress: AnimationValue,
  canvas: CKCanvas,
  _info: Info
) => {
  const pathToDraw = path.copy().trim(0, 1 - progress.value, false)!;
  canvas.save();
  canvas.scale(0.8, 0.8);
  canvas.drawPath(pathToDraw, paint);
  canvas.restore();
};

export const Hello = () => {
  const progress = useLoop();
  const onDraw = useOnDraw(drawShader.bind(null, progress), []);
  return <Canvas onDraw={onDraw} deps={[progress]} />;
};
