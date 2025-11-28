import p5 from "p5";
import { Circle, Triangle, body, h, w } from "#sticky";

new p5((p) => {
  // Cat TODO
  const model = new Circle(
    h(1 / 2), 1 / 2, body(1 / 2, 1 / 2), { stroke: "pink" },
    // Ear
    new Triangle(1 / 4, 1 / 4, body(1 / 2, 1 / 4)),
    // Eye
    new Circle(
      1 / 4, 1 / 4 * 2 / 3, body(1 / 4, 1 / 2), {},
      new Circle(1 / 2, w(1 / 2), body(1 / 2, 1 / 2)),
    ),
    new Circle(
      1 / 4, 1 / 4 * 2 / 3, body(3 / 4, 1 / 2), {},
      new Circle(1 / 2, w(1 / 2), body(1 / 2, 1 / 2)),
    ),
  );

  p.setup = () => {
    p.createCanvas(640, 360);
  };

  p.draw = () => {
    p.background("black");
    p.noFill();
    model.render(p);
  };
});
