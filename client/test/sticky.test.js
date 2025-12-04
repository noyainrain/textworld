import { expect } from "chai";
import { px } from "#sticky";

for (const unit of [px]) {
  describe(unit.name, function () {
    describe("px", function () {
      it("should convert to pixels", function () {
        const px = unit(7).px;
        expect(px).to.equal(7);
      });
    });
  });
}
