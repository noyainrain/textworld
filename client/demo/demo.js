// @ts-nocheck
import p5 from "p5";

new p5((p) => {
  p.setup = () => {
    p.createCanvas(640, 360);
  };

  p.draw = () => {
    p.background("black");
  };
});
