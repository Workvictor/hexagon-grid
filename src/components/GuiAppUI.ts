import { GAME_DATA } from 'src/controller/gameData';
import { css } from 'src/utils/css';
import { defineElement, div, GuiElement, inputRange, label, span } from 'src/utils/element';
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
        color: var(--clr-cmn-light);
      }
    `);

    const visibleStyle = this.$addCss(css`
      :host {
        display: block;
      }
    `);

    const sizeXInput = inputRange();
    const sizeYInput = inputRange();
    const sizeRInput = inputRange();
    sizeRInput.min = '8';
    sizeXInput.min = '4';
    sizeYInput.min = '4';
    sizeRInput.max = '64';
    sizeXInput.max = '96';
    sizeYInput.max = '96';
    sizeRInput.step = '8';
    sizeXInput.step = '2';
    sizeYInput.step = '2';
    const sizeRText = span(null, [sizeRInput.value]);
    const sizeXText = span(null, [sizeXInput.value]);
    const sizeYText = span(null, [sizeYInput.value]);
    const sizeRLabel = label(null, [GuiText(i => i['txt-4']), ': ', sizeRText, ' ', sizeRInput]);
    const sizeXLabel = label(null, [GuiText(i => i['txt-5']), ': ', sizeXText, ' ', sizeXInput]);
    const sizeYLabel = label(null, [GuiText(i => i['txt-6']), ': ', sizeYText, ' ', sizeYInput]);
    // const applyBtn = new GuiButton(GuiText(i => i['txt-3']));

    this.append(div(null, [div(null, [sizeRLabel]), div(null, [sizeXLabel]), div(null, [sizeYLabel])]));

    const processSizeChange = useThrottle(150, () => {
      GAME_DATA.GridSize.Set([parseInt(sizeXInput.value), parseInt(sizeYInput.value)]);
      sizeXText.innerText = sizeXInput.value.padStart(2, '0');
      sizeYText.innerText = sizeYInput.value.padStart(2, '0');
    });
    const processRangeChange = useThrottle(150, () => {
      GAME_DATA.HexRadius.Set(parseInt(sizeRInput.value));
			sizeRText.innerText = sizeRInput.value.padStart(2, '0');
    });

    sizeXInput.oninput = () => {
      processSizeChange();
    };
    sizeYInput.oninput = () => {
      processSizeChange();
    };
    sizeRInput.oninput = () => {
      processRangeChange();
    };

    GAME_DATA.UiIsVisible.Subscribe(uiIsVisible => {
      this.$setStyleActive(visibleStyle, uiIsVisible);
    });

    GAME_DATA.GridSize.Subscribe(([sizeX, sizeY]) => {
      if (sizeXInput.value !== String(sizeX) || sizeYInput.value !== String(sizeY)) {
        sizeXInput.value = String(sizeX);
        sizeYInput.value = String(sizeY);
				sizeXText.innerText = sizeXInput.value.padStart(2, '0');
				sizeYText.innerText = sizeYInput.value.padStart(2, '0');
      }
    });
    GAME_DATA.HexRadius.Subscribe(HexRadius => {
      if (sizeRInput.value !== String(HexRadius)) {
        sizeRInput.value = String(HexRadius);
        sizeRText.innerText = sizeRInput.value;
				sizeRText.innerText = sizeRInput.value.padStart(2, '0');
      }
    });
  }
}

defineElement(GuiAppUI);
