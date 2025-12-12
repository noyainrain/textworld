import p5 from "p5";

/** TODO. */
export const AUTO = Symbol();

/** ... */
export class Coordinate {
  /**
   * ...
   * @type {number} - ...
   */
  value;

  /**
   * @param {number} value - ...
   */
  constructor(value) {
    this.value = value;
  }

  /**
   * ...
   * @param {Shape} shape - ...
   * @returns {number}
   */
  // eslint-disable-next-line no-unused-vars
  px(shape) {
    throw new Error("abstract");
  }
}

/** ... */
export class PixelCoordinate extends Coordinate {
  px() {
    return this.value;
  }
}

/**
 * ...
 * @param {number} value - ...
 * @returns {PixelCoordinate}
 */
export function px(value) {
  return new PixelCoordinate(value);
}

/** ... */
export class WidthCoordinate extends Coordinate {
  /** @param {Shape} shape */
  px(shape) {
    // shape.width.evaluate()
    // shape.base.width.evaluate()
    // shape.base.base.width.evaluate()
    // ...
    // canvas-width
    // 50%
    // 50%
    // -> canvas-width * 50% * 50%
    return this.value * (shape.base ? shape.base.renderWidth : (shape.p?.width ?? 0));
  }
}

/**
 * ...
 * @param {number} value
 * @returns {WidthCoordinate}
 */
export function w(value) {
  return new WidthCoordinate(value);
}

/** ... */
export class HeightCoordinate extends Coordinate {
  /** @param {Shape} shape */
  px(shape) {
    return this.value * (shape.base ? shape.base.renderHeight : (shape.p?.height ?? 0));
  }
}

/**
 * ...
 * @param {number} value
 * @returns {HeightCoordinate}
 */
export function h(value) {
  return new HeightCoordinate(value);
}

export class EdgeCoordinate extends Coordinate {
  /**
   * ...
   * @type {number}
   */
  index;

  /**
   * @param {number} index
   * @param {number} value
   */
  constructor(index, value) {
    super(value);
    this.index = index;
  }

  /**
   * @param {Shape} shape
   */
  // eslint-disable-next-line no-unused-vars
  px(shape) {
    return 0;
    // shape.getEdge(this.index)
    // this.value * shape.getEdgeLengthPx(this.index);
  }
}

/**
 * ...
 * @param {number} index
 * @param {number} value
 */
export function e(index, value) {
  return new EdgeCoordinate(index, value);
}

// e(0, 1 / 2)
// edge(0, px(50))
// edge(0, 1 / 2)
// edge(0, e(0, 1 / 2))

// export class PolygonEdge {
//   a;
//   b;
//
//   get lengthPx {
//   }
//
//   getPointPx(offsetPx) {
//
//   }
// }

// export class EllipseEdge {
//   center;
//   radiusX;
//   radiusY;
//   //start;
//   //end;
//
// }
//
// shape.getEdge(index).getPointPx(offset.px(shape))
//                                 shape.getEdge(index).lengthPx

/**
 * ...
 */
export class Position {
  /**
   * ...
   * @param {Shape} shape - ...
   * @returns {p5.Vector}
   */
  // eslint-disable-next-line no-unused-vars
  px(shape) {
    throw new Error("abstract");
  }
}

/** TODO. */
export class Body extends Position {
  /**
   * @param {Coordinate | number} x
   * @param {Coordinate | number} y
   */
  constructor(x, y) {
    super();
    this.x = typeof x === "number" ? w(x) : x;
    this.y = typeof y === "number" ? h(y) : y;
  }

  /**
   * @param {Shape} shape - ...
   * @returns {p5.Vector}
   */
  px(shape) {
    const x = this.x.px(shape);
    const y = this.y.px(shape);
    return shape.base
      ? new p5.Vector(x - (shape.base.renderWidth / 2), y - (shape.base.renderHeight / 2))
      : new p5.Vector(x, y);
  }
}

/**
 * @param {number} x
 * @param {number} y
 */
export function body(x, y) {
  return new Body(x, y);
}

// getEdges() -> curves (basically every curve is an axis)
// getCartesianCoordinateSystem() -> origin, xAxis, yAxis
// getPolarCoordinateSystem() -> pole, axis
export class Edge extends Position {
  /**
   * ...
   * @type {number}
   */
  index;
  /**
   * ...
   * @type {Coordinate}
   */
  offset;
  /**
   * ...
   * @type {Coordinate}
   */
  crossOffset;

