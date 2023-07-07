import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../../Core";
import { dist } from "../../Vector";

import type { PathComponent } from "./PathComponent";
import { linearSolve, linearSolveDerivative } from "./Polyline";

export class LinearPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly p2: Point) {}

  segment(start: number, stop: number): PathComponent {
    return new LinearPathComponent(
      this.solve(this.tAtLength(start)),
      this.solve(this.tAtLength(stop))
    );
  }

  solve(t: number) {
    return linearSolve(t, this.p1, this.p2);
  }

  solveDerivative() {
    return linearSolveDerivative(this.p1, this.p2);
  }

  tAtLength(length: number) {
    return length / this.length();
  }

  toCmd() {
    return [PathVerb.Line, this.p2[0], this.p2[1]];
  }

  toSVGString() {
    return `L${this.p2[0]} ${this.p2[1]}`;
  }

  length() {
    return dist(this.p1, this.p2);
  }
}
