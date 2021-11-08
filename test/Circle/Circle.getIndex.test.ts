import { Circle } from '../../src/Circle';

describe('Circle.prototype.qtIndex', () => {

    test('is a function', () => {
        expect(typeof Circle.prototype.qtIndex).toBe('function');
    });

    test('returns an array', () => {
        const circle = new Circle({ x: 20, y: 40, r: 100 });
        expect(Array.isArray(circle.qtIndex({x: 0, y: 0, width: 100, height: 100}))).toBe(true);
    });

    test('identifies quadrant top right', () => {
        const circle = new Circle({ x: 75, y: 25, r: 10 });
        expect(circle.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([0]);
    });

    test('identifies quadrant top left', () => {
        const circle = new Circle({ x: 25, y: 25, r: 10 });
        expect(circle.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([1]);
    });

    test('identifies quadrant bottom left', () => {
        const circle = new Circle({ x: 25, y: 75, r: 10 });
        expect(circle.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([2]);
    });

    test('identifies quadrant bottom right', () => {
        const circle = new Circle({ x: 75, y: 75, r: 10 });
        expect(circle.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([3]);
    });

    test('identifies overlapping top', () => {
        const circle = new Circle({ x: 50, y: 25, r: 10 });
        expect(circle.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([0, 1]);
    });

    test('identifies overlapping bottom', () => {
        const circle = new Circle({ x: 50, y: 75, r: 10 });
        expect(circle.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([2, 3]);
    });

    test('identifies overlapping left', () => {
        const circle = new Circle({ x: 25, y: 50, r: 10 });
        expect(circle.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([1, 2]);
    });

    test('identifies overlapping right', () => {
        const circle = new Circle({ x: 75, y: 50, r: 10 });
        expect(circle.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([0, 3]);
    });

    test('identifies all', () => {
        const circle = new Circle({ x: 50, y: 50, r: 10 });
        expect(circle.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([0, 1, 2, 3]);
    });

    test('identifies edge', () => {
        const node = {x: 0, y: 0, width: 100, height: 100};
        const topLeft = new Circle({ x: 25, y: 25, r: 25 });
        const bottomRight = new Circle({ x: 75, y: 75, r: 25 });

        //the current implementation is not greedy on shapes sitting exactly on the edge
        //Imagine these are exactly starting/ending on the edges:
        //      |
        //     ▮|  <-- only in top left quadrant
        // -----|-----
        //      |▮ <-- only in bottom right quadrant
        //      |

        expect(topLeft.qtIndex(node)).toEqual([1]);
        expect(bottomRight.qtIndex(node)).toEqual([3]);

        const smallest = 0.0000000000001;
        topLeft.x += smallest;
        topLeft.y += smallest;
        bottomRight.x -= smallest;
        bottomRight.y -= smallest;
        expect(topLeft.qtIndex(node)).toEqual([0, 1, 2]);
        expect(bottomRight.qtIndex(node)).toEqual([0, 2, 3]);
    });
});