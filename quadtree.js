/*
 * Javascript Quadtree 
 * @version 1.2.b
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
NONINFRINGEMENthis. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function(window, Math) {
 	
	 /*
	  * Quadtree Constructor
	  * @param Object bounds			bounds with x, y, width, height
	  * @param Integer max_objects		(optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
	  * @param Integer max_levels		(optional) total max levels inside root Quadtree (default: 4) 
	  * @param Integer level			(optional) deepth level, required for subnodes  
	  */
	function Quadtree( bounds, max_objects, max_levels, level ) {
		
		this.max_objects	= max_objects || 10;
		this.max_levels		= max_levels || 4;
		
		this.level 			= level || 0;
		this.bounds 		= bounds;
		
		this.objects 		= [];
		this.object_refs	= [];
		this.nodes 			= [];
	};
	
	
	/*
	 * Split the node into 4 subnodes
	 */
	Quadtree.prototype.split = function() {
		
		var nextLevel	= this.level + 1,
			subWidth	= Math.round( this.bounds.width / 2 ),
			subHeight 	= Math.round( this.bounds.height / 2 ),
			x 			= Math.round( this.bounds.x ),
			y 			= Math.round( this.bounds.y );		
	 
	 	//top right node
		this.nodes[0] = new Quadtree({
			x	: x + subWidth, 
			y	: y, 
			width	: subWidth, 
			height	: subHeight
		}, this.max_objects, this.max_levels, nextLevel);
		
		//top left node
		this.nodes[1] = new Quadtree({
			x	: x, 
			y	: y, 
			width	: subWidth, 
			height	: subHeight
		}, this.max_objects, this.max_levels, nextLevel);
		
		//bottom left node
		this.nodes[2] = new Quadtree({
			x	: x, 
			y	: y + subHeight, 
			width	: subWidth, 
			height	: subHeight
		}, this.max_objects, this.max_levels, nextLevel);
		
		//bottom right node
		this.nodes[3] = new Quadtree({
			x	: x + subWidth, 
			y	: y + subHeight, 
			width	: subWidth, 
			height	: subHeight
		}, this.max_objects, this.max_levels, nextLevel);
	};
	
	
	/*
	 * Determine the quadtrant for an area in this node
	 * @param Object pRect		bounds of the area to be checked, with x, y, width, height
	 * @return Integer			index of the subnode (0-3), or -1 if pRect cannot completely fit within a subnode and is part of the parent node
	 */
	Quadtree.prototype.getIndex = function( pRect ) {
		
		var index 				= -1,
			verticalMidpoint 	= this.bounds.x + (this.bounds.width / 2),
			horizontalMidpoint 	= this.bounds.y + (this.bounds.height / 2),
	 
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
	 * Insert an object into the node. If the node
	 * exceeds the capacity, it will split and add all
	 * objects to their corresponding subnodes.
	 * @param Object obj		the object to be added, with x, y, width, height
	 */
	Quadtree.prototype.insert = function( obj ) {
		
		var i = 0,
	 		index;
	 	
	 	//if we have subnodes ...
		if( typeof this.nodes[0] !== 'undefined' ) {
			index = this.getIndex( obj );
	 
		  	if( index !== -1 ) {
				this.nodes[index].insert( obj );	 
			 	return;
			}
		}
	 
	 	this.objects.push( obj );
		
		if( this.objects.length > this.max_objects && this.level < this.max_levels ) {
			
			//split if we don't already have subnodes
			if( typeof this.nodes[0] === 'undefined' ) {
				this.split();
			}
			
			//add all objects to there corresponding subnodes
			while( i < this.objects.length ) {
				
				index = this.getIndex( this.objects[ i ] );
				
				if( index !== -1 ) {					
					this.nodes[index].insert( this.objects.splice(i, 1)[0] );
				} else {
					i = i + 1;
			 	}
		 	}
		}
	 };
	 
	 
	/*
	 * Return all objects that could collide with a given area
	 * @param Object pRect		bounds of the area to be checked, with x, y, width, height
	 * @Return Array			array with all detected objects
	 */
	Quadtree.prototype.retrieve = function( pRect ) {
	 	
		var index = this.getIndex( pRect ),
			returnObjects = this.objects;
			
		//if we have subnodes ...
		if( typeof this.nodes[0] !== 'undefined' ) {
			
			//if pRect fits into a subnode ..
			if( index !== -1 ) {
				returnObjects = returnObjects.concat( this.nodes[index].retrieve( pRect ) );
				
			//if pRect does not fit into a subnode, check it against all subnodes
			} else {
				for( var i=0; i < this.nodes.length; i=i+1 ) {
					returnObjects = returnObjects.concat( this.nodes[i].retrieve( pRect ) );
				}
			}
		}
	 
		return returnObjects;
	};
	
	
	/*
	 * Get all objects stored in the quadtree
	 * @return Array 		all objects in the quadtree
	 */
	Quadtree.prototype.getAll = function() {
		
		var objects = this.objects;

		for( var i=0; i < this.nodes.length; i=i+1 ) {
			objects = objects.concat( this.nodes[i].getAll() );
		}
	 
		return objects;
	};
	
	
	/*
	 * Get the node in which a certain object is stored
	 * @param Object obj		the object that was added via Quadtree.insert
	 * @return Object 			the subnode, or false when not found
	 */
	Quadtree.prototype.getObjectNode = function( obj ) {

		var index;
	 	
	 	//if there are no subnodes, object must be here
	 	if( !this.nodes.length ) {

	 		return this;

	 	} else {

			index = this.getIndex( obj );

			//if the object does not fit into a subnode, it must be here
			if( index === -1 ) {

				return this;

			//if it fits into a subnode, continue deeper search there
			} else {
				var node = this.nodes[index].getObjectNode( obj );	 
			 	if( node ) return node;
			}
		}

		return false;
	};
	
	
	/*
	 * Removes a specific object from the quadtree 
	 * Does not delete empty subnodes. See cleanup-function
	 * @param Object obj		the object that was added via Quadtree.insert
	 * @return Number			false, when the object was not found
	 */
	Quadtree.prototype.removeObject = function( obj ) {
		
		var node = this.getObjectNode( obj ),
			index = node.objects.indexOf( obj );

		if( index === -1 ) return false;

		node.objects.splice( index, 1);
	};
	
	
	/*
	 * Clear the quadtree and delte all objects
	 */
	Quadtree.prototype.clear = function() {
		
		this.objects = [];
	 
		if( !this.nodes.length ) return;

		for( var i=0; i < this.nodes.length; i=i+1 ) {

			this.nodes[i].clear();
	  	}

	  	this.nodes = [];
	};
	
	
	/*
	 * Clean up the quadtree 
	 * Like clear, but objects won't be deleted but re-inserted
	 */
	Quadtree.prototype.cleanup = function() {
		
		var objects = this.getAll();

		this.clear();

		for( var i=0; i < objects.length; i++ ) {
			this.insert( objects[i] );
		}
	};


	//make Quadtree available in the global namespace
	window.Quadtree = Quadtree;	

})(window, Math);