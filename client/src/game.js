/** Game UI logic. */

import { makeStartPage } from "#start";
import { AssertionError, Content, Router } from "#util";

/** Game UI. */
export class GameElement extends HTMLElement {
  #content = Content.render("#game-template");
  #router = new Router([["^/$", makeStartPage]]);

  connectedCallback() {
    this.replaceChildren(...this.#content.nodes);

    (
      async () => {
        let page = await this.#router.route(location.pathname);
        if (!page) {
          const node = Content.render("#not-found-page-template").elements[0];
          if (!(node instanceof HTMLElement)) {
            throw new AssertionError();
          }
          page = node;
        }
        this.#content.update({ "page.children": page });
      }
    )();
  }
}
customElements.define("textworld-game", GameElement);
