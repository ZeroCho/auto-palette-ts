import { lab, parse, rgb } from '../../color';
import { MAX_A, MAX_B, MAX_L, MIN_A, MIN_B, MIN_L } from '../../color/space/lab';
import { Point5, SquaredEuclideanDistance } from '../../math';
import { ColorSpace, ImageObject, Lab, RGB, Swatch } from '../../types';
import { composite } from '../filter';
import { ColorFilter, Extractor } from '../types';

import { Cluster } from './cluster';
import { Kmeans } from './kmeans';

/**
 * Implementation of {@link Extractor} using Kmeans algorithm.
 */
export class KmeansExtractor implements Extractor {
  private readonly rgb: ColorSpace<RGB>;
  private readonly lab: ColorSpace<Lab>;
  private readonly kmeans: Kmeans<Point5>;
  private readonly filter: ColorFilter<RGB>;

  /**
   * Create a new {@link KmeansExtractor}.
   */
  constructor(maxIterations: number, minDifference: number, colorFilters: ColorFilter<RGB>[]) {
    this.rgb = rgb();
    this.lab = lab();
    this.kmeans = new Kmeans<Point5>('kmeans++', SquaredEuclideanDistance, maxIterations, minDifference);
    this.filter = composite(...colorFilters);
  }

  extract(imageData: ImageObject<Uint8ClampedArray>, maxColors: number): Swatch[] {
    const { data, width, height } = imageData;
    if (data.length === 0) {
      return [];
    }

    const pixels: Point5[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const color = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        opacity: data[i + 3] / 0xff,
      };

      // Exclude colors with high opacity
      if (!this.filter.test(color)) {
        continue;
      }

      const packed = this.rgb.encode(color);
      const { l, a, b } = this.lab.decode(packed);
      const x = Math.floor((i / 4) % width);
      const y = Math.floor((i / 4 / width) % height);

      // Normalize each value to a range of [0, 1].
      pixels.push([
        (l - MIN_L) / (MAX_L - MIN_L),
        (a - MIN_A) / (MAX_A - MIN_A),
        (b - MIN_B) / (MAX_B - MIN_B),
        x / width,
        y / height,
      ]);
    }

    const clusters = this.kmeans.classify(pixels, maxColors);
    return clusters.map((cluster: Cluster<Point5>): Swatch => {
      const pixel = cluster.getCentroid();
      const l = pixel[0] * (MAX_L - MIN_L) + MIN_L;
      const a = pixel[1] * (MAX_A - MIN_A) + MIN_A;
      const b = pixel[2] * (MAX_B - MIN_B) + MIN_B;
      const packed = this.lab.encode({ l, a, b, opacity: 1.0 });

      const x = pixel[3] * width;
      const y = pixel[4] * height;
      return {
        color: parse(packed),
        population: cluster.size,
        coordinate: { x, y },
      };
    });
  }
}
