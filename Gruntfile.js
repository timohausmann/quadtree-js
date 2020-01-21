module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		

		uglify: {
			dist: {
				
				files: {
					'quadtree.min.js': 'quadtree.js'
				},
				options: {
					banner: '/* ⊞ <%= pkg.name %> v<%= pkg.version %> <%= pkg.repository.url %> */\n'
				}
			}
		},

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};