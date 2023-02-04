import * as Phaser from 'phaser'

const Point = Phaser.Geom.Point;
const Line = Phaser.Geom.Line;
/**
 * Point with additional helper methods. Decorates existing Phaser Point class.
 */
export class ExtPoint {
    constructor (p) {
        this.point = p;
    }

    static createWithCoordinates (x, y) {
        return new ExtPoint(new Point(x, y));
    }

    x() { return this.point.x; }
    y() { return this.point.y; }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    isLeftOf(p)
    {
        return this.x() < p.x();
    }
    isRightOf(p)
    {
        return this.x() > p.x();
    }
    isAboveOf(p)
    {
        return this.y() < p.y();
    }
    isBelowOf(p)
    {
        return this.y() > p.y();
    }

    isLeftAndAboveOf(p)
    {
        return this.isLeftOf(p) && this.isAboveOf(p);
    }
    isLeftAndBelowOf(p)
    {
        return this.isLeftOf(p) && this.isBelowOf(p);
    }
    isRightAndAboveOf(p)
    {
        return this.isRightOf(p) && this.isAboveOf(p);
    }
    isRightAndBelowOf(p)
    {
        return this.isRightOf(p) && this.isBelowOf(p);
    }

    isOnSameVerticalAxisOf(p)
    {
        return this.point.x === p.x();
    }
    isOnSameHorizontalAxisOf(p)
    {
        return this.point.y === p.y();
    }
    isBetweenTwoPointsInclusive(p1, p2)
    {
        var line = new Line(p1.x(), p1.y(), p2.x(), p2.y());
        return Phaser.Geom.Intersects.PointToLineSegment(this.point, line);
    }
    isAfter(point, p1, p2)
    {
        var isGoingRight = p2.x() > p1.x();
        var isGoingDown = p2.y() > p1.y();
        return isGoingRight && this.x() > point.x() ||
            isGoingDown && this.y() > point.y();
    }

    equals(p)
    {
        return (this.x() === p.x() && this.y() === p.y());
    }
    

    testMethod() {
        console.log("hello I am alive");
    }
};
