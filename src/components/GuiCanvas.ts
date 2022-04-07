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
      const { h, w } = hexCon.$getGridSize(sizeX, sizeY);
      gridLayer.canvas.width = w + 2 * gridLayer.lineWidth;
      gridLayer.canvas.height = h + 2 * gridLayer.lineWidth;
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
			
      hexTile.canvas.width = hexCon.$width + lineWidth;
      hexTile.canvas.height = hexCon.$height + lineWidth;
      hexHover.canvas.width = hexCon.$width;
      hexHover.canvas.height = hexCon.$height;
			
      hexCon.$drawHexagonPath(hexTile, lineWidth);
      hexCon.$drawHexagonPath(hexHover);

      hexTile.lineWidth = lineWidth;
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
          const [sx, sy] = GAME_DATA.GridSize.Get();
          const { mx, my } = hexCon.$getGridSize(sx, sy);
          if (x < 0 || x >= mx || y < 0 || y >= my) return;
          hoverLayer.drawImage(hexHover.canvas, x, y - lineWidth);
        }
      },
      [null, null]
    );
    const processMousePosition = useThrottle(40, (clientX: number, clientY: number) => {
      const rect = hoverLayer.canvas.getBoundingClientRect();
      const posX = clientX - rect.x;
      const posY = clientY - rect.y;
      const [, , x, y] = hexCon.$getGridColRow(posX, posY);
      onChangeHoverPosition(x, y);
    });

    window.addEventListener('mousemove', event => {
      processMousePosition(event.clientX, event.clientY);
    });
  }
}

defineElement(GuiCanvas);
