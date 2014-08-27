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
                dest : '<%= config.dist %>/js/<%= pkg.name %>.js'
            }
        },
        uglify : { 
            options : { 
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },  
            dist : { 
                files : { 
                    '<%= config.dist %>/js/<%= pkg.name %>.min.js' : [ '<%= concat.dist.dest %>' ]
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
            minesweeper: {
                src : '<%= config.src %>/**/*.js',
                options: {
                    specs : 'spec/**/*Spec.js',
                    helpers : 'spec/helpers/*.js'
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