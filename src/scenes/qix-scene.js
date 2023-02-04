import * as Phaser from 'phaser';

//assets
import player from "../assets/player.png"
import worker from "../assets/worker.png"
import scab from "../assets/scab.png"

//classes
import {Player} from "../objects/player";
import {Grid} from "../objects/grid";
import {Info} from "../objects/info";
import {Debug} from "../objects/debug";
import {config, customConfig} from "../objects/config";
import {Levels} from "../objects/levels";
import { workersManager } from '../objects/workersManager';


class QixScene extends Phaser.Scene {
    player;
    playerSprite;
    grid;
    info;
    cursors;
    debug;
    pauseControl;
    levels = new Levels(this);
    workersManager;

    constructor() {
        super({
            key: 'Qix'
        });
    }

    preload() {
        this.load.image('player', player);
        this.load.image('worker', worker);
        this.load.image('scab', scab);
        
    }

    create() {
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.workersManager = new workersManager(this);
        this.grid = new Grid(this, this.workersManager);
        this.playerSprite = this.add.sprite(5,50, 'player');
        this.player = new Player(this, customConfig.margin, customConfig.margin, this.playerSprite);
        
        this.info = new Info(this);
        this.debug = new Debug(this);

        this.pauseControl = new PauseControl();
        console.log(this.physics);
        

        this.test = this.physics.add.image(100,300, 'scab');
        this.testPos = new Phaser.Math.Vector2();
        this.testPos.x = this.player.x();
        this.testPos.y = this.player.y();

        this.physics.moveToObject(this.test, this.testPos, 200);
        
        
        this.workersManager.spawnWorkers();
        // this.player = this.add.sprite(100, 100, 'player');
        // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // this.cameras.main.startFollow(this.player, false);
    }

    update(time) {
        const distance = Phaser.Math.Distance.BetweenPoints(this.testPos, this.test);
        if(distance < 4) {
            this.test.body.reset(this.testPos.x, this.testPos.y);
        }

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