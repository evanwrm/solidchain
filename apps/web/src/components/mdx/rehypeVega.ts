import { toString } from "hast-util-to-string";
import { isServer } from "solid-js/web";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const getLanguage = (node: any) => {
    const className = node.properties.className;
    for (const classListItem of className) {
        if (classListItem.slice(0, 9) === "language-") {
            return classListItem.slice(9).toLowerCase();
        }
    }
    return null;
};

interface RehypeVegaOptions {}

const rehypeVega: Plugin = (_options?: RehypeVegaOptions) => {
    return tree => {
        visit(tree, "element", (node: any, index: any, parent: any) => {
            if (!parent || parent.tagName !== "pre" || node.tagName !== "code") {
                return;
            }
            if (isServer) return;

            // Coerce className to array
            if (node.properties.className) {
                if (typeof node.properties.className === "boolean") {
                    node.properties.className = [];
                } else if (!Array.isArray(node.properties.className)) {
                    node.properties.className = [node.properties.className];
                }
            } else {
                node.properties.className = [];
            }
            const lang = getLanguage(node);
            if (!["vega-lite", "vega"].includes(lang)) return;

            try {
                const spec = JSON.parse(toString(node));
                const vegaNode = {
                    type: "element",
                    tagName: "div",
                    properties: {
                        className: ["vega-container", "w-full", "h-full"],
                        "data-vega": JSON.stringify(spec)
                    }
                };

                parent.children.splice(index, 1, vegaNode);
            } catch (e) {
                console.error(e);
            }
        });
    };
};

export default rehypeVega;
