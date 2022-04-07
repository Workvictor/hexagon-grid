import { GuiApp } from './components/GuiApp';
import { css, globalStyle } from './utils/css';

globalStyle(css`
  :root {
    --clr-gr0: hsl(0, 0%, 0%);
    --clr-gr2: hsl(0, 0%, 2%);
    --clr-gr4: hsl(0, 0%, 4%);
    --clr-gr8: hsl(0, 0%, 8%);
    --clr-gr12: hsl(0, 0%, 12%);
    --clr-gr16: hsl(0, 0%, 16%);
    --clr-gr24: hsl(0, 0%, 24%);
    --clr-gr32: hsl(0, 0%, 32%);
    --clr-gr40: hsl(0, 0%, 40%);
    --clr-gr54: hsl(0, 0%, 54%);
    --clr-gr72: hsl(0, 0%, 72%);
    --clr-bp: hsla(0, 0%, 2%, 0.75);
    --clr-bg: var(--clr-gr8);
    --clr-cmn-light: hsl(60, 29%, 84%);
    --clr-cmn: hsl(60, 17%, 75%);
    --clr-cmn-dark: hsl(60, 9%, 53%);
    --clr-prm-active: hsl(0 100% 38%);
    --clr-prm: hsl(0, 100%, 27%);
    --clr-prm-dark: hsl(0, 100%, 10%);
    --clr-sec: hsl(200, 80%, 35%);
    --clr-sec-dark: hsl(200, 45%, 30%);
    --clr-sec-metal: hsl(193, 39%, 12%);
    --clr-acnt: hsl(43, 74%, 49%);
    --clr-acnt-05: hsla(43, 74%, 49%, 0.5);
    --clr-highlighter: hsla(0, 0%, 72%, 0.3);
    --clr-dimmer: hsla(0, 0%, 0%, 0.75);
    --clr-success: hsl(118, 71%, 27%);

    --clr-attr-health: hsl(82, 93%, 23%);
    --clr-attr-health-glow: hsla(82, 93%, 23%, 0.7);
    --clr-attr-mana: hsl(218, 51%, 42%);
    --clr-attr-stamina: hsl(49, 41%, 60%);
    --clr-attr-exp: hsl(276, 56%, 39%);

    --clr-i-poor: hsl(0, 0%, 45%);
    --clr-i-common: hsl(0, 0%, 80%);
    --clr-i-uncommon: hsl(100, 80%, 40%);
    --clr-i-rare: hsl(225, 100%, 40%);
    --clr-i-epic: hsl(286, 100%, 40%);
    --clr-i-legendary: hsl(29, 100%, 40%);
    --clr-i-artifact: hsl(46, 100%, 40%);

    --radius: 4px;
    --radius-inner: 2px;

    --trn-xs: 25ms;
    --trn-sm: 75ms;
    --trn-md: 150ms;
    --trn-lg: 300ms;
    --trn-xl: 400ms;
    --trn-xxl: 800ms;
    --transition-faster: 75ms;
    --transition-fast: 150ms;
    --transition-slow: 300ms;
    --transition-slower: 400ms;

    --ftr-dark: brightness(90%);
    --ftr-norm: brightness(100%);
    --ftr-bright: brightness(110%);

    --box-border: 1px solid var(--clr-gr2);
    /* --box-shadow-carve: inset 0 -1px 1px var(--clr-gr32), inset 0 0 0 1px var(--clr-gr0),
				inset 0 0 4px 2px var(--clr-gr0); */
    --shadow-carve: inset 0 0 5px 2px var(--clr-gr0), inset 0 1px 0 var(--clr-gr4), 0 1px 1px var(--clr-gr16);
    --box-shadow-panel: 0 0 2px var(--clr-dimmer), 0 -1px 0px var(--clr-gr24), 0 1px 0px var(--clr-gr0),
      0 0 0 1px var(--clr-gr0);
    --box-shadow-elevated: 0 2px 6px 1px var(--clr-dimmer);
    --box-shadow-divider: inset 0 -2px 0 var(--clr-dimmer), 0 1px 0 var(--clr-highlighter);
    --box_hover_accent: inset 0 1px 6px -1px var(--clr-acnt), 0 0 5px var(--clr-acnt-05);
    --bsh-ov: inset 0 0 120px 50px var(--clr-gr0), inset 0 0 60px 10px var(--clr-gr0),
      inset 0 0 20px 10px var(--clr-gr0), inset 0 -1px 0 var(--clr-gr24), inset -1px 0px 0 var(--clr-gr4);

    --scroll-bar-width: 6px;
    --scroll-bar-radius: 2px;

    --max-ww: 1280px;
    --max-wh: 720px;

    --size-xs: 12px;
    --size-sm: 16px;
    --size-md: 24px;
    --size-lg: 32px;
    --size-xl: 64px;

    --clr-carve-bg: hsla(0, 0%, 2%, 0.4);
  }

	html {
		cursor: default;
		font-family: Arial;
		user-select: none;
	}

	body {
		background-color: var(--clr-gr8);
	}
`);

document.body.appendChild(new GuiApp());
