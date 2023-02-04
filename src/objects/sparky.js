import * as Phaser from 'phaser';

import {ExtPoint} from "./ext-point";
import {Direction} from "./direction";

export class Sparky {

    scene;

    graphics;

    speed;

    pointSize = 3;

    pointRange = 7;

    x;

    y;

    direction;

    tick;

    tickCount = 0;

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.speed = 5;
        this.tick = 2;

        this.redraw();
    }

    update() {
        this.redraw();
    }

    destroy() {
        this.graphics.destroy();
    }

    redraw() {
        if ((this.tickCount + 1) < this.tick) {
            this.tickCount++;
            return;
        }

        this.move();

        this.tickCount = 0;

        if (this.graphics) {
            this.graphics.destroy();
        }

        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(2, 0x8B0000);
        this.graphics.fillStyle(0x8B0000);
        this.draw();
    }

    move() {
        let directions = this.getFilteredPossibleDirections();

        let randomIndex = Math.floor(Math.random() * directions.size);
        let randomDirection = directions.getArray()[randomIndex];

        this.moveWithDirection(randomDirection);
        this.direction = randomDirection;
    }

    getPoint() {
        return new Point(this.x, this.y);
    }

    getExtPoint() {
        return new ExtPoint(this.getPoint());
    }

    getUpPoint() { return new Point(this.x, this.y - this.speed); }
    getDownPoint() { return new Point(this.x, this.y + this.speed); }
    getLeftPoint() { return new Point(this.x - this.speed, this.y); }
    getRightPoint() { return new Point(this.x + this.speed, this.y); }

    moveUp() { this.y -= this.speed; }
    moveDown() { this.y += this.speed; }
    moveLeft() { this.x -= this.speed; }
    moveRight() { this.x += this.speed; }

    moveWithDirection(direction) {
        switch (direction) {
            case Direction.UP: this.moveUp(); break;
            case Direction.DOWN: this.moveDown(); break;
            case Direction.LEFT: this.moveLeft(); break;
            case Direction.RIGHT: this.moveRight(); break;
        }
    }

    /**
     * Return any perpendicular (as compared to current direction) directions found in the passed in set of directions
     */
    perpendicularDirections(directions) {
        let perpendicularDirections = new Set();

        if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
            if (directions.contains(Direction.LEFT)) perpendicularDirections.set(Direction.LEFT);
            if (directions.contains(Direction.RIGHT)) perpendicularDirections.set(Direction.RIGHT);
        } else {
            if (directions.contains(Direction.UP)) perpendicularDirections.set(Direction.UP);
            if (directions.contains(Direction.DOWN)) perpendicularDirections.set(Direction.DOWN);
        }

        return perpendicularDirections;
    }

    /**
     * Get a filtered set of possible directions based on current direction already moving and whether a junction is hit
     */
    getFilteredPossibleDirections() {
        let directions = this.getPossibleDirections();

        if (directions.contains(this.direction)) {
            directions = this.perpendicularDirections(directions);
            directions.set(this.direction);
        }

        return directions;
    }

    getPossibleDirections() {
        let directions = new Set();

        //
        // Determine possible directions on frame
        //
        const frame = this.scene.grid.frame;
        const onFrame = frame.pointOnOutline(this.getPoint());

        if (onFrame) {
            if (frame.pointOnOutline(this.getUpPoint())) directions.set(Direction.UP);
            if (frame.pointOnOutline(this.getDownPoint())) directions.set(Direction.DOWN);
            if (frame.pointOnOutline(this.getLeftPoint())) directions.set(Direction.LEFT);
            if (frame.pointOnOutline(this.getRightPoint())) directions.set(Direction.RIGHT);
        }

        const filledPolygons = this.scene.grid.filledPolygons;
        const onFilledPolygon = filledPolygons.pointOnLine(this.getExtPoint());

        const addDirectionsFromLines = ((dirs, lines) => {
            lines.forEach((line) => {
                if (Phaser.Geom.Intersects.PointToLineSegment(this.getUpPoint(), line)) dirs.set(Direction.UP);
                if (Phaser.Geom.Intersects.PointToLineSegment(this.getDownPoint(), line)) dirs.set(Direction.DOWN);
                if (Phaser.Geom.Intersects.PointToLineSegment(this.getLeftPoint(), line)) dirs.set(Direction.LEFT);
                if (Phaser.Geom.Intersects.PointToLineSegment(this.getRightPoint(), line)) dirs.set(Direction.RIGHT);
            });
        });

        //
        // Determine possible directions on a filled polygon
        //
        if (onFilledPolygon) {
            let lines = [];

            filledPolygons.polygons.forEach((polygon) => {
                lines.push(...polygon.lines);
            });

            addDirectionsFromLines(directions, lines);
        }

        //
        // Determine possible directions on current lines
        //
        const currentLines = this.scene.grid.currentLines;
        addDirectionsFromLines(directions, currentLines.lines);

        return directions;
    }

    rand() {
        let rand = Math.floor(Math.random() * Math.floor(this.pointRange));

        if (Math.random() < .5) {
            return -rand
        } else {
            return rand;
        }
    }

    draw() {
        const numPoints = 5;

        for (let i = 0; i < numPoints; i++) {
            this.graphics.fillPoint(this.x + this.rand(), this.y + this.rand(), this.pointSize);
        }
    }
}
