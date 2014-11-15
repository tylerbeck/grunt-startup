/***********************************************************************
 * Grunt Loader
 * Author: Copyright 2012-2014, Tyler Beck
 * License: MIT
 ***********************************************************************/

/**
 * Creates an grunt loader
 * @param opts {{}}
 * @returns {Function}
 */
module.exports = function( opts ){

	//npmTasks, taskDirectories, configDirectories, initFn
	'use strict';

	/*================================================
	 * Dependencies
	 *===============================================*/
	var _ = require('lodash');
	var matchdep = require('matchdep');
	var path = require('path');
	var glob = require('glob');

	//legacy support
	if ( arguments.length > 1 ){
		opts = {
			loadTasks: arguments[0] || false,
			taskPaths: arguments[1] || [],
			configPaths: arguments[2] || [],
			init: arguments[3]
		};
	}

	var options = {
		loadTasks: true,
		ignoreTasks: [],
		taskPaths: [],
		configPaths: [],
		init: function( grunt ){

		}
	};

	//merge in custom settings
	_.merge( options, opts );


	/*================================================
	 * Private Methods
	 *===============================================*/
	/**
	 * loads any modules prefixed with 'grunt-' listed in
	 * package.json's devDependencies that are not in options.ignoreTasks
	 * @param grunt {{}}
	 */
	function loadNpmTasks( grunt ) {

		grunt.verbose.writeln( 'Loading grunt tasks from dev dependencies.' );

		//get dependencies from current working directory's package.json
		var matches = matchdep.filterDev( 'grunt-*', path.join( process.cwd(), '/package.json' ) );
		grunt.verbose.writeln( '['+matches.join(', ')+']' );
		matches.forEach( function( item ) {
			//only load task if not ignored
			if ( options.ignoreTasks.indexOf( item ) < 0 ) {
				grunt.loadNpmTasks( item );
			}
		} );

	}

	/**
	 * loads tasks from specifed paths
	 * @param grunt {{}}
	 * @param paths {Array|String}
	 */
	function loadCustomTasks( grunt, paths ){

		if ( paths !== undefined ){
			//cast to array if value is string
			if (typeof paths === "string"){
				paths = [ paths ];
			}

			//iterate directories and load tasks
			paths.forEach( function( path ){
				if ( grunt.file.isDir( path ) ){
					grunt.loadTasks( path );
				}
				else{
					grunt.log.error( 'error loading tasks: '+path+' does not appear to be a directory.' );
				}
			});
		}

	}

	/**
	 * merge single configuration object into config
	 * @param path
	 * @param config
	 */
	function mergeConfigurationFile( grunt, configPath, config ){
		var options;
		grunt.verbose.writeln( "Loading: " + configPath );
		switch ( path.extname( configPath ) ){
			case '.json':
				options = grunt.file.readJSON( configPath );
				break;

			case '.js':
				options = require( configPath );
				break;
		}
		//merge options into config config
		_.merge( config, options );
	}

	/**
	 * creates a configuration object from files in specifed config directory
	 * @param grunt {{}}
	 * @param paths {Array|String}
	 * @returns {{}}
	 */
	function getConfiguration( grunt, paths ){
		//configuration object
		var config = {};

		if ( paths !== undefined ) {
			//cast to array if value is string
			if ( typeof paths === "string" ){
				paths = [ paths ];
			}

			paths.forEach( function( configPath ) {
				grunt.verbose.writeln("");
				grunt.verbose.writeln("Registering "+configPath+" configruations.");
				if ( grunt.file.isDir( configPath ) ){
					glob.sync( '*', {cwd: configPath} ).forEach( function( option ) {
						var resolvedPath = path.join( process.cwd(), configPath, option );
						mergeConfigurationFile( grunt, resolvedPath, config );
					} );
				}
				else if ( grunt.file.exists( configPath ) ){
					var resolvedPath = path.join( process.cwd(), configPath );
					mergeConfigurationFile( grunt, resolvedPath, config );
				}

				grunt.verbose.writeln("");
			} );
		}

		return config;
	}


	/*================================================
	 * Return Task
	 *===============================================*/
	/**
	 * return grunt module method
	 */
	return function( grunt ){

		if ( options.loadTasks ){
			//load tasks defined via package.json
			loadNpmTasks( grunt );
		}

		//load custom tasks
		loadCustomTasks( grunt, options.taskPaths );

		//load grunt config parts
		var config = getConfiguration( grunt, options.configPaths );

		grunt.verbose.writeln('BEGIN CONFIGURATION ------------------------------------');
		grunt.verbose.writeln( JSON.stringify( config, undefined, "  " ) );
		grunt.verbose.writeln('END CONFIGURATION --------------------------------------');

		//initialize grunt with concatenated configuration
		grunt.initConfig( config );

		if (options.init && typeof options.init === 'function'){
			options.init( grunt );
		}

	};

};
