import { describe, expect, it } from 'vitest';

import { euclidean } from '../distance';
import { Point2 } from '../point';

import { FarthestPointSampling } from './fps';

describe('FarthestPointSampling', () => {
  describe('constructor', () => {
    it('should create a new instance', () => {
      // Act
      const actual = new FarthestPointSampling<Point2>(euclidean);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('sample', () => {
    it('should return n data points', () => {
      // Act
      const sampling = new FarthestPointSampling<Point2>(euclidean);
      const actual = sampling.sample(
        [
          [0.0, 0.0],
          [1.0, 0.0],
          [0.0, 1.0],
          [1.0, 1.0],
        ],
        2,
      );

      // Assert
      expect(actual).toHaveLength(2);
      expect(actual).toContainAllValues([
        [0.0, 0.0],
        [1.0, 1.0],
      ]);
    });

    it('should return all data points when n is greater than or equal to the number of data points', () => {
      // Act
      const sampling = new FarthestPointSampling<Point2>(euclidean);
      const actual = sampling.sample(
        [
          [0.0, 0.0],
          [1.0, 0.0],
          [0.0, 1.0],
          [1.0, 1.0],
        ],
        4,
      );

      // Assert
      expect(actual).toHaveLength(4);
      expect(actual).toContainAllValues([
        [0.0, 0.0],
        [1.0, 0.0],
        [0.0, 1.0],
        [1.0, 1.0],
      ]);
    });

    it('should throw a RangeError when n is less than or equal to 0', () => {
      // Arrange
      const sampling = new FarthestPointSampling<Point2>(euclidean);

      // Assert
      expect(() => {
        // Act
        sampling.sample(
          [
            [0.0, 0.0],
            [1.0, 0.0],
            [0.0, 1.0],
            [1.0, 1.0],
          ],
          0,
        );
      }).toThrowError(RangeError);
    });
  });
});
