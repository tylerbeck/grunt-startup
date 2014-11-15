/*
 * grunt-startup
 * https://github.com/tylerbeck/grunt-startup
 *
 * Copyright (c) 2014 Tyler Beck
 * Licensed under the MIT license.
 */

'use strict';

var GruntStartup = require('./classes/GruntStartup.js');

module.exports = new GruntStartup({

        loadTasks: true,
        ignoreTasks: [],
        taskPaths: [],
        configPaths: ['gruntConfig.js'],
        init: function( grunt ){
          // Whenever the "test" task is run, first clean the "tmp" dir, then run this
          // plugin's task(s), then test the result.
          grunt.registerTask('test', ['clean', 'start', 'nodeunit']);

          // By default, lint and run all tests.
          grunt.registerTask('default', ['jshint', 'test']);
        }

});
