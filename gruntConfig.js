module.exports = {
	jshint: {
		all: [
			'Gruntfile.js',
			'classes/*.js',
			'tasks/*.js',
			'<%= nodeunit.tests %>'
		],
		options: {
			jshintrc: '.jshintrc'
		}
	},

	// Before generating any new files, remove any previously-created files.
	clean: {
		tests: ['tmp']
	},

	// Configuration to be run (and then tested).
	start: {

	},

	// Unit tests.
	nodeunit: {
		tests: ['test/*_test.js']
	}

};
