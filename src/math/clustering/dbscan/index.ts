import { ArrayQueue } from '../../../utils';
import { DistanceFunction } from '../../distance';
import { KDTreeSearch, Neighbor, NeighborSearch } from '../../neighbors';
import { Point } from '../../point';
import { ClusteringAlgorithm } from '../algorithm';
import { Cluster, MutableCluster } from '../cluster';

type Label = number;

const NOISE: Label = -1;
const MARKED: Label = -2;
const UNKNOWN: Label = -3;

/**
 * Density-based spatial clustering of applications with noise implementation.
 *
 * @param P The type of point.
 * @see [Wikipedia - DBSCAN](https://en.wikipedia.org/wiki/DBSCAN)
 */
export class DBSCAN<P extends Point> implements ClusteringAlgorithm<P> {
  /**
   * Create a new DBSCAN.
   *
   * @param minPoints The minimum size of cluster.
   * @param radius The neighbors radius.
   * @param distanceFunction The distance function.
   * @throws {RangeError} if the given minPoint is less than 1.
   * @throws {RangeError} if the given radius is less than 0.0.
   */
  constructor(
    private readonly minPoints: number,
    private readonly radius: number,
    private readonly distanceFunction: DistanceFunction,
  ) {
    if (minPoints < 1) {
      throw new RangeError(`The minimum size of cluster(${minPoints}) is not greater than or equal to 1`);
    }
    if (radius < 0.0) {
      throw new RangeError(`The radius(${radius}) is not greater than 0.0`);
    }
  }

  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    let label: Label = 0;
    const nns = KDTreeSearch.build(points, this.distanceFunction);
    const labels = new Array<Label>(points.length).fill(UNKNOWN);
    const clusters = new Map<Label, MutableCluster<P>>();
    points.forEach((point: P, index: number) => {
      // Skip visited point.
      if (labels[index] !== UNKNOWN) {
        return;
      }

      const neighbors = nns.searchRadius(point, this.radius);
      // Mark as noise point
      if (neighbors.length < this.minPoints) {
        labels[index] = NOISE;
        return;
      }

      labels[index] = label;

      const cluster = this.buildCluster(nns, neighbors, labels, label);
      cluster.add(point);
      clusters.set(label++, cluster);
    });
    return Array.from(clusters.values());
  }

  private buildCluster(
    nns: NeighborSearch<P>,
    neighbors: Neighbor<P>[],
    labels: Label[],
    label: Label,
  ): MutableCluster<P> {
    neighbors.forEach((neighbor: Neighbor<P>) => {
      const index = neighbor.index;
      if (labels[index] === UNKNOWN) {
        labels[index] = MARKED;
      }
    });

    const queue = new ArrayQueue(...neighbors);
    const points = new Set<P>();
    while (!queue.isEmpty) {
      const neighbor = queue.pop();
      if (!neighbor) {
        continue;
      }

      const index = neighbor.index;
      if (labels[index] > 0) {
        continue;
      }

      if (labels[index] === NOISE) {
        labels[index] = label;
        points.add(neighbor.point);
        continue;
      }

      labels[index] = label;
      points.add(neighbor.point);

      const secondaryNeighbors = nns.searchRadius(neighbor.point, this.radius);
      if (secondaryNeighbors.length < this.minPoints) {
        continue;
      }

      for (const secondaryNeighbor of secondaryNeighbors) {
        const secondaryIndex = secondaryNeighbor.index;
        const secondaryLabel = labels[secondaryIndex];
        if (secondaryLabel === UNKNOWN) {
          labels[secondaryIndex] = MARKED;
          queue.push(secondaryNeighbor);
        } else if (secondaryLabel === NOISE) {
          queue.push(secondaryNeighbor);
        }
      }
    }
    return new MutableCluster<P>(label, points);
  }
}
