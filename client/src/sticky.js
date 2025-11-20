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
   * @returns {number}
   */
  px() {
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
   * @param {Coordinate} width - OQ
   * @param {Coordinate} height - OQ
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * Render the shape to a sketch.
   * @param {p5} p - p5.js sketch.
   */
  render(p) {
    this.renderWidth = this.width.px();
    this.renderHeight = this.height.px();
    this.renderShape(p);
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
 * Circle.
 */
export class Circle extends Shape {
  /**
   * @param {Coordinate} width - OQ
   * @param {Coordinate} height - OQ
   */
  constructor(width, height) {
    super(width, height);
  }

  /**
   * @param {p5} p
   */
  renderShape(p) {
    p.ellipse(0, 0, this.renderWidth, this.renderHeight);
  }
}
