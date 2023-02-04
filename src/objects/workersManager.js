import * as Phaser from 'phaser';
import {customConfig, baseGameValues} from "./config";
import { ExtPoint } from './ext-point';

export class Worker {
    sprite;
    point;
    constructor(sprite) {
        this.sprite = sprite;
        this.point = this.Point(this.sprite.x, this.sprite.y);
    }

    Point(x, y) {
        return ExtPoint.createWithCoordinates(x, y);
     }
}


export class workersManager {
    currentTargets = [];
    scene;
    filledPolygon;

    constructor(scene) {
        this.scene = scene;
    }

    spawnTargets(levelIndex = 0){
        for (let index = 0; index < customConfig.targetsAmount; index++) {
            this.currentTargets.push(this.createTarget(this.randomPos()));
        }
    }

    createTarget(position){
        const playerSprite = this.scene.add.sprite(position.x, position.y, 'player');
        const target = new Worker(playerSprite);
        return target;
    }

    randomPos(){
        return new Phaser.Math.Vector2(Phaser.Math.Between(0, baseGameValues.gameWidth),Phaser.Math.Between(0, baseGameValues.gameHeight));
    }


    getTargets(){
        return this.currentTargets;
    }
}