import * as Phaser from 'phaser';
import { customConfig, baseGameValues } from './config';
import { ExtPoint } from './ext-point';
import { Grid } from './grid';

export class Scab {
    sprite;
    point;
    target;
    targetPos;
    constructor(sprite, target) {
        this.sprite = sprite;
        this.point = this.Point(this.sprite.x, this.sprite.y);
        this.target = target;
        this.targetPos = new Phaser.Math.Vector2(this.target.x, this.target.y);
    }

    Point(x, y) {
        return ExtPoint.createWithCoordinates(x, y);
    }

    setTarget(target){
        this.target = target;
    }

    isReachedPos(){
        return Phaser.Math.Distance.BetweenPoints();
    }
}

export class scabManager{
    currentScabs = [];
    workersManager;
    targets = [];
    scene;
    physics;

    constructor(scene, physics, workersManager, player) {
        this.scene = scene;
        this.physics = physics;
        this.workersManager = workersManager;
        this.player = player;
    }

    spawnScabs(levelIndex = 0){
        this.targets = this.workersManager.currentWorkers;
        this.targets.push(this.player);
        for (let index = 0; index < customConfig.scabAmount; index++) {
            this.currentScabs.push(this.createScab(this.randomPos()));
        }
    }

    createScab(position){
        const scabSprite = this.physics.add.sprite(position.x, position.y, 'scab');
        const scab = new Scab(scabSprite, this.randomTarg());
        this.physics.moveTo(scab.sprite, scab.target.x, scab.target.y, customConfig.scabSpeed);
        return scab;
        
    }

    randomTarg(){
        return new Phaser.Math.Vector2(200,300);
    }

    randomPos(){
        return new Phaser.Math.Vector2(Phaser.Math.Between(customConfig.margin * 2, baseGameValues.gameWidth - customConfig.margin * 2),Phaser.Math.Between(0, customConfig.frameHeight));
    }

    update(){
        for (let index = 0; index < customConfig.scabAmount; index++) {
            const currentScab = this.currentScabs[index];

            if(currentScab.target !== currentScab.targetPos){
                // change to target.position
                currentScab.targetPos = new Phaser.Math.Vector2(currentScab.target.x, currentScab.target.y);
                this.physics.moveTo(currentScab.sprite, currentScab.targetPos.x, currentScab.targetPos.y, customConfig.scabSpeed);
            }
            const dist = Phaser.Math.Distance.Between(currentScab.sprite.x, currentScab.sprite.y,
                currentScab.targetPos.x, currentScab.targetPos.y);
            if(dist < 5){
                if(this.player.sprite === currentScab.target && !Grid.isOnTheBorder) {
                    return true;
                }

                const targ = this.getNewTarg();
                this.physics.moveTo(currentScab.sprite, targ.x, targ.y, customConfig.scabSpeed);
                currentScab.target = targ;
                currentScab.targetPos = new Phaser.Math.Vector2(targ.x, targ.y);
            }
        }
        return false;
    }

    getNewTarg(){
        return this.targets[Phaser.Math.Between(0, customConfig.workersAmount)].sprite;
    }

    moveScab(scab){

    }


    getScabs(){
        return this.currentScabs;
    }

}