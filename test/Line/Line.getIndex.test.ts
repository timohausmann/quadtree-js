import { Line } from '../../src/Line';

describe('Line.prototype.qtIndex', () => {

    test('is a function', () => {
        expect(typeof Line.prototype.qtIndex).toBe('function');
    });

    test('returns an array', () => {
        const line = new Line({ x1: 20, y1: 40, x2: 100, y2: 200 });
        expect(Array.isArray(line.qtIndex({x: 0, y: 0, width: 100, height: 100}))).toBe(true);
    });

    test('identifies quadrant top right', () => {
        const line = new Line({ x1: 75, y1: 25, x2: 80, y2: 30 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([0]);
    });

    test('identifies quadrant top left', () => {
        const line = new Line({ x1: 25, y1: 25, x2: 30, y2: 30 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([1]);
    });

    test('identifies quadrant bottom left', () => {
        const line = new Line({ x1: 25, y1: 75, x2: 30, y2: 80 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([2]);
    });

    test('identifies quadrant bottom right', () => {
        const line = new Line({ x1: 75, y1: 75, x2: 80, y2: 80 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([3]);
    });

    test('identifies overlapping top', () => {
        const line = new Line({ x1: 25, y1: 25, x2: 75, y2: 25 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([0, 1]);
    });

    test('identifies overlapping bottom', () => {
        const line = new Line({ x1: 25, y1: 75, x2: 75, y2: 75 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([2, 3]);
    });

    test('identifies overlapping left', () => {
        const line = new Line({ x1: 25, y1: 25, x2: 25, y2: 75 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([1, 2]);
    });

    test('identifies overlapping right', () => {
        const line = new Line({ x1: 75, y1: 25, x2: 75, y2: 75 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([0, 3]);
    });

    test('identifies diagonal /', () => {
        const line = new Line({ x1: 25, y1: 75, x2: 75, y2: 25 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([0, 2]);
    });

    test('identifies diagonal \\', () => {
        const line = new Line({ x1: 25, y1: 25, x2: 75, y2: 75 });
        expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([1, 3]);
    });

    /**
     * @todo
     * @remarks 
     * There is a bug where detection fails on corner intersections 
     * when the line enters/exits the node exactly at corners (45°)
     * {@link https://stackoverflow.com/a/18292964/860205}
     */
    // test('identifies diagonal / overstretch', () => {
    //     const line = new Line({ x1: 125, y1: -25, x2: -25, y2: 125 });
    //     expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([0, 2]);
    // });

    // test('identifies diagonal \\ overstretch', () => {
    //     const line = new Line({ x1: -25, y1: -25, x2: 125, y2: 125 });
    //     expect(line.qtIndex({x: 0, y: 0, width: 100, height: 100})).toEqual([1, 3]);
    // });

    test('identifies edge', () => {
        const node = {x: 0, y: 0, width: 100, height: 100};
        const topLeft = new Line({ x1: 25, y1: 25, x2: 50, y2: 50 });
        const bottomRight = new Line({ x1: 50, y1: 50, x2: 75, y2: 75 });

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
        topLeft.x2 += smallest;
        topLeft.y2 += smallest;
        bottomRight.x1 -= smallest;
        bottomRight.y1 -= smallest;
        expect(topLeft.qtIndex(node)).toEqual([1, 3]);
        expect(bottomRight.qtIndex(node)).toEqual([1, 3]);
    });
});