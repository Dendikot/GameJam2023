import * as Phaser from 'phaser';

import QixScene from "../scenes/qix-scene";
import {config, customConfig} from "./config";

export class Levels {
    coverageTarget = customConfig.startCoverageTarget;
    currentLevel = customConfig.startLevel;

    constructor(qix) {
        this.scene = qix;
    }

    nextLevel() {
        this.currentLevel++;
        customConfig.qixSpeed++;
        customConfig.qixTick--;

        this.scene.player.hasMoved = false;
        this.scene.sparkies.reset();
        this.scene.qixes.reset();
    }
}
