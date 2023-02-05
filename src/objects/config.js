import QixScene from "../scenes/qix-scene";

export const baseGameValues = {

gameWidth : 900,
gameHeight : 675,
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
            gravity: { y: 0 },
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
    playerSpeed: 3,
    startCoverageTarget: 60,
    startLevel: 1,
    levelWinPauseMs: 4000,
    workersAmount: 20,
    scabAmount: 5,
    scabReachTolerance: 6,
    scabSpeed: 250,
    winAmount: 15,
    collectedAmount: 0
};