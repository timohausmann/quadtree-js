import { Quadtree } from '../../src/Quadtree';

describe('Quadtree.insert', () => {

    test('is a function', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        expect(typeof tree.insert).toBe('function');
    });

    test('returns undefined', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        const rect = {x: 0, y: 0, width: 100, height: 100};
        expect(tree.insert(rect)).toBeUndefined();
    });

    test('adds objects to objects array', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        const rect = {x: 0, y: 0, width: 100, height: 100};
        tree.insert(rect); 
        expect(tree.objects).toEqual([rect]);
    });

    test('adds objects to subnodes', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        const rect = {x: 0, y: 0, width: 100, height: 100};
        tree.split();
        tree.insert(rect); 
        expect(tree.nodes[0].objects).toEqual([rect]);
        expect(tree.nodes[1].objects).toEqual([rect]);
        expect(tree.nodes[2].objects).toEqual([rect]);
        expect(tree.nodes[3].objects).toEqual([rect]);
    });

    test('calls insert recursively', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        const rect = {x: 0, y: 0, width: 100, height: 100};
        tree.split();

        jest.spyOn(tree.nodes[0], 'insert');
        jest.spyOn(tree.nodes[1], 'insert');
        jest.spyOn(tree.nodes[2], 'insert');
        jest.spyOn(tree.nodes[3], 'insert');

        tree.insert(rect); 
        expect(tree.nodes[0].insert).toHaveBeenCalledTimes(1);
        expect(tree.nodes[1].insert).toHaveBeenCalledTimes(1);
        expect(tree.nodes[2].insert).toHaveBeenCalledTimes(1);
        expect(tree.nodes[3].insert).toHaveBeenCalledTimes(1);
    });

    test('calls split when max_objects has been reached', () => {
        const tree = new Quadtree({ width: 100, height: 100 });
        jest.spyOn(tree, 'split');
        for(let i = 0; i <= tree.max_objects; i++) {
            tree.insert({x: 0, y: 0, width: 100, height: 100});
        }
        expect(tree.split).toHaveBeenCalledTimes(1);
    });

    test('does not call split when max_levels has been reached', () => {
        const tree = new Quadtree({ width: 100, height: 100 }, 10, 0);
        jest.spyOn(tree, 'split');
        for(let i = 0; i <= tree.max_objects * tree.max_levels; i++) {
            tree.insert({x: 0, y: 0, width: 100, height: 100});
        }
        expect(tree.split).toHaveBeenCalledTimes(0);
    });
});