quadtree-js
===========

This is an implementation of the Java Methods descriped in this tutorial:
http://gamedev.tutsplus.com/tutorials/implementation/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space/


Simple Demo (same as examples/insert_retrieve.html):
http://jsfiddle.net/2dchA/

- red squares represent Quadtree Nodes
- white squares represent Objects in our Quadtree
- green square represents the area we "recieve" (move mouse to change position) 
- the highlighted white squares are returned from the recieve-function

As you can see, this works well when the green square is fully inside a red node.
As soon as the green square touches the border of a red node, recieve function does not return the desired result ... 

