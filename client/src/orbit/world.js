// eslint-disable-next-line no-unused-vars
import p5 from "p5";
import { Rectangle, body } from "#sticky";

/**
 * ...
 */
export class World {
  /**
   * ...
   * @type {p5}
   */
  p;

  /**
   * @param {p5} p
   */
  constructor(p) {
    this.p = p;
    this.model = new Rectangle(1, 1, body(1 / 2, 1 / 2), { fill: "black", stroke: null });
  }

  /**
   * ...
   */
  render() {
    this.model.render(this.p);
  }
};
