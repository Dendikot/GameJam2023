import * as Phaser from 'phaser';

const Polygon = Phaser.Geom.Polygon;
const Line = Phaser.Geom.Line;
const Point = Phaser.Geom.Point;
import {ExtPoint} from './ext-point';
const Rectangle = Phaser.Geom.Rectangle;
import {FilledPolygons} from "./filled-polygons";

export class ExtPolygon {
    percentArea;
    percentAreaString;
    polygon;
    lines = [];

    constructor(points, frameArea)
{
    this.polygon = this.createPolygon(points);
    this.lines = this.createLines(points);
    this.calculateAndSetPercentArea(this.polygon, frameArea);
}
createPolygon(points)

{
    return new Polygon(points);
}
createLines(points)
{
    var lines = [];
    for (var i = 0; i < points.length - 1; i++) {
        lines.push(new Line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y));
    }
    lines.push(new Line(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y));
    return lines;
}
calculateAndSetPercentArea(polygon, frameArea){
    this.percentArea = Math.abs(this.polygon.area) / frameArea * 100,
    this.percentAreaString = this.percentArea.toFixed(1)
};
draw(filledPolygons)
{
    var points = this.polygon.points;
    filledPolygons.graphics.beginPath();
    filledPolygons.graphics.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        filledPolygons.graphics.lineTo(points[i].x, points[i].y);
    }
    filledPolygons.graphics.lineTo(points[0].x, points[0].y);
    filledPolygons.graphics.closePath();
    filledPolygons.graphics.strokePath();
    filledPolygons.graphics.fillPath();
    this.lines.forEach(function (line) { return filledPolygons.graphics.strokeLineShape(line); });
}
outlineIntersects(point)
{
    for (var i = 0; i < this.lines.length; i++) {
        if (Phaser.Geom.Intersects.PointToLineSegment(point.point, this.lines[i])) {
            return true;
        }
    }
    return false;
}

innerIntersects(point)
{
    if (this.outlineIntersects(point)) {
        return false;
    }
    if (this.horizontalLineSameXValue(point)) {
        return false;
    }
    var mostRightPointXValue = this.getMostRightPointXValue();
    if (point.x() >= mostRightPointXValue) {
        return false;
    }
    var numIntersections = this.getNumberOfIntersections(new Line(point.x(), point.y(), mostRightPointXValue, point.y()));
    return numIntersections % 2 === 1;
}
getNumberOfIntersections(line)
{
    return this.lines.reduce(function (previousValue, currentLine) {
        return previousValue + (Phaser.Geom.Intersects.LineToLine(currentLine, line) ? 1 : 0);
    }, 0);
}
// createLineToRightEdge(startingPoint: ExtPoint) {
// }
getMostRightPointXValue()
{
    return this.lines.reduce(function (previousValue, currentLine) {
        return Math.max(previousValue, currentLine.x1, currentLine.x2);
    }, 0);
}
horizontalLineSameXValue(point)
{
    var y = point.y();
    var horizontalLines = this.lines.filter(function (line) {
        return (line.y1 === line.y2);
    });
    return horizontalLines.some(function (line) {
        return line.y1 === y;
    });
}
toRectangles()
{
    var rects = [];
    return rects;
}

}