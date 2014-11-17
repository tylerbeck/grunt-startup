# grunt-startup

> Grunt plugin and configuration loader

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-startup --save-dev
```

Once the plugin has been installed, update your GruntFile as follows:
####streamlined version
```js
module.exports = new require('grunt-startup')( { configPaths:[ "./grunt/config" ] } );
```


####readable version with all options
```js
var GruntStartup = require('grunt-startup');

module.exports = new GruntStartup( {

		//load npm tasks
		loadTasks: true,

		//list of tasks not to auto-load
		ignoreTasks: []

		//array of or single directory path in which grunt tasks have been defined
        taskPaths: ["./grunt/tasks"],

		//array of or single  path in which grunt configuration objects have been defined, directories or files
        configPaths: ["./grunt/config"],

		//inline grunt tasks and other initialization logic can go in this method
		init: function( grunt ){

		}
} );
```



### Overview
TODO


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
