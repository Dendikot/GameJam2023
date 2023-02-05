import * as Phaser from 'phaser';

//assets
import player from "../assets/player.png"
import worker from "../assets/worker.png"
import scab from "../assets/scab.png"
import workerUnited from '../assets/worker-united.png';

import mainMusic from "../assets/sounds/music.mp3"
import deathMusic from "../assets/sounds/game-over.mp3"
import winMusic from "../assets/sounds/game-won.mp3"
import workerUnitedMusic from "../assets/sounds/worker-united.mp3"


//classes
import {Player} from "../objects/player";
import {Grid} from "../objects/grid";
import {Info} from "../objects/info";
import {Debug} from "../objects/debug";
import {config, customConfig} from "../objects/config";
import {Levels} from "../objects/levels";
import { workersManager } from '../objects/workersManager';
import { scabManager } from '../objects/scabManager';

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
    scabManager;
    gameMusic = [];

    static Music = null;

    constructor() {
        super({
            key: 'Qix'
        });
    }

    preload() {
        this.load.image('player', player);
        this.load.image('worker', worker);
        this.load.image('scab', scab);
        this.load.image('workerUnited', workerUnited)

        this.load.audio('mainMusic', mainMusic);
        this.load.audio('deathMusic', deathMusic);
        this.load.audio('winMusic', winMusic);
        this.load.audio('workerUnited', workerUnitedMusic);
    }

    create() {
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.gameMusic.push(this.sound.add('mainMusic'));
        this.gameMusic[0].loop = true;
        this.gameMusic[0].play();

        this.gameMusic.push(this.sound.add('deathMusic'));
        this.gameMusic.push(this.sound.add('winMusic'));
        this.gameMusic.push(this.sound.add('workerUnited'));

        QixScene.Music = this.gameMusic;
        //play main music loop
        //play game over when you lose 
        //game won when oyu win
        //free a worker sound

        this.cursors = this.input.keyboard.createCursorKeys();
        this.playerSprite = this.add.sprite(5,50, 'player');
        this.player = new Player(this, customConfig.margin, customConfig.margin, this.playerSprite);
        this.workersManager = new workersManager(this);
        this.scabManager = new scabManager(this, this.physics, this.workersManager, this.player);
        this.grid = new Grid(this, this.workersManager, this.scabManager);
        
        
        //this.info = new Info(this);
        this.debug = new Debug(this);

        this.pauseControl = new PauseControl();

        /*this.test = this.physics.add.image(100,300, 'scab');
        this.testPos = new Phaser.Math.Vector2();
        this.testPos.x = this.player.x();
        this.testPos.y = this.player.y();*/

        this.workersManager.spawnWorkers();
        this.scabManager.spawnScabs();

        // this.player = this.add.sprite(100, 100, 'player');
        // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // this.cameras.main.startFollow(this.player, false);
    }

    update(time) {

        //this.physics.moveTo(this.test, this.player.x(), this.player.y(), 200);

        /*const distance = Phaser.Math.Distance.BetweenPoints(this.testPos, this.test);
        if(distance < 4) {
            this.test.body.reset(this.testPos.x, this.testPos.y);
        }*/

        if (this.pauseControl.isPaused(time)) {
            return;
        }

        if (this.grid.isIllegalMove(this.player, this.cursors)) {
            return;
        }

        this.player.move(this.cursors);
        this.grid.update(this.player);
        //this.info.updateGameText();

        if (this.checkForWin()) {
            this.gameMusic[2].play();
            this.passLevel(time);
        }

        if (this.scabManager.update()) {
            this.loseLife(0.5);
        }
    }

    checkForLoss() {
        //return this.sparkies.checkForCollisionWithPlayer() || this.qixes.checkForCollisionWithCurrentLines();
        return false;
    }

    loseLife(time) {
        this.gameMusic[1].play();
        customConfig.collectedAmount = 0;
        customConfig.workersAmount = 20;

        this.pauseControl.pauseForWin(time);
        this.cameras.main.shake(300, .005);
        this.pauseControl.pauseForWin(time);
        this.cameras.main.shake(300, .005);
        let winText = this.createWinText(`Ouch!!!.`, "#333333");

        const _this = this;
        setTimeout(function () {
            winText.destroy();
            _this.scene.restart({});
            Grid.isOnTheBorder = true;
        }, customConfig.levelWinPauseMs / 2);
    }

    checkForWin() {
        //return (this.grid.filledPolygons.percentArea() >= this.levels.coverageTarget);
        return customConfig.collectedAmount >= customConfig.winAmount;
    }

    options = { fontFamily: 'Courier', fontSize: '30px', color: '#bb33bb', align: 'center',
        radiusX: '10px', radiusY: '10px',
        padding: { x: 10, y: 10 }
    };

    passLevel(time) {
        this.pauseControl.pauseForWin(time);
        this.cameras.main.shake(300, .005);
        let winText = this.createWinText(`Sweet!!\nLevel ${this.levels.currentLevel} passed.`, "#333333");
        customConfig.collectedAmount = 0;
        customConfig.workersAmount = 20;

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