import { Quadtree } from '../../src/Quadtree';

describe('Quadtree.retrieve', () => {

    test('is a function', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        expect(typeof tree.retrieve).toBe('function');
    });

    test('returns array', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        expect(Array.isArray(tree.retrieve({x: 0, y: 0, width: 0, height: 0}))).toBe(true);
    });

    test('retrieves objects', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        const rect = {x: 0, y: 0, width: 100, height: 100};
        tree.insert(rect);
        expect(tree.retrieve({x: 0, y: 0, width: 100, height: 100})).toEqual([rect]);
    });

    test('calls retrieve recursively', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        tree.split();
        jest.spyOn(tree.nodes[0], 'retrieve');
        jest.spyOn(tree.nodes[1], 'retrieve');
        jest.spyOn(tree.nodes[2], 'retrieve');
        jest.spyOn(tree.nodes[3], 'retrieve');

        tree.retrieve({x: 0, y: 0, width: 100, height: 100});
        expect(tree.nodes[0].retrieve).toHaveBeenCalledTimes(1);
        expect(tree.nodes[1].retrieve).toHaveBeenCalledTimes(1);
        expect(tree.nodes[2].retrieve).toHaveBeenCalledTimes(1);
        expect(tree.nodes[3].retrieve).toHaveBeenCalledTimes(1);
    });

    test('retrieves without duplicates', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        const rect = {x: 0, y: 0, width: 100, height: 100};
        tree.split();
        tree.insert(rect);
        const result = tree.retrieve(rect);
        expect(result).toHaveLength(1);        
    });
});