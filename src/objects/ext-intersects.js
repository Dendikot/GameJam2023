import * as Phaser from 'phaser'

import { ExtPoint } from './ext-point';
import { ExtPolygon } from './ext-polygon';

export class ExtIntersects {
    static PointToPolygon(p, poly) {
        return true;
    }
}