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

  /**
   * Update the content.
   * @param {Object<string, unknown>} data - Data by part property path. A part property path is the
   * name of the part, followed by a dot, followed by the name of the property.
   * @returns {this}
   */
  update(data) {
    for (let [path, value] of Object.entries(data)) {
      // OQ do we want to allow "foo" and "foo."?
      const [name, property] = path.split(".", 2);
      const part = this.parts[name ?? ""];
      if (!part) {
        throw new Error("lol");
      }
      if (property === "children") {
        // @ts-ignore
        if (value?.[Symbol.iterator]) {
          // @ts-ignore
          part.replaceChildren(...value);
        } else {
          // @ts-ignore
          part.replaceChildren(value);
        }
      } else {
        // @ts-ignore
        part[property ?? ""] = value;
      }
    }
    return this;
  }
}
