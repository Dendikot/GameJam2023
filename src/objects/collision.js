export class CollisionType {
    static NONE = new CollisionType(1);
    static WITH_VERTICAL_LINE = new CollisionType(2);
    static WITH_HORIZONTAL_LINE = new CollisionType(3);

    constructor(collType) {
        this.collType = collType;
    }

}

export class Collision {

    static NONE = new Collision(CollisionType.NONE);
    //was with double horizontal before
    static WITH_VERTICAL_LINE = new Collision(CollisionType.WITH_VERTICAL_LINE);
    static WITH_HORIZONTAL_LINE = new Collision(CollisionType.WITH_HORIZONTAL_LINE);

    constructor(type) {
        this.type = type;
    }

    or(checkCollisionFunc){
        if (this.type === CollisionType.NONE) {
            return checkCollisionFunc();
        } else {
            return this;
        }
    }

    and(checkCollisionFunc){
        if (this.type === CollisionType.NONE) {
            return this;
        } else {
            return checkCollisionFunc();
        }
    }
}

