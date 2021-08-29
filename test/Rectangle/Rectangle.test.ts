import { Rectangle } from '../../src/Rectangle';

describe('Rectangle.constructor', () => {

    test('applies minimal arguments', () => {
        const rect = new Rectangle({ x: 20, y: 40, width: 100, height: 200 });
        expect(rect.x).toBe(20);
        expect(rect.y).toBe(40);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(200);
        expect(rect.data).toBeUndefined();
    });

    test('applies data argument', () => {
        const data = { foo: 'bar' };
        const rect = new Rectangle({ x: 20, y: 40, width: 100, height: 200, data });
        expect(rect.data).toEqual(data);
    });

    test('has qtShape', () => {
        const rect = new Rectangle({ x: 20, y: 40, width: 100, height: 200 });
        expect(rect.qtShape).toEqual(Rectangle);
    });
});

