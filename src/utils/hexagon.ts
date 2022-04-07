export const createHexagonConstructor = (radius: number) => {
  const sideCount = 6;
  const angle = (2 * Math.PI) / sideCount;
  const angleOffset = Math.PI / 2;

  let height = 0;
  let width = 0;
  let w_1_2 = 0;
  let h_1_4 = 0;
  let h_3_4 = 0;

  const update = () => {
    height = 2 * radius;
    width = Math.ceil(radius * Math.sqrt(3));
    w_1_2 = width / 2;
    h_1_4 = height / 4;
    h_3_4 = h_1_4 * 3;
  };

  update();

  return {
    get $height() {
      return height;
    },
    get $width() {
      return width;
    },
    $setRadius: (nextRadius: number) => {
      radius = nextRadius;
      update();
    },
    $getGridSize: (cols: number, rows: number) => {
      const mx = cols * width;
      const my = rows * h_3_4;
      return {
        w: mx + w_1_2,
        h: my + h_1_4,
        mx: mx,
        my: my,
      };
    },
    $getOffsetX: (row: number) => (row % 2) * w_1_2,
    $drawHexagonPath: (ctx: CanvasRenderingContext2D, offset = 0) => {
      const [x, y] = [Math.floor(width / 2) + offset, Math.floor(height / 2)];
      ctx.beginPath();
      for (let i = 0; i < sideCount; i++) {
        const nextAngle = angle * i + angleOffset;
        const lineX = x + radius * Math.cos(nextAngle);
        const lineY = y + radius * Math.sin(nextAngle);
        ctx.lineTo(lineX, lineY);
      }
      ctx.closePath();
    },
    $drawGrid: (cols: number, rows: number, drawFunction: (x: number, y: number) => void) => {
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const y = h_3_4 * row;
          const xOffset = (row % 2) * w_1_2;
          let x = xOffset + width * col;
          drawFunction(x, y);
        }
      }
    },
    $getGridColRow: (x: number, y: number) => {
      let row = Math.floor(y / h_3_4);
      const colOffsetToggler = () => row % 2;
      const getOffsetX = () => -(w_1_2 * colOffsetToggler());
      let offset = getOffsetX();
      const getCol = () => Math.floor((x + offset) / width);
      let col = getCol();
      const relY = y - row * h_3_4;
      const relX = x - col * width + offset;
      const diagonal = (h_1_4 / w_1_2) * relX - h_1_4;

      if (Math.abs(relY) < Math.abs(diagonal)) {
        row--;
        offset = getOffsetX();
        col += (0 - colOffsetToggler()) * Math.sign(relY - diagonal);
      }

      return [col, row, getCol() * width - offset, row * h_3_4];
    },
  };
};
