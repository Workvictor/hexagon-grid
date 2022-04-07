import { GAME_DATA } from 'src/controller/gameData';
import { css } from 'src/utils/css';
import { canvas, defineElement, GuiElement } from 'src/utils/element';

const createHexagonTemplateImage = (options: { $hexRadius: number; $lineWidth: number }) => {
  const hexHeight = options.$hexRadius * 2;
  const hexSideCount = 6;
  const angleOffset = Math.PI / 2;
  const hexSideAngle = (2 * Math.PI) / hexSideCount;
  const $canvas = canvas();
  $canvas.width = Math.floor(hexHeight * Math.sin(Math.PI / 3)) + options.$lineWidth * 2;
  $canvas.height = Math.floor(hexHeight);
  const ctx = $canvas.getContext('2d')!;
  if (ctx) {
    ctx.lineWidth = options.$lineWidth;
    const [x, y] = [Math.floor($canvas.width / 2) + options.$lineWidth, Math.floor($canvas.height / 2)];
    ctx.beginPath();
    for (let i = 0; i < hexSideCount; i++) {
      const nextAngle = hexSideAngle * i + angleOffset;
      const lineX = x + options.$hexRadius * Math.cos(nextAngle);
      const lineY = y + options.$hexRadius * Math.sin(nextAngle);
      ctx.lineTo(lineX, lineY);
    }
    ctx.closePath();
  }

  return ctx;
};

const drawGrid = (
  cols: number,
  rows: number,
  ctx: CanvasRenderingContext2D,
  hexImage: HTMLCanvasElement,
  $hexRadius: number
) => {
  const gridHeightTotal = 2 * $hexRadius;
  const gridWidth = $hexRadius * Math.sqrt(3);
  const halfWidth = gridWidth / 2;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const isOdd = row % 2 !== 0;
      const y = ((gridHeightTotal * 3) / 4) * row;
      const xOffset = isOdd ? halfWidth : 0;
      let x = xOffset + gridWidth * col;
      ctx.drawImage(hexImage, x, y);
    }
  }
};

const getGridColRow = (x: number, y: number, gridRadius: number) => {
  const gridHeightTotal = 2 * gridRadius;
  const gridHeightThreeQuarter = (3 / 4) * gridHeightTotal;
  const gridWidth = gridRadius * Math.sqrt(3);
  const halfWidth = gridWidth / 2;

  const c = gridHeightTotal / 4;
  const m = c / halfWidth;
  let row = Math.floor(y / gridHeightThreeQuarter);
  let rowIsOdd = row % 2 == 1;
  let offset = rowIsOdd ? -halfWidth : 0;
  let col = Math.floor((x + offset) / gridWidth);
  let relY = y - row * gridHeightThreeQuarter;
  let relX = x - col * gridWidth + offset;

  // Work out if the point is above either of the hexagon's top edges
  if (relY < -m * relX + c) {
    // LEFT edge
    row--;
    rowIsOdd = row % 2 == 1;
    offset = rowIsOdd ? -halfWidth : 0;
    if (!rowIsOdd) {
      col--;
    }
  } else if (relY < m * relX - c) {
    // RIGHT edge
    row--;
    rowIsOdd = row % 2 == 1;
    offset = rowIsOdd ? -halfWidth : 0;
    if (rowIsOdd) {
      col++;
    }
  }

  return [
    col,
    row,
    Math.floor((x + offset) / gridWidth) * gridWidth - offset,
    Math.floor(row * gridHeightThreeQuarter),
  ];
};

export class GuiCanvas extends GuiElement {
  ctx: CanvasRenderingContext2D;
  $canvas = canvas();
  $hexImageCTX = createHexagonTemplateImage({
    $hexRadius: GAME_DATA.HexRadius.Get(),
    $lineWidth: 1,
  });
  $hexHoverImageCTX = createHexagonTemplateImage({
    $hexRadius: GAME_DATA.HexRadius.Get(),
    $lineWidth: 1,
  });

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

    this.append(this.$canvas);

    this.ctx = this.$canvas.getContext('2d')!;

    this.$hexImageCTX.stroke();

    this.$hexHoverImageCTX.fillStyle = 'hsla(82, 93%, 23%, 0.25)';
    this.$hexHoverImageCTX.fill();

    GAME_DATA.GuiCanvasSize.Subscribe(([width, height]) => {
      this.Resize(width, height);
      this.Redraw();
    });

    GAME_DATA.GuiCanvasSize.Set([window.innerWidth, window.innerHeight]);

    window.addEventListener('mousemove', event => {
      this.Redraw();

      const radius = GAME_DATA.HexRadius.Get();
      const [, , x, y] = getGridColRow(event.clientX, event.clientY, radius);

      this.ctx.drawImage(this.$hexHoverImageCTX.canvas, x, y);
    });
  }

  Resize = (width: number, height: number) => {
    this.$canvas.width = width;
    this.$canvas.height = height;
    this.ctx = this.$canvas.getContext('2d')!;
  };

  Redraw = () => {
    this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
    const [sizeX, sizeY] = GAME_DATA.GridSize.Get();
    drawGrid(sizeX, sizeY, this.ctx, this.$hexImageCTX.canvas, GAME_DATA.HexRadius.Get());
  };
}

defineElement(GuiCanvas);