  /**
   * @param {number} index
   * @param {Coordinate | number} offset
   * @param {Coordinate | number} crossOffset
   */
  constructor(index, offset = 1 / 2, crossOffset = 0) {
    super();
    this.index = index;
    this.offset = typeof offset === "number" ? e(index, offset) : offset;
    this.crossOffset = typeof crossOffset === "number" ? e(index, crossOffset) : crossOffset;
  }

  /**
   * @param {Shape} shape - ...
   */
  px(shape) {
    return shape.base?.getEdgePoint(this.index, this.offset, this.crossOffset.px(shape))
      ?? new p5.Vector();
  }
}

/**
 * ...
 * @param {number} index
 * @param {Coordinate | number} offset
 * @param {Coordinate | number} crossOffset
 */
export function edge(index, offset = 1 / 2, crossOffset = 0) {
  return new Edge(index, offset, crossOffset);
}

/**
 * Basic geometric shape.
 */
export class Shape {
  /**
   * OQ.
   * @type {Coordinate}
   */
  width;
  /**
   * OQ.
   * @type {Coordinate}
   */
  height;
  /**
   * TODO.
   * @type {Position}
   */
  at;
  /**
   * ...
   * @type {number}
   */
  orientation;
  /**
   * TODO.
   * @type {?string | AUTO}
   */
  stroke;
  /**
   * TODO.
   * @type {?string | AUTO}
   */
  fill;
  /**
   * TODO.
   * @type {number}
   */
  start;
  /**
   * TODO.
   * @type {number}
   */
  end;
  /**
   * TODO.
   * @type {?Shape}
   */
  base = null;
  /**
   * TODO.
   * @type {Shape[]}
   */
  links;
  /**
   * ...
   * @type {?p5}
   */
  p = null;
  /**
   * ...
   * @type {number}
   */
  renderWidth = 0;
  /**
   * ...
   * @type {number}
   */
  renderHeight = 0;

  /**
   * @param {Coordinate | number} width - OQ
   * @param {Coordinate | number} height - OQ
   * @param {Position} [at]
   * @param {Object} [options]
   * @param {number} [options.orientation]
   * @param {?string | AUTO} [options.stroke]
   * @param {?string | AUTO} [options.fill]
   * @param {number} [options.start]
   * @param {number} [options.end]
   * @param {...Shape} links
   */
  constructor(
    width, height, at = body(0.5, 0.5),
    { orientation = 0, stroke = AUTO, fill = AUTO, start = 0, end = -0 } = {},
    ...links
  ) {
    this.width = typeof width === "number" ? w(width) : width;
    this.height = typeof height === "number" ? h(height) : height;
    this.at = at;
    this.orientation = orientation;
    this.stroke = stroke;
    this.fill = fill;
    this.start = start;
    this.end = end;
    this.links = links;
    for (const link of links) {
      link.base = this;
    }
  }

  /**
   * Render the shape to a sketch.
   * @param {p5} p - p5.js sketch.
   */
  render(p) {
    this.p = p;
    this.renderWidth = this.width.px(this);
    this.renderHeight = this.height.px(this);
    this.renderAt = this.at.px(this);
    p.push();
    if (this.stroke !== AUTO) {
      p.stroke(this.stroke ?? "transparent");
    }
    if (this.fill !== AUTO) {
      p.fill(this.fill ?? "transparent");
    }
    p.translate(this.renderAt);
    p.rotate(this.orientation);

    this.renderShape(p);

    for (const link of this.links) {
      link.render(p);
    }
    p.pop();
  }

  /**
   * Render the shape itself to a sketch.
   * @param {p5} p - p5.js sketch.
   */
  // eslint-disable-next-line no-unused-vars
  renderShape(p) {
    throw new Error("Unimplemented method");
  }

  /**
   * ...
   * @param {number} index - ...
   * @param {Coordinate | number} offset - ...
   * @param {number} crossOffset - ...
   * @returns {p5.Vector}
   */
  // eslint-disable-next-line no-unused-vars
  getEdgePoint(index, offset, crossOffset) {
    throw new Error("Unimplemented method");
  }
}

class Polygon extends Shape {
  /** @type {p5.Vector[]} */
  vertices = [];
  /** @type {?p5.Vector[]} */
  #points = null;
  /** @type {boolean} */
  #closed = false;

