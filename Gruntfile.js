module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        config: {
            dist: 'dist',
            src: 'src',
            test: 'spec'
        },
        concat : {
            options : {
                separator : ';'
            },
            dist : {
                src : [ '<%= config.src %>/**/*.js' ],
                dest : '<%= config.dist %>/<%= pkg.name %>.js'
            }
        },
        uglify : { 
            options : { 
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },  
            dist : { 
                files : { 
                    '<%= config.dist %>/<%= pkg.name %>.min.js' : [ '<%= concat.dist.dest %>' ]
                }   
            },  
        },
        jshint: {
            files: ['gruntfile.js', '<%= config.src %>/**/*.js', 'spec/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
              }   
            }   
        }, 
        jasmine : {
            retrato: {
                src : '<%= config.src %>/**/*.js',
                version: '2.0.0',
                tasks: 'jasmine:pivotal:build',
                options: {
                    keepRunner: true,
                    specs : 'spec/**/*Spec.js',
                    helpers : 'spec/helpers/*.js',
                    vendor: [
                       'bower_components/jquery/dist/jquery.js',
                       'bower_components/mustache.js/mustache.js',
                       'bower_components/watch/src/watch.js',
                    ]
                }
            }
        },
        watch: {
            scripts: {
                files: ['<%= config.src %>/**/*'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        },
        clean: ['<%= config.dist %>']
    });

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'uglify']);
    grunt.registerTask('test', ['jshint', 'jasmine']);
};