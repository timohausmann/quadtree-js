# quadtree-js 2.0.0-beta.1

## Please note: this is a beta release.

**If you experience problems** please [raise an issue](https://github.com/timohausmann/quadtree-js/issues) and consider using the [simple but battle-tested v1 in the meantime](https://github.com/timohausmann/quadtree-js/tree/064e56bfd9c3ef2c6ba9fa5f911a4e9cf61493a8) (`npm install @timohausmann/quadtree-js@1.2.5`).

This Javascript Quadtree Library can store and retrieve *Rectangles, Circles and Lines* in a recursive 2D Quadtree. Every Quadtree node can hold a maximum number of objects before it splits into four subnodes. Objects are only stored on leaf nodes (the lowest level). If an object overlaps into multiple leaf nodes, a reference to the object is stored in each node. 

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
npm install --save-dev @timohausmann/quadtree-js
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
import { Quadtree } from '@timohausmann/quadtree-js';

const myTree = new Quadtree({
    width: 800,
    height: 600,
    x: 0,           // optional, default:  0
    y: 0,           // optional, default:  0
    maxObjects: 10, // optional, default: 10
    maxLevels: 4    // optional, default:  4
});
``` 

Optional properties: 
* `maxObjects` – defines how many objects a node can hold before it splits 
* `maxLevels` – defines the deepest level subnode
* `x` and `y` – coordinate offset

I recommend using low values for `maxLevels` because each level will quadruple the possible amount of nodes. Using lower values for `maxLevels` increases performance but may return more candidates. Finetuning these values depends on your 2D space, the amount and size of the objects and your retrieving areas. 

Insert elements in the Quadtree:
```javascript
import { Rectangle, Circle, Line } from '@timohausmann/quadtree-js';

const rectangle = new Rectangle({
    x: 100,
    y: 100,
    width: 100,
    height: 100
});
myTree.insert(rectangle);

const line = new Line({
    x1: 25,
    y1: 25,
    x2: 75,
    y2: 25
})
myTree.insert(line);

const circle = new Circle({
    x: 100,
    y: 100,
    r: 50
})
myTree.insert(circle);
```

Retrieve elements from nodes that intersect with the given shape:
```javascript
const area = new Rectangle({
    x: 150,
    y: 150,
    width: 100,
    height: 100
})
const elements = myTree.retrieve(area);
```

Reset the Quadtree:
```javascript
myTree.clear();
```

### Shapes

The supported built-in primitive shapes are `Rectangle`, `Circle` and `Line`. 
All shapes can be inserted or used for retrieval. 
Each shape requires properties specific to their geometry.

| Shape     | Required Properties |
|-----------|---------------------|
| Rectangle | x, y, width, height |
| Circle    | x, y, r             |
| Line      | x1, y1, x2, y2      |

You can use these classes directly, extend them or integrate them in your own objects (see below). 

Note: if you are using the **UMD bundles**, the classes are available as `Quadtree.Rectangle`, `Quadtree.Circle` and `Quadtree.Line`.

```javascript
// Class usage as-is
const player = new Rectangle({ 
    x: 67, 
    y: 67, 
    width: 100, 
    height: 100 
});
myTree.insert(player);

// Class extension
class Explosion extends Circle {

    constructor(props) {
        super(props);
    }

    explode() {
        console.log('boom!');
    }
}
const explosion = new Explosion({ x: 100, y: 100, r: 100 });
const affectedObjects = myTree.retrieve(explosion);
```

### Custom data

All shapes support an optional data property that you can use however you like.

```javascript
const rectangle = new Rectangle({ 
    x: 24, 
    y: 24, 
    width: 100, 
    height: 100, 
    data: 'custom data here' 
});
const circle = new Circle({ 
    x: 128, 
    y: 128, 
    r: 50, 
    data: { 
        name: 'Stanley', 
        health: 100 
    } 
});
```

### Custom integration

Under the hood all shape classes implement a `qtIndex` method that is crucial for determining in which quadrant a shape belongs. You can think of it as a shape identifier. An alternative to using the class constructors is to supply your own `qtIndex` function for objects you want the Quadtree to interact with. 

This is also helpful if your existing object properties don't match the required shape properties and you have to map them.

```javascript
// Custom integration without mapping properties
// In this case the custom object has all the 
// expected shape properties (x1, y1, x2, y2)
// So we can simply reference the qtIndex method
const redLaser = {
    color: 'red',
    damage: 10,
    x1: 67, 
    y1: 67, 
    x2: 128, 
    y2: 128,
    qtIndex: Line.prototype.qtIndex
}
myTree.insert(redLaser);

// Custom integration with mapping properties
// In this case the coordinates are arrays so they need to be mapped
const greenLaser = {
    color: 'green',
    damage: 10,
    startPoint: [50, 50],
    endPoint: [100, 50],
    qtIndex: function(node) {
        return Line.prototype.qtIndex.call({
            x1: this.startPoint[0],
            y1: this.startPoint[1],
            x2: this.endPoint[0],
            y2: this.endPoint[1],
        }, node);
    }
};
myTree.insert(greenLaser);

// Custom integration with mapping in a class
// If you have many instances of the same thing, 
// I recommend adding the qtIndex to your class/prototype
class Bomb {

    constructor() {
        this.position = [50, 50];
        this.radius = 100;
    }

    qtIndex(node) {
        return Circle.prototype.qtIndex.call({
            x: this.position[0],
            y: this.position[1],
            r: this.radius,
        }, node);
    }
}
const bombOmb = new Bomb();
myTree.insert(bombOmb);

```

Check out the examples for more information.


## Typescript

All types can be imported and are documented in the API docs. 

The Quadtree class accepts an optional type argument `<ObjectsType>` for all inserted/retrieved objects:

```typescript
class GameEntity extends Rectangle {
    ...
}
const myTree = new Quadtree<GameEntity>({
    width: 800,
    height: 600
});
const rocket = new Rocket(...); // extends GameEntity
myTree.insert(rocket);
const results = myTree.retrieve(...); // GameEntity[]
```

The shape classes accept an optional type argument `<CustomDataType>` for the custom data:

```typescript
interface PlayerData {
    name: string
    health: number
}
const hero = new Rectangle<PlayerData>({
    x: 100,
    y: 100,
    width: 24,
    height: 48,
    data: {
        name: 'Shiffman',
        health: 100,
    }
});
```

## Browser Support

As of 2.0.0 the UMD bundles use ES6 features (e.g. classes) that are not supported by IE11 and below. 
For legacy browser support, please polyfill the code on your own or download a [1.x version](https://github.com/timohausmann/quadtree-js/releases). 


## Development scripts

* `npm run dev` to watch and build the source
* `npm run build` execute rollup, docs, dts
* `npm run rollup` to build the source only
* `npm run test` to run the test suite
* `npm run lint` to run eslint
* `npm run docs` to create docs
* `npm run dts` to create definition files

## Folder structure

* `/dist` auto-generated by `npm run build`
* `/docs` github pages
* `/docs/documentation` auto-generated by `npm run docs`
* `/docs/examples` the demo examples
* `/src` source code
* `/test` jest test suite
* `/types` Auto-generated by `npm run dts`



## Migration Guide 1.2.x 👉 2.0.0

* Named exports only: 👉 Change `import Quadtree ...` to `import { Quadtree } ...`
* Quadtree constructor: `maxObjects` and `maxLevels` are now named properties. Also, `x` and `y` are now optional. 👉 Change `new Quadtree({x: 0, y: 0, width: 100, height: 100}, 5, 2);` to `new Quadtree({width: 100, height: 100, maxObjects: 5, maxLevels: 2});`
* Objects interacting with the Quadtree need to be a shape class or implement a `qtIndex` method (see above)
* Bundle filename has changed. 👉 Update your script tag from `quadtree.min.js` to `quadtree.umd.basic.js`
* Typescript: no more `Rect` interface. 👉 use `Rectangle` instead


## Dev Todos

* Add integrity hash to script tags
* Update and publish jsdoc/tsdoc
* Add explanations to primitives example
* Add Quadtree.prototype.insertMany
* Add Point class
* Publish to npm
* Add module to retrieve nodes additionally to objects ([#17](https://github.com/timohausmann/quadtree-js/issues/17))
* Add module to update objects [#12](https://github.com/timohausmann/quadtree-js/issues/12)


## Changelog

### 2.0.0

* Refactored Codebase to ES6 and Typescript
* Added modular classes for Rectangle, Circle, Line
* Added dedicated bundle files for CJS, EMS and UMD
* Added Unit Tests with Jest
* Added ESLint
* Added API docs with Typedoc

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

There is a (currently deprecated) [quadtree-js hitman branch](https://github.com/timohausmann/quadtree-js/tree/hitman) available that allows you to update and remove single objects. This may be handy when most of the objects in your Quadtree are static. Please leave an emoji or a comment [here](https://github.com/timohausmann/quadtree-js/issues/12) to put more pressure on the issue.