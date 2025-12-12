import p5 from "p5";
import { Circle, Triangle, body, edge, h, px, w } from "#sticky";

new p5((p) => {
  const model = new Circle(
    1, 1, body(1 / 2, 1 / 2), {},

    // Stars
    ...[...Array(128)].map(() => {
      const r = px(p.random(1, 4));
      return new Circle(r, r, body(p.random(), p.random()), { fill: "white" });
    }),

    // Stars
    // repeated(
    //   100,
    //   new Circle(random(px(1), px(4)), body(random(), random())),
    // ),

    // Cat TODO
    new Circle(
      h(1 / 2), 1 / 2, body(1 / 2, 1 / 2), { stroke: "pink", fill: "black" },
      // Ear
      new Triangle(1 / 4, 1 / 4, edge(0, 3 / 4, h(1 / 4 / 2)), { start: 1, end: 3 }),
      // Eye
      new Circle(
        1 / 4, 1 / 4 * 2 / 3, body(1 / 4, 1 / 2), {},
        new Circle(1 / 2, w(1 / 2), body(1 / 2, 1 / 2), { fill: "pink" }),
      ),
      new Circle(
        1 / 4, 1 / 4 * 2 / 3, body(3 / 4, 1 / 2), {},
        new Circle(1 / 2, w(1 / 2), body(1 / 2, 1 / 2), { fill: "pink" }),
      ),
      // Mouth
      new Circle(
        1 / 8, 1 / 8, body(1 / 2, 5 / 6), { fill: "pink" },
        new Circle(1, 1, body(0, 0), { fill: "black", end: 1 / 2 }),
        new Circle(1, 1, body(1, 0), { fill: "black", end: 1 / 2 }),
      ),
    ),
  );

  p.setup = () => {
    p.createCanvas(640, 360);
  };

  p.draw = () => {
    p.background("black");
    p.noFill();
    // const t = (p.millis() / 1000) / 4 % 1;
    // model.links[128].links[0].at = edge(0, t, h(1 / 4 / 2));
    model.render(p);
  };
});
