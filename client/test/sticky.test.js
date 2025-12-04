import { expect } from "chai";
import p5 from "p5";
import { Circle, h, px, w } from "#sticky";

/** @type {[(value: number) => import("#sticky").Coordinate, number, number][]} */
const data = [[px, 7, 7], [w, 1 / 2, 320], [h, 1 / 2, 180]];

for (const [unit, value, result] of data) {
  describe(unit.name, function () {
    describe("px", function () {
      it("should convert to pixels", function () {
        new p5((p) => {
          p.setup = () => {
            p.createCanvas(640, 360);

            const shape = new Circle(px(640), px(360));
            shape.render(p);

            const pixels = unit(value).px(shape);
            expect(pixels).to.equal(result);
          };
        });
      });
    });
  });
}
