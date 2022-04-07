export const createHexagonConstructor = (radius: number) => {
  const sideCount = 6;
  const angle = (2 * Math.PI) / sideCount;
  const angleOffset = Math.PI / 2;
  const height = 2 * radius;
  const width = radius * Math.sqrt(3);
  const w_1_2 = width / 2;
  const h_1_4 = height / 4;
  const h_3_4 = h_1_4 * 3;

  return {
    $radius: radius,
    $sideCount: sideCount,
    $angle: angle,
    $angleOffset: angleOffset,
    $height: height,
    $width: width,
    $w_1_2: w_1_2,
    $h_1_4: h_1_4,
    $h_3_4: h_3_4,
    $getGridSize: (cols: number, rows: number, lineWidth: number) => {
      return {
        w: cols * width + w_1_2 + lineWidth * 2,
        h: rows * h_3_4 + h_1_4 + lineWidth * 2,
      };
    },
    $getOffsetX: (row: number) => (row % 2) * w_1_2,
    $drawHexagonPath: (ctx: CanvasRenderingContext2D) => {
      const [x, y] = [Math.floor(width / 2) + ctx.lineWidth, Math.floor(height / 2)];
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
