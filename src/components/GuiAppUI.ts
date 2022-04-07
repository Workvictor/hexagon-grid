import { GAME_DATA } from 'src/controller/gameData';
import { css } from 'src/utils/css';
import { defineElement, GuiElement } from 'src/utils/element';
import { GuiButton } from './GuiButton';
import { GuiText } from './GuiText';

export class GuiAppUI extends GuiElement {
  constructor() {
    super();
    this.$addCss(css`
      :host {
        position: fixed;
        padding: 8px;
        display: none;
      }
    `);

    const visibleStyle = this.$addCss(css`
      :host {
        display: block;
      }
    `);

    // this.append(new GuiButton(GuiText(i => i['txt-3'])));

    GAME_DATA.UiIsVisible.Subscribe(uiIsVisible => {
      this.$setStyleActive(visibleStyle, uiIsVisible);
    });
  }
}

defineElement(GuiAppUI);
