import p5 from "p5";
import { Circle, body, px } from "#sticky";

const PALETTE = {
  black: "#000",
  blue: "#00a",
  green: "#0a0",
  cyan: "#0aa",
  red: "#a00",
  magenta: "#a0a",
  brown: "#a50",
  lightGray: "#aaa",
  darkGray: "#555",
  lightBlue: "#55f",
  lightGreen: "#5f5",
  lightCyan: "#5ff",
  lightRed: "#f55",
  lightMagenta: "#f5f",
  yellow: "#ff5",
  white: "#fff",
};
const palette = Object.values(PALETTE);

new p5((p) => {
  const target = 1000 / 60;
  // const size = 360 / 8;
  const size = px(360 / 8);
  // const model = new Circle(640, 360);
  const model = new Circle(px(640), px(360));
  /** @type {number[]} */
  const times = [];
  /** @type {number[]} */
  const shapes = [];
  const avgFrames = 60;

  p.setup = () => {
    p.createCanvas(640, 360);
  };

  p.draw = () => {
    const t = p.millis();
    p.fill("black");
    p.stroke("white");
    model.render(p);
    const time = p.millis() - t;

    if (times.length >= avgFrames) {
      times.shift();
      shapes.shift();
    }
    times.push(time);
    shapes.push(model.links.length);
    // const medianTime = [...times].sort((a, b) => a - b)[Math.trunc(times.length / 2)] ?? 0;
    const medianTime = times.reduce((acc, value) => acc + value) / times.length;
    const medianN = shapes.reduce((acc, value) => acc + value) / shapes.length;
    // console.log(times);
    // console.log(target, medianTime, medianN);

    const estimate = Math.max(Math.trunc((target / medianTime) * medianN), 1);

    p.fill("red");
    p.stroke("black");
    p.textSize(16);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(`${medianN.toFixed()} in ${medianTime.toFixed(1)}ms / ${p.frameRate().toFixed()}fps`, p.width, 0);
    // console.log(performance.now());

    // if (Math.abs(n - estimate) / n >= 0.1) {
    // if (Math.abs(medianTime - target) / target >= 0.1) {
    const diff = estimate - model.links.length;
    // console.log(diff);
    if (diff < 0) {
      for (let i = 0; i < -diff; i++) {
        model.links.pop();
        // model.links.shift();
      }
    } else {
      for (let i = 0; i < diff; i++) {
        const color = Math.trunc(p.random(0, 8));
        const shape = new Circle(
          size, size, body(p.random(), p.random()),
          {
            stroke: palette[color],
            fill: palette[color + 8],
          },
        );
        model.links.push(shape);
        // model.links.unshift(shape)
        shape.base = model;
      }
    }
    // if (diff < 0) {
    //   model.links.splice(model.links.length + diff, -diff);
    // } else {
    //   const rects = [...Array(diff)].map(() => {
    //     const rect = new Rectangle(size, size, body(p.random(), p.random()));
    //     rect.base = model;
    //     return rect;
    //   })
    //   model.links.push(...rects);
    // }
    //   model = new Rectangle(
    //     p.width, p.height, body(0.5, 0.5), {fill: "black", stroke: "white"},
    //     ...[...Array(n)]
    //       .map(() => new Rectangle(size, size, body(p.random(), p.random())))
    //   );
    // }
  };
});
