// @ts-nocheck
import p5 from "p5";
import { Circle, px } from "#sticky";

new p5((p) => {
  const model = new Circle(px(180), px(180));

  p.setup = () => {
    p.createCanvas(640, 360);
  };

  p.draw = () => {
    p.background("black");
    p.noFill();
    p.stroke("white");
    model.render(p);
  };
});
