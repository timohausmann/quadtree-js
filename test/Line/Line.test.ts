import { Line } from '../../src/Line';

describe('Line.constructor', () => {

    test('applies minimal arguments', () => {
        const line = new Line({ x1: 20, y1: 40, x2: 100, y2: 200 });
        expect(line.x1).toBe(20);
        expect(line.y1).toBe(40);
        expect(line.x2).toBe(100);
        expect(line.y2).toBe(200);
        expect(line.data).toBeUndefined();
    });

    test('applies data argument', () => {
        const data = { foo: 'bar' };
        const line = new Line({ x1: 20, y1: 40, x2: 100, y2: 200, data });
        expect(line.data).toEqual(data);
    });

    test('has qtShape', () => {
        const line = new Line({ x1: 20, y1: 40, x2: 100, y2: 200 });
        expect(line.qtShape).toEqual(Line);
    });
});

