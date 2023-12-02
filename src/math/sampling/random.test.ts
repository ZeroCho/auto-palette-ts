import { describe, expect, it } from 'vitest';

import { Point2 } from '../point';

import { RandomSampling } from './random';

const points: Point2[] = [
  [0.0, 0.0],
  [1.0, 0.0],
  [0.0, 1.0],
  [1.0, 1.0],
  [2.0, 2.0],
];

describe('RandomSampling', () => {
  describe('constructor', () => {
    it('should create a new instance', () => {
      // Act
      const actual = new RandomSampling();

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('sample', () => {
    it('should return n data points', () => {
      // Act
      const sampling = new RandomSampling<Point2>();
      const actual = sampling.sample(points, 3);

      // Assert
      expect(actual.length).toEqual(3);
      expect(actual).toContainAnyValues(points);
    });

    it('should return all data points when n is greater than or equal to the number of data points', () => {
      // Act
      const sampling = new RandomSampling<Point2>();
      const actual = sampling.sample(points, 5);

      // Assert
      expect(actual.length).toEqual(5);
      expect(actual).toContainAllValues(points);
    });

    it('should throw a RangeError when n is less than or equal to 0', () => {
      // Arrange
      const sampling = new RandomSampling<Point2>();

      // Assert
      expect(() => {
        // Act
        sampling.sample(points, 0);
      }).toThrowError(RangeError);
    });
  });
});
