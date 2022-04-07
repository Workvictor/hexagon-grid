import { GAME_DATA } from 'src/controller/gameData';
import { css } from 'src/utils/css';
import { canvasCTX, defineElement, GuiElement } from 'src/utils/element';
import { createHexagonConstructor } from 'src/utils/hexagon';
import { useMemo } from 'src/utils/useMemo';
import { useThrottle } from 'src/utils/useThrottle';

export class GuiCanvas extends GuiElement {
  constructor() {
    super();
    this.$addCss(css`
      :host,
      ::slotted(canvas) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `);

    let hexTile = canvasCTX()!;
    let hexHover = canvasCTX()!;

    const lineWidth = 1;
    const hexCon = createHexagonConstructor(GAME_DATA.HexRadius.Get());
    const gridLayer = canvasCTX()!;
    const hoverLayer = canvasCTX()!;
    this.append(gridLayer.canvas, hoverLayer.canvas);

    const rebuildGrid = (sizeX: number, sizeY: number) => {
      const { h, w } = hexCon.$getGridSize(sizeX, sizeY, gridLayer.lineWidth);
      gridLayer.canvas.width = w;
      gridLayer.canvas.height = h;
      gridLayer.clearRect(0, 0, gridLayer.canvas.width, gridLayer.canvas.height);
      hexCon.$drawGrid(sizeX, sizeY, (x, y) => {
        gridLayer.drawImage(hexTile.canvas, x, y);
      });

      hoverLayer.canvas.width = w;
      hoverLayer.canvas.height = h;
      hoverLayer.clearRect(0, 0, hoverLayer.canvas.width, hoverLayer.canvas.height);
    };

    GAME_DATA.HexRadius.Subscribe(hexRadius => {
      hexCon.$setRadius(hexRadius);

      hexTile.canvas.width = hexHover.canvas.width = hexCon.$width + lineWidth;
      hexTile.canvas.height = hexHover.canvas.height = hexCon.$height + lineWidth;
      hexTile.lineWidth = hexHover.lineWidth = lineWidth;
      hexCon.$drawHexagonPath(hexTile);
      hexCon.$drawHexagonPath(hexHover);
      hexTile.stroke();
      hexHover.fillStyle = 'hsla(82, 93%, 23%, 0.25)';
      hexHover.fill();

      GAME_DATA.GridSize.Broadcast();
    });

    GAME_DATA.GridSize.Subscribe(([sizeX, sizeY]) => {
      rebuildGrid(sizeX, sizeY);
    });

    const onChangeHoverPosition = useMemo<null | number>(
      (x, y) => {
        if (x !== null && y !== null) {
          hoverLayer.clearRect(0, 0, hoverLayer.canvas.width, hoverLayer.canvas.height);
          hoverLayer.drawImage(hexHover.canvas, x, y);
        }
      },
      [null, null]
    );
    const processMousePosition = useThrottle(40, (clientX: number, clientY: number) => {
      const [, , x, y] = hexCon.$getGridColRow(clientX, clientY);
      onChangeHoverPosition(x, y);
    });

    window.addEventListener('mousemove', event => {
      const rect = hoverLayer.canvas.getBoundingClientRect();
      const posX = event.clientX - rect.x;
      const posY = event.clientY - rect.y;
      processMousePosition(posX, posY);
    });
  }
}

defineElement(GuiCanvas);
