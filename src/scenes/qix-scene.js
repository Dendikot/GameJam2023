import * as Phaser from 'phaser';
import spidy from "../assets/spidy.png"

import {Player} from "../objects/player";
import {Grid} from "../objects/grid";
import {Info} from "../objects/info";
import {Debug} from "../objects/debug";
import {config, customConfig} from "../objects/config";
import {Levels} from "../objects/levels";
import { targetsManager } from '../objects/targetsManager';


class QixScene extends Phaser.Scene {
    player;
    playerSprite;
    grid;
    info;
    cursors;
    debug;
    pauseControl;
    levels = new Levels(this);
    targetsManager;

    constructor() {
        super({
            key: 'Qix'
        });
    }

    preload() {
        this.load.image('player', spidy);
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.targetsManager = new targetsManager(this);
        this.grid = new Grid(this, this.targetsManager);
        this.playerSprite = this.add.sprite(0,50, 'player');
        this.playerSprite.setScale(0.2, 0.2);
        this.player = new Player(this, customConfig.margin, customConfig.margin, this.playerSprite);
        
        this.info = new Info(this);
        this.debug = new Debug(this);

        this.pauseControl = new PauseControl();
        
        this.targetsManager.spawnTargets();

        // this.player = this.add.sprite(100, 100, 'player');
        // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // this.cameras.main.startFollow(this.player, false);
    }

    update(time) {
        if (this.pauseControl.isPaused(time)) {
            return;
        }

        if (this.grid.isIllegalMove(this.player, this.cursors)) {
            return;
        }

        this.player.move(this.cursors);
        this.grid.update(this.player);
        this.info.updateGameText();

        if (this.checkForWin()) {
            this.passLevel(time);
        }

        if (this.checkForLoss()) {
            this.loseLife(time);
        }
    }

    checkForLoss() {
        //return this.sparkies.checkForCollisionWithPlayer() || this.qixes.checkForCollisionWithCurrentLines();
        return false;
    }

    loseLife(time) {
        this.pauseControl.pauseForWin(time);
        this.cameras.main.shake(300, .005);
        this.pauseControl.pauseForWin(time);
        this.cameras.main.shake(300, .005);
        let winText = this.createWinText(`Ouch!!!.`, "#333333");

        const _this = this;
        setTimeout(function () {
            winText.destroy();
            _this.scene.restart({});
        }, customConfig.levelWinPauseMs / 2);
    }

    checkForWin() {
        return (this.grid.filledPolygons.percentArea() >= this.levels.coverageTarget);
    }

    options = { fontFamily: 'Courier', fontSize: '30px', color: '#bb33bb', align: 'center',
        radiusX: '10px', radiusY: '10px',
        padding: { x: 10, y: 10 }
    };

    passLevel(time) {
        this.pauseControl.pauseForWin(time);
        this.cameras.main.shake(300, .005);
        let winText = this.createWinText(`Sweet!!\nLevel ${this.levels.currentLevel} passed.`, "#333333");

        const _this = this;
        setTimeout(function () {
            winText.destroy();
            _this.levels.nextLevel();
            winText = _this.createWinText(`On to level ${_this.levels.currentLevel}`, "#333333");

            setTimeout(function () {
                _this.scene.restart({});
            }, customConfig.levelWinPauseMs / 2);
        }, customConfig.levelWinPauseMs / 2);
    }

    createWinText(message, color) {
        const x = ((config.width) / 3);
        const y = ((customConfig.frameHeight) / 2) - 35;
        let winText = this.add.text(x, y, message, this.options);
        winText.setShadow(3, 3, color, 2, true, true);
        return winText;
    }
}

class PauseControl {
    paused = false;
    winTime;

    constructor() {
    }

    isPaused(time) {
        return this.paused;
    }

    pauseForWin(time) {
        this.paused = true;
        this.winTime = time;
    }

    pause() {
        this.paused = true;
    }

    unpause() {
        this.paused = false;
    }

    togglePause() {
        this.paused = ! this.paused;
    }

}

export default QixScene;