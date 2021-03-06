# quadtree-js

This is a JavaScript Quadtree implementation based on the Java Methods described on [gamedevelopment.tutsplus.com by Steven Lambert](https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374):

> Many games require the use of collision detection algorithms to determine when two objects have collided, but these algorithms are often expensive operations and can greatly slow down a game. One way to speed things up is to reduce the number of checks that have to be made. Two objects that are at opposite ends of the screen can not possibly collide, so there is no need to check for a collision between them. This is where a quadtree comes into play.

This implementation can store and retrieve rectangles in a recursive 2D Quadtree. Every Quadtree node can hold a maximum number of objects before it splits into four subnodes. Objects are only stored on leaf nodes (the lowest level). If an object overlaps into multiple leaf nodes, a reference to the object is stored in each node. 

*Only 639 Bytes! (Compressed + Gzipped)*

## Demos

* [Simple Demo](https://timohausmann.github.io/quadtree-js/simple.html) – add static objects and see the Quadtree split
* [Dynamic Demo](https://timohausmann.github.io/quadtree-js/dynamic.html) – continuously track moving objects
* [Many to many Demo](https://timohausmann.github.io/quadtree-js/many.html) – check all objects against each other
* [Benchmark v1.2](https://timohausmann.github.io/quadtree-js/test-10000-1.2.0.html) - Performance test with 10.000 objects
* [Benchmark v1.1.3](https://timohausmann.github.io/quadtree-js/test-10000-1.1.3.html) - Performance test with 10.000 objects (old implementation)

## Install

Install this module via [npm](https://www.npmjs.com/package/@timohausmann/quadtree-js) and import or require it:

```bash
npm i -D @timohausmann/quadtree-js
```

```javascript
import Quadtree from '@timohausmann/quadtree-js';
```

```javascript
const Quadtree = require('@timohausmann/quadtree-js');
```

Alternatively, [download the source](https://github.com/timohausmann/quadtree-js/archive/master.zip) and include it the old-fashioned way:

```html
<script src="quadtree.min.js"></script>
```

Or use an awesome CDN like [jsdelivr](https://www.jsdelivr.com/package/npm/@timohausmann/quadtree-js) or [unpkg](https://unpkg.com/browse/@timohausmann/quadtree-js@latest/):

```html
<script src="https://cdn.jsdelivr.net/npm/@timohausmann/quadtree-js/quadtree.min.js"></script>
```

```html
<script src="https://unpkg.com/@timohausmann/quadtree-js/quadtree.min.js"></script>
```


## How to use

Create a new Quadtree (with default values for `max_objects` (10) and `max_levels` (4)).

```javascript
var myTree = new Quadtree({
    x: 0,
    y: 0,
    width: 400,
    height: 300
});
```

> MAX_OBJECTS defines how many objects a node can hold before it splits and MAX_LEVELS defines the deepest level subnode.

If you want to specify `max_objects` and `max_levels` on your own, you can pass them as a 2nd and 3rd argument. I recommend using low values for `max_levels` because each level will quadruple the possible amount of nodes. Using lower values for `max_levels` increases performance but may return more candidates. Finetuning these values depends on your 2D space, the amount and size of the objects and your retrieving areas. 

```javascript
var myTree = new Quadtree({
    x: 0,
    y: 0,
    width: 800,
    height: 600
}, 15, 6);
``` 

Insert an element in the Quadtree
```javascript
myTree.insert({
    x: 100,
    y: 100,
    width: 100,
    height: 100
});
```

Retrieve elements from nodes that intersect with the given bounds
```javascript
var elements = myTree.retrieve({
    x: 150,
    y: 150,
    width: 100,
    height: 100
});
```

Clear the Quadtree
```javascript
myTree.clear();
```

Check out the examples for more information.

## Typescript

Type definitions are included. Inserted objects need to conform to the `Quadtree.Rect` interface. 

```javascript
import Quadtree, { Rect } from '@timohausmann/quadtree-js';

interface Player extends Rect {
    name: string;
    health: number;
}

const hero:Player = {
    name: 'Shiffman',
    health: 100,
    x: 100,
    y: 100,
    width: 32,
    height: 32
}

myTree.insert(hero);
```

## Browser Support

This library is supported in all modern browsers including IE9 and above. 

## Development scripts

* `npm run build` to minify the source

## Changelog

### 1.2.4

Added definition files for Typescript support

JSDoc Fixes

### 1.2.3

Using github.io for examples (docs), CDN URLs

### 1.2.2

Removed `grunt` dev dependency, now using `uglify-js` to minifiy

### 1.2.1

Allow float boundaries for Quads

Simplified getIndex function

### 1.2.0

This implementation now stores objects exclusively on leaf nodes and thus differs from the tutorial it's based on. Objects, that overlap into multiple subnodes are now referenced in each matching subnode instead of their parent node. This drastically reduces the collision candidates. Prior to 1.2.0, overlapping objects were stored in parent nodes. 

### 1.1.3

Support for npm and `module.exports`

## Update single objects

There is a (currently deprecated) [quadtree-js hitman branch](https://github.com/timohausmann/quadtree-js/tree/hitman) available that allows you to update and remove single objects. This may be handy when most of the objects in your Quadtree are static. Please raise an issue if you want to see this feature maintained in future releases.
