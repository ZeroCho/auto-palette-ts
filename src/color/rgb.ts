import { clamp } from '../math';

import { asPackedColor, Model, Opacity, PackedColor } from './model';

/**
 * The type representing a color in RGB.
 */
export type RGBColor = {
  /**
   * The red value.
   */
  readonly r: number;
  /**
   * The green value.
   */
  readonly g: number;
  /**
   * The blue value.
   */
  readonly b: number;
} & Opacity;

const MIN_RGB = 0x00;
const MAX_RGB = 0xff;

const SHIFT_A = 24;
const SHIFT_R = 16;
const SHIFT_G = 8;
const SHIFT_B = 0;

/**
 * The RGB color model implementation.
 */
export const RGB: Model<RGBColor> = {
  decode(value: PackedColor): RGBColor {
    const a = (value >> SHIFT_A) & MAX_RGB;
    const r = (value >> SHIFT_R) & MAX_RGB;
    const g = (value >> SHIFT_G) & MAX_RGB;
    const b = (value >> SHIFT_B) & MAX_RGB;
    const opacity = a / MAX_RGB;
    return { r, g, b, opacity };
  },
  encode(color: RGBColor): PackedColor {
    const r = clamp(color.r, MIN_RGB, MAX_RGB);
    const g = clamp(color.g, MIN_RGB, MAX_RGB);
    const b = clamp(color.b, MIN_RGB, MAX_RGB);

    const opacity = clamp(color.opacity, 0.0, 1.0);
    const a = Math.round(opacity * MAX_RGB);

    // Force conversion to uint32.
    const packed = ((a << SHIFT_A) | (r << SHIFT_R) | (g << SHIFT_G) | (b << SHIFT_B)) >>> 0;
    return asPackedColor(packed);
  },
} as const;
