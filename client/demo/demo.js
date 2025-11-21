import p5 from "p5";
import { Circle, px } from "#sticky";

new p5((p) => {
  // Cat TODO
  const model = new Circle(px(180), px(180), new Circle(px(90), px(90)));

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
