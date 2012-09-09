;(function(w, M) {
 	
	 /*
	  * Constructor
	  */
	function Quadtree( level, bounds ) {
		
		var t = this;
		
		t.MAX_OBJECTS	= 10;
		t.MAX_LEVELS	= 5;
		
		t.level 	= level;
		t.bounds 	= bounds;
		
		t.objects 	= [];
		t.nodes 	= [];
	};
	
	
	
	
	/*
	 * Splits the node into 4 subnodes
	 */
	Quadtree.prototype.split = function() {
		
		var 	t 		= this,
			nextLevel	= t.level+1,
			subWidth	= M.round( t.bounds.width / 2 ),
			subHeight 	= M.round( t.bounds.height / 2 ),
			x 		= M.round( t.bounds.x ),
			y 		= M.round( t.bounds.y );
					
		if( typeof t.nodes[0] !== 'undefined' ) {
			return;
		}
	 
		t.nodes[0] = new Quadtree( nextLevel, {
			x	: x + subWidth, 
			y	: y, 
			width	: subWidth, 
			height	: subHeight
		});
		t.nodes[1] = new Quadtree( nextLevel, {
			x	: x, 
			y	: y, 
			width	: subWidth, 
			height	: subHeight
		});
		t.nodes[2] = new Quadtree( nextLevel, {
			x	: x, 
			y	: y + subHeight, 
			width	: subWidth, 
			height	: subHeight
		});
		t.nodes[3] = new Quadtree( nextLevel, {
			x	: x + subWidth, 
			y	: y + subHeight, 
			width	: subWidth, 
			height	: subHeight
		});
	};
	
	
	/*
	 * Determine which node the object belongs to. -1 means
	 * object cannot completely fit within a child node and is part
	 * of the parent node
	 */
	Quadtree.prototype.getIndex = function( pRect ) {
		
		var 	t 			= this,
			index 			= -1,
			verticalMidpoint 	= t.bounds.x + (t.bounds.width / 2),
			horizontalMidpoint 	= t.bounds.y + (t.bounds.height / 2),
	 
			// Object can completely fit within the top quadrants
			topQuadrant = (pRect.y < horizontalMidpoint && pRect.y + pRect.height < horizontalMidpoint),
			
			// Object can completely fit within the bottom quadrants
			bottomQuadrant = (pRect.y > horizontalMidpoint);
		 
		// Object can completely fit within the left quadrants
		if( pRect.x < verticalMidpoint && pRect.x + pRect.width < verticalMidpoint ) {
			if( topQuadrant ) {
				index = 1;
			} else if( bottomQuadrant ) {
				index = 2;
			}
			
		// Object can completely fit within the right quadrants	
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
	 * Insert the object into the quadtree. If the node
	 * exceeds the capacity, it will split and add all
	 * objects to their corresponding nodes.
	 */
	Quadtree.prototype.insert = function( pRect ) {
		
		var 	t = this,
	 		i = 0,
	 		index;
	 	
	 	//if we have childnodes ...
		if( typeof t.nodes[0] !== 'undefined' ) {
			index = t.getIndex( pRect );
	 
		  	if( index !== -1 ) {
				t.nodes[index].insert( pRect );	 
			 	return;
			}
		}
	 
	 	t.objects.push( pRect );
		
		if( t.objects.length > t.MAX_OBJECTS && t.level < t.MAX_LEVELS ) {
			
			t.split();
			
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
	 */
	
	 Quadtree.prototype.retrieve = function( returnObjects, pRect ) {
	 	
		var 	t = this,
			index = t.getIndex( pRect );
			
			
		if( index !== -1 && typeof t.nodes[0] !== 'undefined' ) {
			t.nodes[index].retrieve( returnObjects, pRect );
		}
	 
		returnObjects.push( t.objects );
	 
		return returnObjects;
	 };
	
	
	/*
	 * Clears the quadtree
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

	w.Quadtree = Quadtree;	

})(window, Math);