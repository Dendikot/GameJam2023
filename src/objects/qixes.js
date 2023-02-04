import * as Phaser from 'phaser';

import {customConfig} from "./config";
import {Player} from "./player";
import {Qix} from "./qix";

export class Qixes {
    qixes = [];
    scene;
    startingNumQixes = customConfig.startNumQixes;
    qixStartupTimeSeconds = customConfig.qixStartupTimesSeconds;
    START_TIME_UNDEFINED = 0;
    startTime = this.START_TIME_UNDEFINED;

    constructor(scene) {
        this.scene = scene;

    }

    update() {
        // if (! this.scene.player.hasMoved) {
        //     return;
        // }

        const nextStartupTimeMilliseconds = this.qixStartupTimeSeconds[this.qixes.length] * 1000;
        this.startTime = (this.startTime === this.START_TIME_UNDEFINED) ? this.scene.time.now : this.startTime;
        const timeSinceStart = this.scene.time.now - this.startTime;

        if (timeSinceStart > nextStartupTimeMilliseconds) {
            this.qixes.push(new Qix(this.scene, 200, 200));
        }

        this.qixes.forEach((qix) => {
            qix.update();
        });
    }

    checkForCollisionWithCurrentLines() {
        for (let qix of this.qixes) {
            if (qix.checkForCollisionWithCurrentLines()) {
                return true;
            }
        }

        return false;
    }

    reset() {
        this.qixes.forEach((qix) => {
            qix.destroy();
        });
        this.qixes = [];
        this.startTime = this.START_TIME_UNDEFINED;
    }

}
