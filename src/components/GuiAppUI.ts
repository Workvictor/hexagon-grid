import { GAME_DATA } from 'src/controller/gameData';
import { css } from 'src/utils/css';
import { defineElement, div, GuiElement, input, inputRange } from 'src/utils/element';
import { useThrottle } from 'src/utils/useThrottle';
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

    const sizeXInput = inputRange();
    const sizeYInput = inputRange();
    const sizeRangeInput = inputRange();
		sizeRangeInput.min = '8';
		sizeRangeInput.max = '64';
		sizeRangeInput.step = '8';
    const applyBtn = new GuiButton(GuiText(i => i['txt-3']));

    this.append(applyBtn, div(null, [div(null, [sizeRangeInput]), div(null, [sizeXInput]), div(null, [sizeYInput])]));

    const processSizeChange = useThrottle(150, () => {
      GAME_DATA.GridSize.Set([parseInt(sizeXInput.value), parseInt(sizeYInput.value)]);
    });
    const processRangeChange = useThrottle(150, () => {
      GAME_DATA.HexRadius.Set(parseInt(sizeRangeInput.value));
    });

    sizeXInput.oninput = () => {
      processSizeChange();
    };
    sizeYInput.oninput = () => {
      processSizeChange();
    };
    sizeRangeInput.oninput = () => {
      processRangeChange();
    };

    GAME_DATA.UiIsVisible.Subscribe(uiIsVisible => {
      this.$setStyleActive(visibleStyle, uiIsVisible);
    });

    GAME_DATA.GridSize.Subscribe(([sizeX, sizeY]) => {
      if (sizeXInput.value !== String(sizeX) || sizeYInput.value !== String(sizeY)) {
        sizeXInput.value = String(sizeX);
        sizeYInput.value = String(sizeY);
      }
    });
    GAME_DATA.HexRadius.Subscribe(HexRadius => {
      if (sizeRangeInput.value !== String(HexRadius)) {
        sizeRangeInput.value = String(HexRadius);
      }
    });
  }
}

defineElement(GuiAppUI);
