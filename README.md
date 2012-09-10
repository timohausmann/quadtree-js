quadtree-js
===========

This is a Javascript Quadtree implementation of the Java Methods descriped in this tutorial:
http://gamedev.tutsplus.com/tutorials/implementation/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space/


Simple Demo (same as examples/insert_retrieve.html):
http://jsfiddle.net/2dchA/2/

* red squares represent Quadtree Nodes
* white squares represent Objects in our Quadtree
* green square represents the area we "recieve" (move mouse to change position) 
* the highlighted white squares are returned from the recieve-function

*How to use*

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