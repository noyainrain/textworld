/** Various utilities. */

/** Dynamic template content. */
export class Content {
  /**
   * Template nodes.
   * @type {Node[]}
   */
  nodes;

  /**
   * Dynamic template parts.
   * @type {Object<string, Element>}
   */
  parts;

  /** TODO */
  get elements() {
    return this.nodes.filter(node => node instanceof Element);
  }

  /**
   * @param {Node[]} nodes
   * @param {Object<string, Element>} parts
   */
  constructor(nodes, parts) {
    this.nodes = nodes;
    this.parts = parts;
  }

  /**
   * Render a template.
   * @param {string} template - Relevant template selector
   * @returns {Content}
   */
  static render(template) {
    const element = document.querySelector(template);
    if (!(element instanceof HTMLTemplateElement)) {
      throw new TypeError(`Bad template type ${element?.tagName}`);
    }

    const fragment = document.importNode(element.content, true);
    const parts = Object.fromEntries(
      Array.from(fragment.querySelectorAll("[data-part]"))
        // OQ SVG and Math?
        .filter(part => part instanceof HTMLElement)
        .map(part => [part.dataset.part ?? "", part]),
    );

    return new Content(Array.from(fragment.childNodes), parts);
  }
}
