import p5 from "p5";

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

/** TODO. */
export class Body {
  /**
   * @param {Coordinate | number} x
   * @param {Coordinate | number} y
   */
  constructor(x, y) {
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
   * @type {Body}
   */
  at;
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
   * @param {Body} at
   * @param {Shape[]} links
   * @param {...Shape} links
   */
  constructor(width, height, at = body(0.5, 0.5), ...links) {
    this.width = typeof width === "number" ? w(width) : width;
    this.height = typeof height === "number" ? h(height) : height;
    this.at = at;
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
    p.translate(this.renderAt);

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
}

/**
 * Triangle.
 */
export class Triangle extends Shape {
  /**
   * @param {p5} p
   */
  renderShape(p) {
    //     ^ C
    //    / \
    // B .---. A
    const wh = this.renderWidth / 2;
    const hh = this.renderHeight / 2;
    p.triangle(wh, hh, -wh, hh, 0, -hh);
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
    p.ellipse(0, 0, this.renderWidth, this.renderHeight);
  }
}
