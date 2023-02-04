import * as Phaser from 'phaser';
import { customConfig, baseGameValues } from './config';
import { ExtPoint } from './ext-point';

export class Scab {
    sprite;
    point;
    target;
    targetPos;
    constructor(sprite, target) {
        this.sprite = sprite;
        this.point = this.Point(this.sprite.x, this.sprite.y);
        this.target = target;
        //this.targetPos = this.target.position;
        this.targetPos = this.target;
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
    targets = [new Phaser.Math.Vector2(123,154), new Phaser.Math.Vector2(230,180),new Phaser.Math.Vector2(98,254), new Phaser.Math.Vector2(278,368)];
    scene;
    physics;

    constructor(scene, physics) {
        this.scene = scene;
        this.physics = physics;
    }

    spawnScabs(levelIndex = 0){
        for (let index = 0; index < customConfig.scabAmount; index++) {
            this.currentScabs.push(this.createScab(this.randomPos()));
        }
    }

    createScab(position){
        const scabSprite = this.physics.add.sprite(position.x, position.y, 'scab');
        const scab = new Scab(scabSprite, this.randomTarg());
        console.log(scab.target);
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
                currentScab.targetPos = currentScab.target;
                this.physics.moveTo(currentScab.sprite, currentScab.targetPos.x, currentScab.targetPos.y);
            }
            const dist = Phaser.Math.Distance.Between(currentScab.sprite.x, currentScab.sprite.y,
                currentScab.targetPos.x, currentScab.targetPos.y);
            if(dist < 5){
                const targ = this.getNewTarg();
                console.log(targ);
                this.physics.moveTo(currentScab.sprite, targ.x, targ.y, customConfig.scabSpeed);
                currentScab.target = targ;
                currentScab.targetPos = targ;
            }
        }
    }

    getNewTarg(){
        return this.targets[Phaser.Math.Between(0, customConfig.scabAmount)];
    }

    moveScab(scab){

    }


    getScabs(){
        return this.currentScabs;
    }

}