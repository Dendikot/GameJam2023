import * as Phaser from 'phaser';

import {ExtPoint} from "./ext-point";
import {ExtPolygon} from "./ext-polygon";
import QixScene from "../scenes/qix-scene";
import {Grid} from "./grid";
import {ExtRectangle} from "./ext-rectangle";

export class FilledPolygons {
    static LINE_COLOR = 0x0000;
    //static FILL_COLOR = 0xCCAAFF;
    static FILL_COLOR = 0xa83250;

    scene;
    polygons = [];
    graphics;

    constructor(scene) {
        this.scene = scene;
        
        this.graphics = scene.add.graphics();
        this.graphics.lineStyle(1, FilledPolygons.LINE_COLOR);
        this.graphics.fillStyle(FilledPolygons.FILL_COLOR);
    }

    grid() { return this.scene.grid; }
    frame() { return this.scene.grid.frame; }
    frameArea() { return this.scene.grid.frameArea; }

    percentArea() {
        return this.polygons.reduce((total, currentPolygon) => {
            return total + currentPolygon.percentArea;
        }, 0);
    }

    percentAreaString() {
        return this.percentArea().toFixed(1);
    }

    /**
     * Based on frame and existing polygon lines, need to fill out rest of the polygon points
     *
     */
    drawFilledPolygon(points) {
        let polygonPoints = points.map((p) => p.point);

        const polygon = new ExtPolygon(polygonPoints, this.frameArea());
        polygon.draw(this);
        this.polygons.push(polygon);
    }

    logPolygons() {
        console.table(
            this.polygons.map((polygon) => {
                let obj = {};
                obj.percentAreaString = `${polygon.percentAreaString}%`;
                polygon.polygon.points.forEach((point, index) => {
                    obj[`pt${index}`] = `${point.x},${point.y}`;
                });
                return obj;
            })
        );
    }

    pointOnLine(point) {
        for (let i = 0; i < this.polygons.length; i++) {
            if (this.polygons[i].outlineIntersects(point)) {
                return true;
            }
        }

        return false;
    }

    pointWithinPolygon(point) {
        for (let i = 0; i < this.polygons.length; i++) {
            if (this.polygons[i].innerIntersects(point)) {
                return true;
            }
        }

        return false;
    }

}