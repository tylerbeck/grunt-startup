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
	},

	bump: {
		options: {
			files: ['package.json'],
			updateConfigs: [],
			commit: true,
			commitMessage: 'Release v%VERSION%',
			commitFiles: ['package.json'],
			createTag: true,
			tagName: 'v%VERSION%',
			tagMessage: 'Version %VERSION%',
			push: false,
			pushTo: 'upstream',
			gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
			globalReplace: false,
			prereleaseName: false,
			regExp: false
		}
	}


};
