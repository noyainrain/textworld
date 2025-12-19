import p5 from "p5";
import { Circle, h } from "#sticky";

new p5((p) => {
  const model = new Circle(h(1 / 2), 1 / 2);

  p.setup = () => {
    p.createCanvas(640, 360);
  };

  p.draw = () => {
    p.background("black");
    model.render(p);
  };
});
