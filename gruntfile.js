module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['SW_API.js'],
      options: {
        globals: {
          jQuery: false
        }
      }
    },
    jsdoc : {
        dist : {
            src: ['SW_API.js'],
            options: {
                destination: 'docs',
                template: 'docfiles/template/minami-master',
                readme: 'Readme.md',
            }
        }
    },
    uglify: {
        options : {
            preserveComments: 'some'
        },
        my_target: {
            files: {
                'dist/sw_api.min.js': ['SW_API.js']
            }
        }
    },
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
                {src: [''], dest: 'dist/'},
                {src: [''], dest: 'dist/'}
            ],
        }
      },*/
    clean: ['dist']
  });

  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jasmine-node');
  //grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jshint', 'jasmine_node']);
  grunt.registerTask('build', ['jshint', 'clean', 'uglify', 'docs']);
  grunt.registerTask('test', ['jshint', 'jasmine_node']);
  grunt.registerTask('docs', ['jsdoc']);


};