/***********************************************************************
 * Grunt Loader
 * Author: Copyright 2012-2014, Tyler Beck
 * License: MIT
 ***********************************************************************/

/**
 * Creates an grunt loader
 * @param npmTasks
 * @param taskDirectories
 * @param configDirectories
 * @param initFn
 * @returns {Function}
 */
module.exports = function( npmTasks, taskDirectories, configDirectories, initFn ){
	'use strict';

	/*================================================
	 * Dependencies
	 *===============================================*/
	var _ = require('lodash');
	var matchdep = require('matchdep');
	var path = require('path');
	var glob = require('glob');


	/*================================================
	 * Private Methods
	 *===============================================*/
	/**
	 * loads any modules prefixed with 'grunt-' listed in
	 * package.json's devDependencies
	 * @param grunt {{}}
	 */
	function loadNpmTasks( grunt ) {
		grunt.verbose.writeln( 'Loading grunt tasks from dev dependencies: '+npmTasks );
		grunt.verbose.writeln( '  cwd: '+process.cwd() );
		if ( npmTasks ) {
			//get dependencies from current working directory
			var matches = matchdep.filterDev( 'grunt-*', path.join( process.cwd(), '/package.json' ) );
			grunt.verbose.writeln( '['+matches.join(', ')+']' );
			matches.forEach( function( item ) {
				if ( item != "grunt-cli" ) {
					grunt.verbose.writeln( '  '+npmTasks );
					grunt.loadNpmTasks( item );
				}
			} );
		}
	}

	/**
	 * loads tasks from specifed  path
	 * @param grunt {{}}
	 * @param dirs {Array|String}
	 */
	function loadCustomTasks( grunt, dirs ){
		if ( dirs != undefined ){
			//cast to array if value is string
			if (typeof dirs == "string")
				dirs = [ dirs ];

			//iterate directories and load tasks
			dirs.forEach( function( dir ){
				if ( grunt.file.isDir( dir ) ){
					grunt.loadTasks( dir );
				}
				else{
					grunt.log.error( 'error loading tasks: '+dir+' does not appear to be a directory.' );
				}
			});
		}
	}

	/**
	 * creates a configuration object from files in specifed config directory
	 * @param grunt {{}}
	 * @param dirs {Array|String}
	 * @returns {{}}
	 */
	function getConfiguration( grunt, dirs ){
		//configuration object
		var config = {};

		if ( dirs != undefined ) {
			//cast to array if value is string
			if ( typeof dirs == "string" )
				dirs = [ dirs ];

			dirs.forEach( function( dir ) {
				grunt.verbose.writeln("");
				grunt.verbose.writeln("Registering "+dir+" configruations.");
				var options;
				glob.sync( '*', {cwd: dir} ).forEach( function( option ) {
					var resolvedPath = path.join( process.cwd(), dir, option );
					grunt.verbose.writeln( "Loading: " + resolvedPath );
					switch ( path.extname( option ) ){
						case '.json':
							options = grunt.file.readJSON( resolvedPath );
							break;

						case '.js':
							options = require( resolvedPath );
							break;
					}

					//merge options into config config
					_.merge( config, options );
				} );
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

		//load tasks defined via package.json
		loadNpmTasks( grunt );

		//load custom tasks
		loadCustomTasks( grunt, taskDirectories );

		//initialize grunt config
		var config = getConfiguration( grunt, configDirectories );
		grunt.verbose.writeln('BEGIN CONFIGURATION ------------------------------------');
		grunt.verbose.writeln( JSON.stringify( config, undefined, "  " ) );
		grunt.verbose.writeln('END CONFIGURATION --------------------------------------');
		grunt.initConfig( config );

		if (initFn && typeof initFn == 'function')
			initFn( grunt );

	};

};
