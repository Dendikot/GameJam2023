import QixScene from "../scenes/qix-scene";

export const baseGameValues = {

gameWidth : 800,
gameHeight : 500,
infoHeight : 30,
debugTextAreaHeight : 0,
margin : 10
};

export const config = {
    type: Phaser.CANVAS,
    parent: 'content',
    width: baseGameValues.gameWidth,
    height: baseGameValues.gameHeight,
    resolution: 1,
    backgroundColor: "#555",
    scene: [
        QixScene
    ],
    banner: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
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
    levelWinPauseMs: 4000,
    targetsAmount: 4,
    scabAmount: 3,
    scabReachTolerance: 4,
    scabSpeed: 200,
};