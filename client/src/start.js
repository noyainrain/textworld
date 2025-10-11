/** Start logic. */

import { Content } from "#util";

/** Start page. */
class StartPage extends HTMLElement {
  #content = Content.render("#start-page-template");

  connectedCallback() {
    this.replaceChildren(...this.#content.nodes);
    document.title = "Text World";
  }
}
customElements.define("textworld-start-page", StartPage);

/** Create the start page. */
export function makeStartPage() {
  return document.createElement("textworld-start-page");
}

// cool, but make gets passed string args, is rather in router domain -> other solution better :)
// class StartPage extends HTMLElement {
//   static make() {
//     // TODO why createElement over new?
//     return document.createElement("start-page");
//   }
// }
