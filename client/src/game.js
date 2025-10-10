/** Game UI logic. */

import { Content } from "#util";

/** Game UI. */
export class GameElement extends HTMLElement {
  #content = Content.render("#game-template");

  connectedCallback() {
    this.replaceChildren(...this.#content.nodes);
  }
}
customElements.define("textworld-game", GameElement);
