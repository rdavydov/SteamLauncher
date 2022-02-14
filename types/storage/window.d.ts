type StoreWindowBoundsType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type StoreWindowType = {
  bounds: StoreWindowBoundsType;
  isMaximized: boolean;
  isFullScreen: boolean;
};
