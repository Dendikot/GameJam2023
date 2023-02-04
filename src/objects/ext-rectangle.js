import * as Phaser from 'phaser';

const Rectangle = Phaser.Geom.Rectangle;
const Point = Phaser.Geom.Point;
const Line = Phaser.Geom.Line;
import { GeomUtils } from '../utils/geom-utils';

export class ExtRectangle {

    constructor(r) {
        this.rectangle = r;

        const lines = this.getLines();
        this.minX = Math.min(...lines.map(l => Math.min(l.x1, l.x2)));
        this.maxX = Math.max(...lines.map(l => Math.max(l.x1, l.x2)));
        this.minY = Math.min(...lines.map(l => Math.min(l.y1, l.y2)));
        this.maxY = Math.max(...lines.map(l => Math.max(l.y1, l.y2)));
    }

    x() { return this.rectangle.x; }
    y() { return this.rectangle.y; }
    width() { return this.rectangle.width; }
    height() { return this.rectangle.height; }

    pointOnTopSide(point) {
        return Phaser.Geom.Intersects.PointToLineSegment(point, this.rectangle.getLineA())
    }

    pointOnRightSide(point) {
        return Phaser.Geom.Intersects.PointToLineSegment(point, this.rectangle.getLineB())
    }

    pointOnBottomSide(point) {
        return Phaser.Geom.Intersects.PointToLineSegment(point, this.rectangle.getLineC())
    }

    pointOnLeftSide(point) {
        return Phaser.Geom.Intersects.PointToLineSegment(point, this.rectangle.getLineD())
    }

    pointOnOutline(point) {
        return this.pointOnTopSide(point) ||
            this.pointOnRightSide(point) ||
            this.pointOnBottomSide(point) ||
            this.pointOnLeftSide(point);
    }

    pointOutside(point) {
        return point.x < this.minX || point.x > this.maxX || point.y < this.minY || point.y > this.maxY;
    }

    getLines() {
        return [
            this.rectangle.getLineA(),
            this.rectangle.getLineB(),
            this.rectangle.getLineC(),
            this.rectangle.getLineD() ];
    }

    collisionWithLines(lines) {
        let collision = false;

        for (let line of lines) {
            collision = this.collisionWithLine(line);
            if (collision) break;
        }

        return collision;
    }

    collisionWithLine(line) {
        let collision = false;
        // let debug = `[${GeomUtils.lineToString(line)}] `;

        for (let l of this.getLines()) {
            // debug += `${GeomUtils.lineToString(l)} `;
            collision = GeomUtils.collisionLineSegments(l, line);
            if (collision) {
                // console.info(`collision! ${GeomUtils.lineToString(line)} collision with ${GeomUtils.lineToString(l)}`);
                break;
            }
        }

        return collision;
    }

    nonInteresectingLineOutside(line) {
        return this.pointOutside(new Point(line.x1, line.y1)) && this.pointOutside(new Point(line.x2, line.y2));
    }

}