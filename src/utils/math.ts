export const clamp = (min: number, max: number, delta: number) => Math.min(max, Math.max(min, delta));
export const random = (min = 0, max = 100) => Math.floor(clamp(min, max, min + Math.random() * max));
export const percent = (value: number, max: number = 100, min: number = 0) => value / (max - min);
export const floorPrecise = (value: number, precise: number = 100) => Math.floor(value * precise) / precise;
export const floorPreciseX1 = (value: number) => floorPrecise(value, 1);
