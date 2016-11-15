module.exports = function(grunt) {

  grunt.initConfig({
    /*jshint: {
      files: ['bimassure.js'],
      options: {
        globals: {
          jQuery: false
        }
      }
    },
    jsdoc : {
        dist : {
            src: ['bimassure.js'],
            options: {
                destination: 'dist/docs',
                template: 'docfiles/template/minami-master',
                readme: 'Readme.md',
                tutorials: 'docfiles/tutorials'
            }
        }
    },
    uglify: {
        my_target: {
            files: {
                'dist/bimassure.min.js': ['BIMAssure.js']
            }
        }
    },*/
    jasmine_node: {
        options: {
          forceExit: true,
          match: '.',
          matchall: false,
          extensions: 'js',
          specNameMatcher: 'spec'
        },
        all: ['spec/']
    },
    /*copy: {
        main: {
            files: [
                {src: ['package.json'], dest: 'dist/'},
                {src: ['docfiles/BALogo.png'], dest: 'dist/docs/images/BALogo.png'}
            ],
        }
      },
    clean: ['dist']*/
  });

  /*grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');*/
  grunt.loadNpmTasks('grunt-jasmine-node');
  /*grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jshint', 'jasmine_node']);
  grunt.registerTask('build', ['clean','jsdoc', 'uglify', 'copy']);
  grunt.registerTask('test', ['jshint', 'jasmine_node']);*/
  grunt.registerTask('test', ['jasmine_node']);

};