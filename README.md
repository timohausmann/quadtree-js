# quadtree-js 2.0.0-beta.1

## Please note: this is a beta release.

**If you experience problems** please [raise an issue](https://github.com/timohausmann/quadtree-js/issues) and [use v1 in the meantime](https://github.com/timohausmann/quadtree-js/tree/064e56bfd9c3ef2c6ba9fa5f911a4e9cf61493a8).

### Todos

* Add integrity hash to script tags
* Update and publish jsdoc/tsdoc
* Add explanations to primitives example
* Publish to npm
* Add module to retrieve nodes and objects
* Add module to update objects

This Javascript Quadtree Library can store and retrieve Rectangles, Circles and Lines in a recursive 2D Quadtree. Every Quadtree node can hold a maximum number of objects before it splits into four subnodes. Objects are only stored on leaf nodes (the lowest level). If an object overlaps into multiple leaf nodes, a reference to the object is stored in each node. 

*Only XXX Bytes! (Compressed + Gzipped)*

The code was initially based on the Java Methods described on [gamedevelopment.tutsplus.com by Steven Lambert](https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374) and underwent some revisions since.

> Many games require the use of collision detection algorithms to determine when two objects have collided, but these algorithms are often expensive operations and can greatly slow down a game. One way to speed things up is to reduce the number of checks that have to be made. Two objects that are at opposite ends of the screen can not possibly collide, so there is no need to check for a collision between them. This is where a quadtree comes into play.


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
// ES6
import { Quadtree } from '@timohausmann/quadtree-js';
// CommonJS
const { Quadtree } = require('@timohausmann/quadtree-js');
```

Alternatively, [download the source](https://github.com/timohausmann/quadtree-js/archive/master.zip) and include it the old-fashioned way, or use an awesome CDN like [jsdelivr](https://www.jsdelivr.com/package/npm/@timohausmann/quadtree-js) or [unpkg](https://unpkg.com/browse/@timohausmann/quadtree-js@latest/). (If you only need Rectangles and want to save some bytes, use `quadtree.umd.basic.js` instead):

```html
<!-- self-hosted -->
<script src="quadtree.umd.full.js"></script>
<!-- CDN jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/@timohausmann/quadtree-js/dist/quadtree.umd.full.js"></script>
<!-- CDN unpkg -->
<script src="https://unpkg.com/@timohausmann/quadtree-js/dist/quadtree.umd.full.js"></script>
```


## How to use

Create a new Quadtree:

```javascript
const myTree = new Quadtree({
    width: 800,
    height: 600
});
```

Optional properties: 
* `maxObjects` – defines how many objects a node can hold before it splits 
* `maxLevels` – defines the deepest level subnode
* `x` and `y` – coordinate offset

I recommend using low values for `maxLevels` because each level will quadruple the possible amount of nodes. Using lower values for `maxLevels` increases performance but may return more candidates. Finetuning these values depends on your 2D space, the amount and size of the objects and your retrieving areas. 

```javascript
const myTree = new Quadtree({
    width: 600,
    height: 400,
    x: 100,         // default:  0
    y: 100,         // default:  0
    maxObjects: 15, // default: 10
    maxLevels: 3    // default:  4
});
``` 

Insert an element in the Quadtree (default: Rectangle)
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
const elements = myTree.retrieve({
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

### Shapes

You can use any object directly with the Quadtree. There are a few primitive shapes available. Just specify what shape they are with `qtShape` (default: `Rectangle`). Each shape has required properties specific to their geometry.

| Shape     | Required Properties |
|-----------|---------------------|
| Rectangle | x, y, width, height |
| Circle    | x, y, r             |
| Line      | x1, y1, x2, y2      |

```javascript
import { Rectangle, Circle, Line } from '@timohausmann/quadtree-js';

const player = {
    qtShape: Rectangle,
    name: 'Giana',
    x: 100,
    y: 0,
    width: 24,
    height: 48,
};
const explosion = {
    qtShape: Circle,
    damage: 100,
    x: 50,
    y: 50,
    r: 100,
};
const Laser = {
    qtShape: Line,
    color: 'green',
    x1: 50,
    y1: 50,
    x2: 100,
    y2: 100,
};
```

These shapes are actually classes! You can also use them directly or extend them. Store custom data on the `data` property.

```javascript
import { Rectangle, Circle, Line } from '@timohausmann/quadtree-js';

// Class usage
const rectangle = new Rectangle({ x: 67, y: 67, width: 100, height: 100 });
const circle    = new Circle({ x: 128, y: 128, r: 50, data: 'custom data here' });
const line      = new Line({ x1: 67, y1: 67, x2: 128, y2: 128, data: { foo: bar } });

myTree.insert(rectangle);
myTree.insert(circle);
myTree.insert(line);

const area = new Rectangle({ x: 50, y: 50, width: 50, height: 50 });
const elements = myTree.retrieve(area);

// Class extend
class Laser extends Line {
    constructor(props) {
        super(props);
        this.color = 'green';
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}

const laser = new Laser({x1: 100, y1: 0, x2: 100, y2: 100});
myTree.insert(laser);
```

If you are using the **UMD bundles**, the classes are available as `Quadtree.Rectangle`, `Quadtree.Circle` and `Quadtree.Line`.

Check out the examples for more information.


## Typescript

When using classes, you can easily tell TS the shape of your custom data with `<T>`:

```typescript
interface GameEntity {
    name: string
    health: number
}
const hero = new Rectangle<GameEntity>({
    x: 100,
    y: 100,
    width: 24,
    height: 48,
    data: {
        name: 'Shiffman',
        health: 100,
    }
})
```

## Browser Support

As of 2.0.0 the UMD bundles use ES6 features (e.g. classes) that are not supported by IE11 and below. 
For legacy browser support, please download a [1.x version](https://github.com/timohausmann/quadtree-js/releases) of this library or bundle and polyfill it on your own.


## Development scripts

* `npm run dev` to watch and build the source
* `npm run build` to build the source
* `npm run test` to run the test suit
* `npm run lint` to run eslint
* `npm run lint:fix` to run eslint with --fix


## Migration Guide to 2.0.0

* Named exports only: 👉 Change `import Quadtree ...` to `import { Quadtree } ...`
* Quadtree constructor: `maxObjects` and `maxLevels` are now named properties. Also, `x` and `y` are now optional. 👉 Change `new Quadtree({x: 0, y: 0, width: 100, height: 100}, 5, 2);` to `new Quadtree({width: 100, height: 100, maxObjects: 5, maxLevels: 2});`
* Bundle filename has changed. 👉 Update your script tag from `quadtree.min.js` to `quadtree.umd.basic.js`
* Typescript: no more `Rect` interface. 👉 use `Rectangle` instead


## Changelog

### 2.0.0

* Refactored Codebase to ES6 and Typescript
* Added modular classes for Rectangle, Circle, Line
* Added dedicated bundle files for CJS, EMS and UMD
* Added Unit Tests with Jest
* Added ESLint

### 1.2.5

* Typescript Definition File Bugfix (thanks to [pietrovismara](https://github.com/timohausmann/quadtree-js/pull/18))

### 1.2.4

* Added definition files for Typescript support
* JSDoc Fixes

### 1.2.3

* Using github.io for examples (docs)
* CDN URLs

### 1.2.2

* Removed `grunt` dev dependency, now using `uglify-js` to minifiy

### 1.2.1

* Allow float boundaries for Quads
* Simplified getIndex function

### 1.2.0

This implementation now stores objects exclusively on leaf nodes and thus differs from the tutorial it's based on. Objects, that overlap into multiple subnodes are now referenced in each matching subnode instead of their parent node. This drastically reduces the collision candidates. Prior to 1.2.0, overlapping objects were stored in parent nodes. 

### 1.1.3

* Support for npm and `module.exports`

## Update single objects

There is a (currently deprecated) [quadtree-js hitman branch](https://github.com/timohausmann/quadtree-js/tree/hitman) available that allows you to update and remove single objects. This may be handy when most of the objects in your Quadtree are static. Please raise an issue if you want to see this feature maintained in future releases.