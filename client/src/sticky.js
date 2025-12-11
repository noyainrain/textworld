// eslint-disable-next-line no-unused-vars
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
    return this.value * shape.renderWidth;
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
    return this.value * shape.renderHeight;
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
   * @param {...Shape} links
   */
  constructor(width, height, ...links) {
    this.width = typeof width === "number" ? w(width) : width;
    this.height = typeof height === "number" ? h(height) : height;
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
    this.renderWidth = this.width.px(this);
    this.renderHeight = this.height.px(this);
    this.renderShape(p);

    for (const link of this.links) {
      link.render(p);
    }
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
