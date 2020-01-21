# quadtree-js

This is a JavaScript Quadtree implementation of the Java Methods described on [gamedevelopment.tutsplus.com by Steven Lambert](https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374):

> Many games require the use of collision detection algorithms to determine when two objects have collided, but these algorithms are often expensive operations and can greatly slow down a game. One way to speed things up is to reduce the number of checks that have to be made. Two objects that are at opposite ends of the screen can not possibly collide, so there is no need to check for a collision between them. This is where a quadtree comes into play.

Please read the tutorial for a better understanding.

## Demos

* [Simple Demo](http://timohausmann.de/quadtree.js/simple.html) – add static objects and see the Quadtree split
* [Dynamic Demo](http://timohausmann.de/quadtree.js/dynamic.html) – continuously track moving objects

## Install

Now you also can add this module via npm to your project and import or require it:

    npm install quadtree-js --save-dev

    import Quadtree from 'quadtree-js';

Alternatively, [download the source](https://github.com/timohausmann/quadtree-js/archive/master.zip) and include it the old-fashioned way:

    <script src="quadtree.min.js"></script>

## How to use

Create a new Quadtree with default values for max_objects (10) and max_levels (4)
<pre>
var myTree = new Quadtree({
	x: 0,
	y: 0,
	width: 400,
	height: 300
});
</pre>

> MAX_OBJECTS defines how many objects a node can hold before it splits and MAX_LEVELS defines the deepest level subnode.

If you want to specify max_objects and max_levels on your own, you can pass them as a 2nd and 3rd argument
<pre>
var myTree = new Quadtree({
	x: 0,
	y: 0,
	width: 800,
	height: 600
}, 5, 8);
</pre> 

Insert an element in the Quadtree
<pre>
myTree.insert({
	x: 200,
	y: 150,
	width: 20,
	height: 20
});
</pre>

Retrieve elements that "collide" with the given bounds
<pre>
var elements = myTree.retrieve({
	x: 150,
	y: 100,
	width: 20,
	height: 20
});
</pre>

Clear the Quadtree
<pre>
myTree.clear();
</pre>

Check out the examples for more information.

There is an alternative [quadtree-js hitman branch](https://github.com/timohausmann/quadtree-js/tree/hitman) available that allows you to update and remove single objects.
This can be handy when most of the objects in your Quadtree are static.