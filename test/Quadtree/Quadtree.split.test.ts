import { Quadtree } from '../../src/Quadtree';

describe('Quadtree.split', () => {

    test('is a function', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        expect(typeof tree.split).toBe('function');
    });

    test('returns undefined', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        expect(tree.split()).toBeUndefined();
    });

    test('populates four subnodes', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        tree.split();
        expect(tree.nodes).toHaveLength(4);
    });

    test('subnodes are of class Quadtree', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        tree.split();
        for(let i=0; i < 4; i++) {
            expect(tree.nodes[i]).toBeInstanceOf(Quadtree);
        }
    });

    test('subnodes are increasing in level', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        let lastTree = tree;
        for(let depth=0; depth < 4; depth++) {
            lastTree.split();
            for(let i=0; i < 4; i++) {
                expect(lastTree.nodes[i].level).toBe(depth+1);
            }

            lastTree = lastTree.nodes[0];
        }
    });

    test('subnodes inherit max levels and objects', () => {
        const tree = new Quadtree({ width: 100, height: 100, maxObjects: 5, maxLevels: 3 });
        tree.split();         
        for(let i=0; i < 4; i++) {
            expect(tree.nodes[i].maxObjects).toBe(5);
            expect(tree.nodes[i].maxLevels).toBe(3);
        }
    });

    test('subnodes are arranged and scaled correctly', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        tree.split();
        expect(tree.nodes[0].bounds).toEqual({ x: 50, y: 0, width: 50, height: 50 });
        expect(tree.nodes[1].bounds).toEqual({ x: 0, y: 0, width: 50, height: 50 });
        expect(tree.nodes[2].bounds).toEqual({ x: 0, y: 50, width: 50, height: 50 });
        expect(tree.nodes[3].bounds).toEqual({ x: 50, y: 50, width: 50, height: 50 });
    });

    test('subnodes are arranged and scaled correctly (floats)', () => {
        const tree = new Quadtree({ width: 99, height: 99 });
        tree.split();
        expect(tree.nodes[0].bounds).toEqual({ x: 49.5, y: 0, width: 49.5, height: 49.5 });
        expect(tree.nodes[1].bounds).toEqual({ x: 0, y: 0, width: 49.5, height: 49.5 });
        expect(tree.nodes[2].bounds).toEqual({ x: 0, y: 49.5, width: 49.5, height: 49.5 });
        expect(tree.nodes[3].bounds).toEqual({ x: 49.5, y: 49.5, width: 49.5, height: 49.5 });
    });
});