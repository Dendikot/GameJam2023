import QixScene from "../scenes/qix-scene";

export const baseGameValues = {

gameWidth : 800,
gameHeight : 500,
infoHeight : 30,
debugTextAreaHeight : 0,
margin : 10
};

export const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: baseGameValues.gameWidth,
    height: baseGameValues.gameHeight,
    resolution: 1,
    backgroundColor: "#555",
    scene: [
        QixScene
    ],
    banner: false
};

export const customConfig = {
    debug: false,
    margin: baseGameValues.margin,
    frameHeight: baseGameValues.gameHeight - baseGameValues.infoHeight - (3 * baseGameValues.margin),
    infoHeight: baseGameValues.infoHeight,
    debugTextAreaHeight: baseGameValues.debugTextAreaHeight,
    lineColor: 0x000,
    fillColor: 0xCCAAFF,
    playerRadius: 5,
    playerColor: 0xAA88EE,
    playerSpeed: 5,
    startCoverageTarget: 60,
    startLevel: 1,
    startNumQixes: 1,
    qixStartupTimesSeconds: [1, 200, 500],
    qixTick: 8,
    qixSpeed: 15,
    levelWinPauseMs: 4000,
    targetsAmount: 4
};