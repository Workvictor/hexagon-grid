import { Observer } from 'src/utils/observer';

export const GAME_DATA = {
  SystemAppVersion: '',
  SystemAppName: '',
  SystemDebugState: new Observer(false),
  SystemAppReadyState: false,
  SystemVolumeUi: 0.2,
  SystemVolumeMusic: 0.1,
  SystemVolumeSFX: 0.4,
  SystemFullscreen: false,

  UiIsVisible: new Observer(true),
  HexRadius: new Observer(32),
  GridSize: new Observer([10, 10]),
};
