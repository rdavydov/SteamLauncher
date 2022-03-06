type StoreWindowBoundsType = {
  height: number,
  width: number,
  x: number,
  y: number,
};

type StoreWindowType = {
  bounds: StoreWindowBoundsType,
  isFullScreen: boolean,
  isMaximized: boolean,
};
