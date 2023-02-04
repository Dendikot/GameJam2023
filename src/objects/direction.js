export class Direction {
    static UP = new Direction(1);
    static DOWN = new Direction(2);
    static LEFT = new Direction(3);
    static TOP = new Direction(4);

    constructor(direction) {
        this.direction = direction;
    }
}

export class CollisionType {
    static NONE = new CollisionType(1);
    static WITH_VERTICAL_LINE = new CollisionType(2);
    static WITH_HORIZONTAL_LINE = new CollisionType(3);

    constructor(collType) {
        this.collType = collType;
    }

}