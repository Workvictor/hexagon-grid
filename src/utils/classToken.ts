import { css, defineStyle } from './css';

const rowGapConstructor = (gap: number) => css`
  row-gap: ${gap}px;
`;
const colGapConstructor = (gap: number) => css`
  column-gap: ${gap}px;
`;

const carveStyle = defineStyle(css`
  border-radius: var(--radius-inner);
  box-shadow: var(--shadow-carve);
  padding: 1px 2px;
  background-color: var(--clr-carve-bg);
  border: none;
`);

// defineStyle(
//   css`
//     width: 100%;
//   `,
//   `${carveStyle.cn} button`
// );

export const classNameToken = {
  PositionRelative: defineStyle(css`
    position: relative;
  `),

  PositionAbsolute: defineStyle(css`
    position: absolute;
  `),

  PositionFixed: defineStyle(css`
    position: fixed;
  `),

  WidthAuto: defineStyle(css`
    width: auto;
  `),

  Width100PC: defineStyle(css`
    width: 100%;
  `),

  PlaceCenter: defineStyle(css`
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `),

  DisplayGrid: defineStyle(css`
    display: grid;
  `),

  DisplayFlex: defineStyle(css`
    display: flex;
  `),

  RowGap: {
    4: defineStyle(rowGapConstructor(4)),
  },

  ColGap: {
    4: defineStyle(colGapConstructor(4)),
  },

  IconBtn: defineStyle(css`
    display: grid;
    place-items: center;
    justify-content: center;
    padding: 2px 2px;
  `),

  Panel: defineStyle(css`
    --panel-shadow: inset 0px 1px 2px var(--clr-gr32), inset 0px -1px 0px var(--clr-gr4);
    background-color: var(--clr-gr12);
    padding: 2px;
    border: 1px solid var(--clr-gr0);
    border-radius: var(--radius);
    box-shadow: var(--panel-shadow);
    grid-template-rows: auto auto 1fr auto auto;
  `),

  PanelFooter: defineStyle(),

  Carve: carveStyle,

  BgColor: {
    Backdrop: defineStyle(css`
      background-color: var(--clr-bp);
    `),
  },

  CarveBtnWrap: defineStyle(css`
    border-radius: 6px;
    padding-top: 2px;
    padding-bottom: 2px;
  `),

  HiddenElement: defineStyle(css`
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    /* z-index: -1; */
  `),
};
