module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        config : {
            destination : 'js/',
        },
        bower : {
            dev : {
                dest : '<%= config.destination %>',
                options : {
                    stripAffix : false
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