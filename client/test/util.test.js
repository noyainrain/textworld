import { expect } from "chai";
import { Content } from "#util";

describe("Content", function () {
  beforeEach(function () {
    document.body.innerHTML = `
      <template id="cat-template">
        <h1 data-part="name"></h1>
        <p>Meow!</p>
      </template>
    `;
  });

  describe("render", function () {
    it("should render a template", function () {
      const content = Content.render("#cat-template");
      // expect(content.nodes.map(node => node.nodeName)).to.deep.equal(
      //   ["#text", "H1", "#text", "P", "#text"],
      // );
      expect(content.elements.map(element => element.tagName)).to.deep.equal(["H1", "P"]);
      expect(Object.entries(content.parts).map(([name, part]) => [name, part.tagName]))
        .to.deep.equal([["name", "H1"]]);
    });
  });

  describe("update", function () {
    it("should update the content", function () {
      const content = Content.render("#cat-template");
      content.update({ "name.textContent": "Frank" });
      expect(content.parts.name?.textContent).to.equal("Frank");
    });
  });
});
