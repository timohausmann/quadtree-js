# quadtree-js

This is a JavaScript Quadtree implementation of the Java Methods described in this tutorial:
http://gamedev.tutsplus.com/tutorials/implementation/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space/

This is not a collision engine, but an algorithm to narrow down objects of possible collision. 

Please read the tutorial if you want to know more about Quadtrees.

There are two examples: [simple](http://timohausmann.de/quadtree.js/simple.html) and [dynamic](http://timohausmann.de/quadtree.js/dynamic.html). 

* red squares represent Quadtree Nodes
* empty white squares represent objects in our Quadtree
* the cursor is the area we constantly test for
* objects turned green are candidates for collision, returned from the receive-function

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
	x : 200,
	y : 150,
	width : 20,
	height : 20
});
</pre>

Retrieve elements that "collide" with the given bounds
<pre>
var elements = myTree.retrieve({
	x : 150,
	y : 100,
	width : 20,
	height : 20
});
</pre>

Clear the Quadtree
<pre>
myTree.clear();
</pre>

Check out the examples for more information.
Feel free to open an issue if you have any problems.

There is an alternative [quadtree-js hitman branch](https://github.com/timohausmann/quadtree-js/tree/hitman) available that allows you to update and remove single objects.
This can be handy when most of the objects in your Quadtree are static.
