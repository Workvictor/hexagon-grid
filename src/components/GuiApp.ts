import { GAME_DATA } from 'src/controller/gameData';
import { css } from 'src/utils/css';
import { defineElement, GuiElement } from 'src/utils/element';
import { GuiAppUI } from './GuiAppUI';
import { GuiCanvas } from './GuiCanvas';

export class GuiApp extends GuiElement {
  constructor() {
    super();
    this.$addCss(css`
      :host {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
    `);
    this.append(new GuiCanvas(), new GuiAppUI());
    GAME_DATA.SystemDebugState.Set(true);
  }
}

defineElement(GuiApp);
