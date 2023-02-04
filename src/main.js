import 'phaser';

import QixScene from "./scenes/qix-scene";

const gameWidth = 800;
const gameHeight = 500;
const infoHeight = 30;
const debugTextAreaHeight = 0;
const margin = 10;

export const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: gameWidth,
    height: gameHeight,
    resolution: 1,
    backgroundColor: "#555",
    scene: [
        QixScene
    ],
    banner: false
};

export const customConfig = {
    debug: false,
    margin: margin,
    frameHeight: gameHeight - infoHeight - (3 * margin),
    infoHeight: infoHeight,
    debugTextAreaHeight: debugTextAreaHeight,
    lineColor: 0x000,
    fillColor: 0xCCAAFF,
    playerRadius: 5,
    playerColor: 0xAA88EE,
    playerSpeed: 5,
    sparkyColor: 0x8B0000,
    sparkySpeed: 5,
    sparkyTick: 2,
    startCoverageTarget: 60,
    startLevel: 1,
    startNumSparkies: 1,
    sparkyStartupTimesSeconds: [ 3, 10, 30, 60, 200 ],
    startNumQixes: 1,
    qixStartupTimesSeconds: [1, 200, 500],
    qixTick: 8,
    qixSpeed: 15,
    levelWinPauseMs: 4000
};

export const game = new Phaser.Game(config);

