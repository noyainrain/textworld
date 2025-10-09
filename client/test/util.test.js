import { expect } from "chai";
import { Content, Router } from "#util";

describe("Content", function () {
  beforeEach(function () {
    document.body.innerHTML = `
      <template id="cat-template">
        <h1 data-part="name"></h1>
        <p>Meow!</p>
        <ul data-part="food"></ul>
        <p data-part="more-food"></p>
      </template>
    `;
  });

  describe("render", function () {
    it("should render a template", function () {
      const content = Content.render("#cat-template");
      // expect(content.nodes.map(node => node.nodeName)).to.deep.equal(
      //   ["#text", "H1", "#text", "P", "#text", "UL", "#text", "P", "#text"],
      // );
      expect(content.elements.map(element => element.tagName))
        .to.deep.equal(["H1", "P", "UL", "P"]);
      expect(Object.entries(content.parts).map(([name, part]) => [name, part.tagName]))
        .to.deep.equal([["name", "H1"], ["food", "UL"], ["more-food", "P"]]);
    });
  });

  describe("update", function () {
    it("should update the content", function () {
      const content = Content.render("#cat-template");
      content.update({
        "name.textContent": "Frank",
        "food.children": ["a", "b"],
        "more-food.children": "x",
      });
      expect(content.parts.name?.textContent).to.equal("Frank");
      expect(content.parts.food?.textContent).to.equal("ab");
      expect(content.parts["more-food"]?.textContent).to.equal("x");
    });
  });
});

describe("Router", function () {
  const router = new Router([["^/cats/([^/]+)$", (...args) => args], ["^/cats/", () => null]]);

  describe("route", function () {
    it("should query a path", async function () {
      const args = await router.route("/cats/frank");
      expect(args).to.deep.equal(["frank"]);
    });

    it("should not query an unknown path", async function () {
      const result = await router.route("/foo");
      expect(result).to.be.undefined;
    });
  });
});
