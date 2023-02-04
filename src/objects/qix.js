import * as Phaser from 'phaser';

const Point = Phaser.Geom.Point;
const Line = Phaser.Geom.Line;

import {ExtPoint} from "./ext-point";
import {customConfig} from "./config";
import {GeomUtils} from "../utils/geom-utils";

export class Qix {

    scene;

    speed;
    tick;
    tickCount = 0;

    static NUM_LINES_MAX = 6;
    static LINE_LENGTH_MIN = 20;
    static LINE_LENGTH_MAX = 60;
    static MIN_CHANGE_DEG = 0;
    static MAX_CHANGE_DEG = 360;

    lineDegreesIncrement = 4;

    x;

    y;

    linesGraphics = [];
    lines = [];

    // Current direction of Qix
    directionDegrees = 0;

    // Current line being drawn for the Qix
    currentLineLength = 100;
    currentLineDegrees = 0;
    rotationalPointDistance = 50;

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.speed = customConfig.qixSpeed;
        this.tick = customConfig.qixTick;

        this.draw();
    }

    update() {
        this.moveAndDraw();
    }

    destroy() {
        this.linesGraphics.forEach((lineGraphic) => {
            lineGraphic.destroy();
        });
    }

    moveAndDraw() {
        if ((this.tickCount + 1) < this.tick) {
            this.tickCount++;
            return;
        }

        this.tickCount = 0;

        this.move();
        this.draw();
    }

    draw() {
        const line = this.createNextLine();
        const lineGraphics = this.createNextLineGraphics(line);

        if (this.lines.length === Qix.NUM_LINES_MAX) {
            this.lines.splice(0, 1);
            this.linesGraphics[0].destroy();
            this.linesGraphics.splice(0, 1);
        }

        this.lines.push(line);
        this.linesGraphics.push(lineGraphics);
    }

    getRandomDegrees(degrees) {
        let randomDegrees = Math.random() * (Qix.MAX_CHANGE_DEG - Qix.MIN_CHANGE_DEG) + Qix.MIN_CHANGE_DEG + degrees;
        randomDegrees = randomDegrees % 360;
        return randomDegrees;
    }

    move() {
        let collision = false;
        let count = 0;
        let firstCollisionProcessed = false;
        let secondCollisionProcessed = false;
        let originalLineDegrees = this.currentLineDegrees;

        do {
            count++;

            if (count > 360) {
                console.info('Houston we have a problem - not sure how to make the qix move again...');
                this.scene.pauseControl.pause();
                break;
            }

            const nextPoint = GeomUtils.calculatePointFromOrigin(this.getPoint(), this.directionDegrees, this.speed);
            const nextLine = this.getNextLine(nextPoint, this.currentLineDegrees, this.rotationalPointDistance, this.currentLineLength);

            collision = this.scene.grid.frame.collisionWithLine(nextLine) || this.scene.grid.frame.nonInteresectingLineOutside(nextLine) ||
                this.scene.grid.filledPolygons.pointWithinPolygon(new ExtPoint(new Point(nextLine.x1, nextLine.y1))) ||
                this.scene.grid.filledPolygons.pointWithinPolygon(new ExtPoint(new Point(nextLine.x2, nextLine.y2)));

            if (collision) {
                if (secondCollisionProcessed) {
                    this.directionDegrees += 1;
                    this.directionDegrees = this.directionDegrees % 360;
                } else if (firstCollisionProcessed && ! secondCollisionProcessed) {
                    this.directionDegrees = (originalLineDegrees + Qix.MIN_CHANGE_DEG) % 360;
                    secondCollisionProcessed = true;
                } else {
                    this.directionDegrees = this.getRandomDegrees(this.directionDegrees);
                }

                if (! firstCollisionProcessed) {
                    this.currentLineDegrees -= (this.lineDegreesIncrement * 2);
                    this.lineDegreesIncrement = -this.lineDegreesIncrement;
                    firstCollisionProcessed = true;
                }
            }
        } while (collision);

        const newPoint = GeomUtils.calculatePointFromOrigin(this.getPoint(), this.directionDegrees, this.speed);

        this.x = newPoint.x;
        this.y = newPoint.y;
    }

    getPoint() {
        return new Point(this.x, this.y);
    }

    getExtPoint() {
        return new ExtPoint(this.getPoint());
    }

    checkForCollisionWithCurrentLines() {
        return GeomUtils.collisionLineSegmentArrays(this.lines, this.scene.grid.currentLines.lines) ||
            (this.scene.grid.currentLines.line != null && GeomUtils.collisionLineSegmentArrays(this.lines, [ this.scene.grid.currentLines.line ]));
    }

    createNextLineGraphics(line) {
        const lineGraphics = this.scene.add.graphics();
        lineGraphics.lineStyle(1, customConfig.sparkyColor);
        lineGraphics.fillStyle(customConfig.sparkyColor);
        lineGraphics.strokeLineShape(line);
        return lineGraphics;
    }

    createNextLine() {
        const line = this.getNextLine(this.getPoint(), this.currentLineDegrees, this.rotationalPointDistance, this.currentLineLength);
        this.currentLineDegrees = (this.currentLineDegrees + this.lineDegreesIncrement) % 360;
        return line;
    }

    getNextLine(point, lineDegrees, rotationalPointDistance, length) {
        const tailPoint = GeomUtils.calculatePointFromOrigin(point, 180 + lineDegrees, rotationalPointDistance);
        const headPoint = GeomUtils.calculatePointFromOrigin(point, lineDegrees, length - rotationalPointDistance);

        return new Line(tailPoint.x, tailPoint.y, headPoint.x, headPoint.y);
    }

}
