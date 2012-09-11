/*
 * Javascript Quadtree 
 * @version 1.0
 * @author Timo Hausmann
 * https://github.com/timohausmann/quadtree-js/
 */
 
/*
 Copyright © 2012 Timo Hausmann

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function(w, M) {
 	
	 /*
	  * Quadtree Constructor
	  * @param Object bounds		bounds of the node, object with x, y, width, height
	  * @param Integer max_objects		(optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
	  * @param Integer max_levels		(optional) total max levels inside root Quadtree (default: 4) 
	  * @param Integer level		(optional) deepth level, required for subnodes  
	  */
	function Quadtree( bounds, max_objects, max_levels, level ) {
		
		var t = this;
		
		t.max_objects	= max_objects || 10;
		t.max_levels	= max_levels || 4;
		
		t.level 	= level || 0;
		t.bounds 	= bounds;
		
		t.objects 	= [];
		t.nodes 	= [];
	};
	
	
	
	/*
	 * Split the node into 4 subnodes
	 */
	Quadtree.prototype.split = function() {
		
		var 	t 		= this,
			nextLevel	= t.level+1,
			subWidth	= M.round( t.bounds.width / 2 ),
			subHeight 	= M.round( t.bounds.height / 2 ),
			x 		= M.round( t.bounds.x ),
			y 		= M.round( t.bounds.y );		
	 
	 	//top right node
		t.nodes[0] = new Quadtree({
			x	: x + subWidth, 
			y	: y, 
			width	: subWidth, 
			height	: subHeight
		}, t.max_objects, t.max_levels, nextLevel);
		
		//top left node
		t.nodes[1] = new Quadtree({
			x	: x, 
			y	: y, 
			width	: subWidth, 
			height	: subHeight
		}, t.max_objects, t.max_levels, nextLevel);
		
		//bottom left node
		t.nodes[2] = new Quadtree({
			x	: x, 
			y	: y + subHeight, 
			width	: subWidth, 
			height	: subHeight
		}, t.max_objects, t.max_levels, nextLevel);
		
		//bottom right node
		t.nodes[3] = new Quadtree({
			x	: x + subWidth, 
			y	: y + subHeight, 
			width	: subWidth, 
			height	: subHeight
		}, t.max_objects, t.max_levels, nextLevel);
	};
	
	
	/*
	 * Determine which node the object belongs to
	 * @param Object pRect		bounds of the area to be checked, with x, y, width, height
	 * @return Integer		index of the subnode (0-3), or -1 if pRect cannot completely fit within a subnode and is part of the parent node
	 */
	Quadtree.prototype.getIndex = function( pRect ) {
		
		var 	t 			= this,
			index 			= -1,
			verticalMidpoint 	= t.bounds.x + (t.bounds.width / 2),
			horizontalMidpoint 	= t.bounds.y + (t.bounds.height / 2),
	 
			//pRect can completely fit within the top quadrants
			topQuadrant = (pRect.y < horizontalMidpoint && pRect.y + pRect.height < horizontalMidpoint),
			
			//pRect can completely fit within the bottom quadrants
			bottomQuadrant = (pRect.y > horizontalMidpoint);
		 
		//pRect can completely fit within the left quadrants
		if( pRect.x < verticalMidpoint && pRect.x + pRect.width < verticalMidpoint ) {
			if( topQuadrant ) {
				index = 1;
			} else if( bottomQuadrant ) {
				index = 2;
			}
			
		//pRect can completely fit within the right quadrants	
		} else if( pRect.x > verticalMidpoint ) {
			if( topQuadrant ) {
				index = 0;
			} else if( bottomQuadrant ) {
				index = 3;
			}
		}
	 
		return index;
	};
	
	
	/*
	 * Insert the object into the node. If the node
	 * exceeds the capacity, it will split and add all
	 * objects to their corresponding subnodes.
	 * @param Object pRect		bounds of the object to be added, with x, y, width, height
	 */
	Quadtree.prototype.insert = function( pRect ) {
		
		var 	t = this,
	 		i = 0,
	 		index;
	 	
	 	//if we have subnodes ...
		if( typeof t.nodes[0] !== 'undefined' ) {
			index = t.getIndex( pRect );
	 
		  	if( index !== -1 ) {
				t.nodes[index].insert( pRect );	 
			 	return;
			}
		}
	 
	 	t.objects.push( pRect );
		
		if( t.objects.length > t.max_objects && t.level < t.max_levels ) {
			
			//split if we don't already have subnodes
			if( typeof t.nodes[0] === 'undefined' ) {
				t.split();
			}
			
			//add all objects to there corresponding subnodes
			while( i < t.objects.length ) {
				
				index = t.getIndex( t.objects[ i ] );
				
				if( index !== -1 ) {					
					t.nodes[index].insert( t.objects.splice(i, 1)[0] );
				} else {
					i = i + 1;
			 	}
		 	}
		}
	 };
	 
	 
	 /*
	 * Return all objects that could collide with the given object
	 * @param Object pRect		bounds of the object to be checked, with x, y, width, height
	 * @Return Array		array with all detected objects
	 */
	Quadtree.prototype.retrieve = function( pRect ) {
	 	
		var 	t = this,
			index = t.getIndex( pRect ),
			returnObjects = t.objects;
			
		//if we have subnodes ...
		if( typeof t.nodes[0] !== 'undefined' ) {
			
			//if pRect fits into a subnode ..
			if( index !== -1 ) {
				returnObjects = returnObjects.concat( t.nodes[index].retrieve( pRect ) );
				
			//if pRect does not fit into a subnode, check it against all subnodes
			} else {
				for( var i=0; i < t.nodes.length; i=i+1 ) {
					returnObjects = returnObjects.concat( t.nodes[i].retrieve( pRect ) );
				}
			}
		}
	 
		return returnObjects;
	};
	
	
	/*
	 * Clear the quadtree
	 */
	Quadtree.prototype.clear = function() {
		
		var 	t = this;
		
		t.objects = [];
	 
		for( var i = 0; i < t.nodes.length; i=i+1 ) {
			if( typeof t.nodes[i] !== 'undefined' ) {
				t.nodes[i].clear();
				delete t.nodes[i];
		  	}
		}
	};

	//make Quadtree available in the global namespace
	w.Quadtree = Quadtree;	

})(window, Math);