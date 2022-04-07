import { defineElement, GuiElement } from 'src/utils/element';
import { css } from 'src/utils/css';

export class GuiButton extends GuiElement {
  private $activeButtonStyleFilter = css`
    filter: var(--ftr-bright);
  `;

  constructor(...nodes: App.Children) {
    super(...nodes);
    this.$addCss(css`
      :host {
        display: inline-block;
        text-align: center;
        color: inherit;
        font-size: inherit;
        outline: none;
        line-height: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: var(--clr-prm);
        color: var(--clr-acnt);
        border: none;
        height: auto;
        padding: 4px 8px;
        border-radius: var(--radius);
        filter: var(--ftr-norm);
        transform: translateY(-2px);
        will-change: contents;
        transition: var(--trn-xs);
        box-shadow: 0 2px 0 var(--clr-prm-dark), 0 3px 0 var(--clr-gr0), 0 2px 0 1px var(--clr-gr0),
          inset 0 1px 2px 1px var(--clr-highlighter), inset 0 0 8px 0 var(--clr-gr0);
      }

      :host(:hover) {
        ${this.$activeButtonStyleFilter}
        background-color: var(--clr-prm-active);
      }

      :host(:active) {
        transform: translateY(0px);
        ${this.$activeButtonStyleFilter}
      }
    `);
  }
}

defineElement(GuiButton);