  /**
   * @param {p5} p
   */
  renderShape(p) {
    if (!this.#points) {
      const startIndex = Math.trunc(this.start);
      const startOffset = this.start - startIndex;
      const end = Object.is(this.end, -0) ? this.vertices.length : this.end;
      const endIndex = Math.trunc(end);
      const endOffset = end - endIndex;

      this.#points = [];
      this.#points.push(this.getEdgePoint(startIndex, startOffset));
      // console.log("PARAMS", startIndex, startOffset, endIndex, endOffset);
      // console.log("INITIAL POINT", this.#points[0]);

      // const limit = (endIndex + 1) % this.#vertices.length;
      // let i = (startIndex + 1) % this.#vertices.length;

      // console.log("STARTLIMIT", (startIndex + 1) % this.vertices.length, endIndex % this.vertices.length);
      for (
        let i = startIndex + 1;
        i < endIndex + Math.ceil(endOffset);
        i++
        // let i = (startIndex + 1) % this.vertices.length;
        // i !== (endIndex + 1) % this.vertices.length;
        // i = i + 1
      ) {
      // while (i !== limit) {
        // console.log("COLLECTION POINT", i);
        const point = this.vertices[i % this.vertices.length];
        if (!point) {
          throw new Error("Assertion failed");
        }
        this.#points.push(point);
        // i = (i + 1) % this.#vertices.length;
      }
      if (
        (startIndex % this.vertices.length) === (endIndex % this.vertices.length)
        && startOffset === endOffset
      ) {
        this.#closed = true;
      } else {
        this.#points.push(this.getEdgePoint(endIndex, endOffset));
        this.#closed = false;
      }
      // console.log("TRI POINTS", this.#points, this.#closed);
    }

    p.beginShape();
    for (const point of this.#points) {
      p.vertex(point.x, point.y);
    }
    p.endShape(this.#closed ? p.CLOSE : undefined);
  }

  /**
   * @param {number} index
   * @param {number} offset
   * @returns {p5.Vector}
   */
  getEdgePoint(index, offset) {
    const p1 = this.vertices[index % this.vertices.length];
    const p2 = this.vertices[(index + 1) % this.vertices.length];
    if (!(p1 && p2)) {
      throw new Error("Assertion failed");
    }
    // console.log("GEP", p1, p2, offset);
    return p5.Vector.sub(p2, p1).mult(offset).add(p1);
  }
}

/**
 * Triangle.
 */
export class Triangle extends Polygon {
  /**
   * @param {p5} p
   */
  renderShape(p) {
    //     ^ C
    //    / \
    // B .---. A
    const wh = this.renderWidth / 2;
    const hh = this.renderHeight / 2;
    // p.triangle(wh, hh, -wh, hh, 0, -hh);

    // if (this.renderWidth !== this.cacheWidth && this.renderHeight !== this.cacheHeight) {
    this.vertices = [
      new p5.Vector(wh, hh),
      new p5.Vector(-wh, hh),
      new p5.Vector(0, -hh),
    ];
    super.renderShape(p);
  }
}

/**
 * Circle.
 */
export class Circle extends Shape {
  /**
   * @param {p5} p
   */
  renderShape(p) {
    const end = Object.is(this.end, -0) ? 1 : this.end;
    p.arc(
      0, 0, this.renderWidth, this.renderHeight, this.start * 2 * Math.PI, end * 2 * Math.PI,
    );
  }

  // getEdgeLength(index) {
  // }

  /**
   * ...
   * @param {number} index
   * @param {Coordinate} offset
   * @param {number} crossOffset
   */
  getEdgePoint(index, offset, crossOffset) {
    if (offset instanceof EdgeCoordinate) {
      const angle = offset.value * 2 * Math.PI;
      return new p5.Vector(
        (this.renderWidth / 2 + crossOffset) * Math.cos(angle),
        (this.renderHeight / 2 + crossOffset) * Math.sin(angle),
      );

      // const renderCrossOffset = crossOffset.px(this);
      // const crossAxis = p5.Vector.fromAngle(angle);
      // const point = new p5.Vector(center.x * Math.cos(t), center.y * Math.sin(t));
      // const center = new p5.Vector(this.renderWidth / 2, this.renderHeight / 2);
      // const crossAxis = p5.Vector.sub(point, center).normalize();
      // return point;
    } else {
      // const t = offsetPx / this.lengthPx;
      return new p5.Vector(0, 0);
    }
  }
}
