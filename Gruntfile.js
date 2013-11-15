module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          sourcemap: false
        },
        files: {
          'stylesheets/css/main.css': 'stylesheets/sass/main.scss',
          'stylesheets/css/main-small.css': 'stylesheets/sass/main-small.scss'
        }
      }
    },

    watch: {
      stylesheets: {
        files: ['stylesheets/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      },
      javascripts: {
        files: ['javascripts/**/*.js'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['index.html', 'small.html'],
        options: {
          livereload: true
        }
      }
    },

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 8080,
          base: '.',
          livereload: true
        }
      }
    }
  });

  // Modules
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Tasks
  grunt.registerTask('default', ['connect', 'watch']);
};
