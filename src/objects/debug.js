import * as Phaser from 'phaser';

import QixScene from "../scenes/qix-scene";
import {config, customConfig} from "./config"
import {ExtPoint} from "./ext-point";
import * as $ from "jquery";
import {ExtRectangle} from "./ext-rectangle";

export class Debug {

    scene;

    debugTextArea$;

    graphics1Y = 3 * customConfig.margin + customConfig.frameHeight + customConfig.infoHeight;
    graphics2Y = 4 * customConfig.margin + 2 * customConfig.frameHeight + customConfig.infoHeight;

    frame1;
    frame2;

    graphics1;
    graphics2;

    constructor(scene) {
        this.scene = scene;

        this.debugTextArea$ = $('#debugTextArea');

        if (customConfig.debug) {
            this.debugTextArea$.width(`${config.width}px`).height(`${customConfig.debugTextAreaHeight}px`);
            this.debugTextArea$.css('font-family', '"Lucida Console", Monaco, monospace');

            this.frame1 = this.createGraphics(this.graphics1Y, true);
            this.graphics1 = this.createGraphics();

            this.frame2 = this.createGraphics(this.graphics2Y, false);
            this.graphics2 = this.createGraphics();
        } else {
            this.debugTextArea$.hide();
        }
    }

    createGraphics(y = 0, withRect = false) {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(1, customConfig.lineColor);
        graphics.fillStyle(customConfig.fillColor);

        if (withRect) {
            const rect = new ExtRectangle(new Rectangle(
                customConfig.margin,
                y,
                config.width - 2 * customConfig.margin,
                customConfig.frameHeight));

            graphics.strokeRectShape(rect.rectangle);
        }

        return graphics;
    }

    highlightPoints(points, radius = 3, fill = true, buffer = 500, destroyTime = 1200, color = 0x33AA55) {
        if (! customConfig.debug) return;

        const drawPointFunc = ((index) => {
            const point = points[parseInt(index)];
            const g = this.scene.add.graphics();
            g.lineStyle(1, color);
            g.fillStyle(color);
            if (fill) {
                g.fillCircle(point.x(), point.y(), radius);
            } else {
                g.strokeCircle(point.x(), point.y(), radius);
            }
            setTimeout(() => { g.destroy(); }, destroyTime);
        });

        for (let i in points) {
            const time = buffer * Number(i);
            setTimeout(() => {
                drawPointFunc(i);
            }, time);
        }
    }

    drawLines(graphics, lines, clearFirst = true) {
        if (! customConfig.debug) return;

        if (clearFirst) {
            graphics.clear();
        }

        lines.forEach((line) => { graphics.strokeLineShape(line); });
    }

    drawPoints1(points, clearFirst = true) {
        if (! customConfig.debug) return;
        this.drawPoints(this.graphics1, points, this.graphics1Y, clearFirst);
    }

    drawPoints2(points, clearFirst = true) {
        if (! customConfig.debug) return;
        this.drawPoints(this.graphics2, points, this.graphics2Y, clearFirst);
    }

    drawPoints(graphics, points, y, clearFirst = true) {
        if (! customConfig.debug) return;
        if (clearFirst) {
            graphics.clear();
        }

        let pts = [];
        points.forEach((point) => {
            let pt = new Point(point.x(), point.y() + y - customConfig.margin);
            pts.push(pt);
        });

        graphics.strokePoints(pts, true);
    }

    infoPoints(text, points) {
        if (! customConfig.debug) return;
        this.table(text, points.map((pt) => pt.point));
    }

    infoLines(text, lines) {
        if (! customConfig.debug) return;
        this.table(text, lines);
    }

    info(text) {
        if (! customConfig.debug) return;
        this.debugTextArea$.html(this.debugTextArea$.html() + text + '\n');
        this.infoScroll();
    }

    table(title, objects) {
        if (! customConfig.debug) return;
        const indent = '> ';

        this.info(title);

        if (objects.length === 0) {
            return;
        }

        const keys = Object.getOwnPropertyNames(objects[0]);

        let header = `${indent}idx `;

        let colWidths = [];
        for (let ki = 0; ki < keys.length; ki++) { colWidths.push(0); }
        for (let oi = 0; oi < objects.length; oi++) {
            const object = objects[oi];
            for (let ki = 0; ki < keys.length; ki++) {
                const key = keys[ki];
                const length  = object[key].toString().length + 1;
                colWidths[ki] = (colWidths[ki] > length) ? colWidths[ki] : length;
            }
        }

        for (let ki = 0; ki < keys.length; ki++) {
            header += this.pad(keys[ki], colWidths[ki]);
        }
        this.info(header);

        for (let oi = 0; oi < objects.length; oi++) {
            const object = objects[oi];
            let line = indent + this.pad(oi.toString(), 4);

            for (let ki = 0; ki < keys.length; ki++) {
                const key = keys[ki];
                line += this.pad(object[key].toString(), colWidths[ki]);
            }

            this.info(line);
        }
    }

    infoScroll() {
        if (! customConfig.debug) return;
        this.debugTextArea$.scrollTop((this.debugTextArea$[0].scrollHeight - this.debugTextArea$.height()));
    }

    pad(str, length, padChar = ' ') {
        return (str + Array(length).join(padChar)).substring(0, length);
    }
}