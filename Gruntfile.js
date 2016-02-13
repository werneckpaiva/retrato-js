module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        config : {
            destination : 'js/',
            css_destination : 'css/',
        },
        bower : {
            dev : {
                dest: '<%= config.destination %>',
                js_dest: '<%= config.destination %>',
                css_dest: '<%= config.css_destination %>',
                options : {
                    stripAffix : false,
                    keepExpandedHierarchy: false,
                    expand: false,
                    packageSpecific : {
                        'headroom.js' : {
                            files : [ "dist/headroom.js" ]
                        },
                        'retrato-js' : {
                            files : [ "dist/retrato-js.js", "dist/retrato.css"]
                        }
                    }
                }
            }
        },
        clean : [ '<%= config.destination %>' ]
    });

    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', [ 'clean', 'bower' ]);
};
