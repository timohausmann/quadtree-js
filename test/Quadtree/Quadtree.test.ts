import { Quadtree } from '../../src/Quadtree';

describe('Quadtree.constructor', () => {

    test('applies minimal arguments and defaults', () => {

        const tree = new Quadtree({ width: 100, height: 200 });
    
        expect(tree.bounds).toEqual({ x: 0, y: 0, width: 100, height: 200 });    
        expect(tree.maxObjects).toBe(10);
        expect(tree.maxLevels).toBe(4);
        expect(tree.level).toBe(0);
    });

    test('applies all arguments', () => {

        const tree = new Quadtree({ x: 20, y: 40, width: 100, height: 200, maxObjects: 5, maxLevels: 3 });
    
        expect(tree.bounds).toEqual({ x: 20, y: 40, width: 100, height: 200 });
        expect(tree.maxObjects).toBe(5);
        expect(tree.maxLevels).toBe(3);
    });
});

