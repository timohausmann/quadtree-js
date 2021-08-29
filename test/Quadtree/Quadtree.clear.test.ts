import { Quadtree } from '../../src/Quadtree';

describe('Quadtree.clear', () => {

    test('is a function', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        expect(typeof tree.clear).toBe('function');
    });

    test('returns undefined', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        expect(tree.clear()).toBeUndefined();
    });

    test('empties objects', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        tree.insert({x: 0, y: 0, width: 100, height: 100});
        tree.clear();
        expect(tree.objects).toEqual([]);
    });

    test('empties nodes', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        tree.split();
        tree.clear();
        expect(tree.nodes).toEqual([]);
    });
});