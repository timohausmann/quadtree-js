module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			dist: {
				files: {
					'quadtree.min.js': 'quadtree.js'
				}
			}
		},

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};