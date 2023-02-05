import * as Phaser from 'phaser';

const Circle = Phaser.Geom.Circle;
const Point = Phaser.Geom.Point;

import {ExtPoint} from "./ext-point";
import {customConfig} from "./config";

export class Player {

    sprite;

    previousPoint;

    previousOnExisting;

    speed;

    hasMoved = false;

    constructor(scene, x, y, sprite) {

        this.speed = customConfig.playerSpeed;
        this.sprite = sprite;
        this.sprite.setDepth(2);
        console.log(this.sprite);
        /*this.graphics.lineStyle(1, customConfig.playerColor);
        this.graphics.fillStyle(customConfig.playerColor);
        this.graphics.x = x - customConfig.playerRadius;
        this.graphics.y = y - customConfig.playerRadius;
        this.graphics.fillCircleShape(new Circle(customConfig.playerRadius, customConfig.playerRadius, customConfig.playerRadius));*/

        this.previousPoint = this.point();
        this.previousOnExisting = true;
    }

    x() {
        return this.sprite.x + customConfig.playerRadius;
    }

    y() {
        return this.sprite.y + customConfig.playerRadius;
    }

    point() {
        return ExtPoint.createWithCoordinates(this.sprite.x + customConfig.playerRadius, this.sprite.y + customConfig.playerRadius);
    }

    move(cursors) {
        if (! this.previousPoint.equals(this.point())) {
            this.hasMoved = true;
        }
        
        this.previousPoint = this.point();

        const newPosition = this.getMove(cursors);
        this.sprite.x = newPosition.x;
        this.sprite.y = newPosition.y;
    }

    moving() {
        return this.movingLeft() || this.movingRight() || this.movingUp() || this.movingDown();
    }

    movingLeft() { return this.x() < this.previousPoint.x(); }
    movingRight() { return this.x() > this.previousPoint.x(); }
    movingUp() { return this.y() < this.previousPoint.y(); }
    movingDown() { return this.y() > this.previousPoint.y(); }
    movingHoriziontally() { return this.movingLeft() || this.movingRight(); }
    movingVertically() { return this.movingUp() || this.movingDown(); }

    getMove(cursors) {
        let x = this.sprite.x;
        let y = this.sprite.y;

        if (cursors.left.isDown) {
            x -= this.speed;
        } else if (cursors.right.isDown) {
            x += this.speed;
        } else if (cursors.up.isDown) {
            y -= this.speed;
        } else if (cursors.down.isDown) {
            y += this.speed;
        }

        return new Point(x, y);
    }

}
