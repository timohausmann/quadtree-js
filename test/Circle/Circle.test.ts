import { Circle } from '../../src/Circle';

describe('Circle.constructor', () => {

    test('applies minimal arguments', () => {
        const circle = new Circle({ x: 20, y: 40, r: 100 });
        expect(circle.x).toBe(20);
        expect(circle.y).toBe(40);
        expect(circle.r).toBe(100);
        expect(circle.data).toBeUndefined();
    });

    test('applies data argument', () => {
        const data = { foo: 'bar' };
        const circle = new Circle({ x: 20, y: 40, r: 100, data });
        expect(circle.data).toEqual(data);
    });

    test('has qtShape', () => {
        const circle = new Circle({ x: 20, y: 40, r: 100 });
        expect(circle.qtShape).toEqual(Circle);
    });
});

