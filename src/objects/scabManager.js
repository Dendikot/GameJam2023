import * as Phaser from 'phaser';

export class Scab {
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

export class scabManager{
    currentScabs = [];
    scene;
    filledPolygon;

    constructor(scene) {
        this.scene = scene;
    }

    spawnScabs(levelIndex = 0){
        for (let index = 0; index < customConfig.targetsAmount; index++) {
            this.currentTargets.push(this.createScab(this.randomPos()));
        }
    }

    createScab(position){
        const scabSprite = this.scene.add.sprite(position.x, position.y, 'scab');
        const target = new Scab(scabSprite);
        return target;
        
    }

    randomPos(){
        return new Phaser.Math.Vector2(Phaser.Math.Between(customConfig.margin * 2, baseGameValues.gameWidth - customConfig.margin * 2),Phaser.Math.Between(0, customConfig.frameHeight));
    }

    update(){

    }

    moveScab(scab){

    }


    getScabs(){
        return this.currentScabs;
    }

}