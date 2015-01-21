module.exports = function(grunt) {

	// Load grunt tasks automatically
  	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Configurable paths for the application
	var appConfig = {
	    app: 'app',
	    dist: 'dist'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		appConfig: appConfig,

  		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= appConfig.app %>/scripts/{,*/}*.js'],
				tasks: ['newer:jshint:all'],
				options: {
				  livereload: '<%= connect.options.livereload %>'
				}
			},
			styles: {
				files: [
					'<%= appConfig.app %>/styles/scss/site/{,*/}*.scss'
				],
				tasks: [
					'sass:dev'
				]
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= appConfig.app %>/{,*/}*.html',
					'<%= appConfig.app %>/styles/css/*.css',
					'<%= appConfig.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					middleware: function (connect) {
						return [
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect.static(appConfig.app)
						];
					}
				}
			},
			// test: {
			// 	options: {
			// 		port: 9001,
			// 		middleware: function (connect) {
			// 			return [
			// 				connect.static('.tmp'),
			// 				connect.static('test'),
			// 				connect().use(
			// 					'/bower_components',
			// 					connect.static('./bower_components')
			// 				),
			// 				connect.static(appConfig.app)
			// 			];
			// 		}
			// 	}
			// },
			server: {
				options: {
					open: true,
					base: 'dist'
				}
			}
		},

		// Run some tasks in parallel to speed up the build process
		// concurrent: {
		// 	dev: [
		// 		'newer:jshint',
		// 		'sass:dev'
		// 	]
		// },

    	// Empties folders to start fresh
	    clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= appConfig.dist %>/{,*/}*',
					]
				}]
			},
	    },

	    // Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
					'<%= appConfig.dist %>/scripts/{,*/}*.js',
					'<%= appConfig.dist %>/styles/{,*/}*.css',
					'<%= appConfig.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
					'<%= appConfig.dist %>/styles/fonts/*'
				]
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
	    // concat, minify and revision files. Creates configurations in memory so
	    // additional tasks can operate on them
	    useminPrepare: {
			html: '<%= appConfig.app %>/index.html',
			options: {
				dest: '<%= appConfig.dist %>',
				flow: {
					html: {
						steps: {
							js: ['concat', 'uglifyjs'],
							css: ['cssmin']
						},
						post: {}
					}
				}
			}
	    },

	    // Performs rewrites based on filerev and the useminPrepare configuration
	    usemin: {
			options: {
				assetsDirs: ['<%= appConfig.dist %>', '<%= appConfig.dist %>/images']
			},
			html: ['<%= appConfig.dist %>/{,*/}*.html'],
			css: ['<%= appConfig.dist %>/styles/{,*/}*.css']
	    },

		imagemin: {
			dist: {
				// options: { // Target options
				// 	optimizationLevel: 7
				// },
				files: [{
					expand: true,
					cwd: '<%= appConfig.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= appConfig.dist %>/images'
				}]
			}
		},

		sass: {
			// Настройки для разработки
			dev: {
				options: {
					outputStyle: 'nested',
					sourceMap: true
				},
				files: [{
					'<%= appConfig.app %>/styles/css/style.css': '<%= appConfig.app %>/styles/scss/site/style.scss'
				}]
			},
			// Настройки для продакшна
			// prod: {
			// 	options: {
			// 		outputStyle: 'compressed',
			// 		sourceMap: false
			// 	},
			// 	files: [{
			// 		expand: true,
			// 		cwd: '<%= appConfig.app %>/styles/scss/',
			// 		src: '{,*/}style.scss',
			// 		dest: '<%= appConfig.dist %>/styles/',
			// 		ext: '.css'
			// 	}]
			// }
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				// jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'<%= appConfig.app %>/scripts/{,*/}*.js'
				]
			},
		},

		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: '<%= appConfig.dist %>',
					src: ['*.html', 'views/{,*/}*.html'],
					dest: '<%= appConfig.dist %>'
				}]
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= appConfig.app %>',
					dest: '<%= appConfig.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'views/{,*/}*.html',
						'images/{,*/}*.{webp}',
						'fonts/*'
					]
				}]
			}
		},

		notify: {
		    task_name: {
		    	options: {
		    		// Task-specific options go here.
		    	}
		    },
		    dev: {
				options: {
					message: 'Development environment is set!'
				}
		    },
		    production: {
		    	options: {
					message: 'Ready for production!'
				}
		    }
		}
	});

	grunt.registerTask('build', [
		'newer:jshint',
	    'clean:dist',
	    // 'sass:prod',
	    'useminPrepare',
	    'imagemin',
	    'concat',
	    'copy:dist',
	    'cssmin',
	    'uglify',
	    'filerev',
	    'usemin',
	    'htmlmin',
	    'connect:server:keepalive',
	    'notify:production',
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'sass:dev',
		// 'concurrent:dev', // newer:jshint + sass:dev
	    'connect:livereload',
      	'watch',
      	'notify:dev'
	]);
};
