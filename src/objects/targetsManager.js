import * as Phaser from 'phaser';
import {customConfig, baseGameValues} from "./config";


export class targetsManager {
    currentTargets = [];
    scene;

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
        return playerSprite;
    }

    randomPos(){
        return new Phaser.Math.Vector2(Phaser.Math.Between(0, baseGameValues.gameWidth),Phaser.Math.Between(0, baseGameValues.gameHeight));
    }


}