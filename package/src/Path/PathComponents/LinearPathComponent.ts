import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../../Core";
import { dist } from "../../Vector";

import type { PathComponent } from "./PathComponent";
import { derivativeSolve, linearSolve } from "./Polyline";

export class LinearPathComponent implements PathComponent {
  constructor(readonly p1: Point, readonly p2: Point) {}

  getPolyline() {
    return [this.p1, this.p2];
  }

  segment(start: number, stop: number): PathComponent {
    return new LinearPathComponent(
      this.pointAtLength(start),
      this.pointAtLength(stop)
    );
  }

  toCmd() {
    return [PathVerb.Line, this.p2[0], this.p2[1]];
  }

  toSVGString() {
    return `L${this.p2[0]} ${this.p2[1]}`;
  }

  pointAtLength(length: number) {
    const t = length / this.length();
    return linearSolve(t, this.p1, this.p2);
  }

  tangentAtLength(_: number) {
    return derivativeSolve(this.p1, this.p2);
  }

  length() {
    return dist(this.p1, this.p2);
  }
}
