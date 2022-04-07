import { GAME_DATA } from 'src/controller/gameData';
import { css } from 'src/utils/css';
import { canvasCTX, defineElement, GuiElement } from 'src/utils/element';
import { createHexagonConstructor } from 'src/utils/hexagon';
import { useMemo } from 'src/utils/useMemo';
import { useThrottle } from 'src/utils/useThrottle';

export class GuiCanvas extends GuiElement {
  ctx: CanvasRenderingContext2D;
  $hexImageCTX: CanvasRenderingContext2D;
  $hexHoverImageCTX: CanvasRenderingContext2D;
  $hexCon: ReturnType<typeof createHexagonConstructor>;

  constructor() {
    super();
    this.$addCss(css`
      :host,
      canvas {
        position: absolute;
        top: 0;
        left: 0;
      }
      :host {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `);

    this.ctx = canvasCTX()!;
    this.append(this.ctx.canvas);

    this.$hexCon = createHexagonConstructor(GAME_DATA.HexRadius.Get());
    this.$hexImageCTX = canvasCTX()!;
    this.$hexHoverImageCTX = canvasCTX()!;

    GAME_DATA.HexRadius.Subscribe(hexRadius => {
      this.$hexCon = createHexagonConstructor(hexRadius);

      this.$hexImageCTX = canvasCTX()!;
      this.$hexImageCTX.lineWidth = 1;
      this.$hexCon.$drawHexagonPath(this.$hexImageCTX);
      this.$hexImageCTX.stroke();

      this.$hexHoverImageCTX = canvasCTX()!;
      this.$hexHoverImageCTX.lineWidth = 1;
      this.$hexCon.$drawHexagonPath(this.$hexHoverImageCTX);
      this.$hexHoverImageCTX.fillStyle = 'hsla(82, 93%, 23%, 0.25)';
      this.$hexHoverImageCTX.fill();
      GAME_DATA.GridSize.Broadcast();
    });

    GAME_DATA.GridSize.Subscribe(([sizeX, sizeY]) => {
      const { h, w } = this.$hexCon.$getGridSize(sizeX, sizeY, this.ctx.lineWidth);
      this.Resize(w, h);
    });

    const onChangeHoverPosition = useMemo<null | number>(
      (x, y) => {
        if (x !== null && y !== null) {
          this.Redraw();
          this.ctx.drawImage(this.$hexHoverImageCTX.canvas, x, y);
        }
      },
      [null, null]
    );
    const processMousePosition = useThrottle(40, (clientX: number, clientY: number) => {
      const [, , x, y] = this.$hexCon.$getGridColRow(clientX, clientY);
      onChangeHoverPosition(x, y);
    });

    window.addEventListener('mousemove', event => {
      const rect = this.ctx.canvas.getBoundingClientRect();
      const posX = event.clientX - rect.x;
      const posY = event.clientY - rect.y;
      processMousePosition(posX, posY);
    });
  }

  Resize = (width: number, height: number) => {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.Redraw();
  };

  Redraw = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    const [sizeX, sizeY] = GAME_DATA.GridSize.Get();
    this.$hexCon.$drawGrid(sizeX, sizeY, (x, y) => {
      this.ctx.drawImage(this.$hexImageCTX.canvas, x, y);
    });
  };
}

defineElement(GuiCanvas);
