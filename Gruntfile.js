'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // --------------------------------------------------------------------

    /**
     * Collecting files into collections for an easy processing
     * ------------------------------------------
     */
    var configFiles = [
            '<%= myApp.mainFolder %>/*.js'
        ],
        AppScripts = [
            // Directives and page scripts
            '<%= myApp.mainFolder %>/app/**/*.js'
        ],
        lessFiles = [
            '<%= myApp.mainFolder %>/assets/css/less/**/*.less'
        ];

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project Settings
        myApp: {
            // configurable paths
            mainFolder: '.',
            app: 'app',
            dist: 'dist'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            configFiles: {
                files: configFiles,
                tasks: ['lint']
            },
            VDCFiles: {
                files: AppScripts,
                tasks: ['lint']
            },
            less: {
                files: lessFiles,
                tasks: ['less:globalFiles']
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                configFiles,
                AppScripts
            ]
        },

        gjslint: {
            options: {
                reporter: {
                    name: 'console'
                },
                flags: [
                    '--flagfile .gjslintrc' //use flag file'
                ],
                force: false
            },
            all: [
                '<%= myApp.mainFolder %>/*.js',
                '<%= myApp.app %>/*.js',
                '<%= myApp.app %>/**/*.js'
            ]
        },

        // Compile LESS files into CSS
        less: {
            globalFiles: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    relativeUrls: true
                },
                files: {
                    '<%= myApp.mainFolder %>/assets/css/style.css':
                        '<%= myApp.mainFolder %>/assets/css/less/style.less',

                    '<%= myApp.mainFolder %>/assets/css/theme.css':
                        '<%= myApp.mainFolder %>/assets/css/less/theme.less',

                    '<%= myApp.mainFolder %>/assets/css/ui.css':
                        '<%= myApp.mainFolder %>/assets/css/less/ui.less',
                }
            }
        },

        // Build settings
        clean: {
            build: {
                src: ['dist']
            }
        },

        mkdir: {
            build: {
                options: {
                    create: [
                        'dist',
                        'dist/js',
                        'dist/assets',
                        'dist/assets/css',
                        'dist/assets/images',
                        'dist/assets/images/avatars',
                        'dist/assets/images/flags',
                        'dist/assets/images/logo',
                        'dist/assets/images/preloader',
                        'dist/assets/fonts',
                        'dist/assets/libs/bootstrap/fonts/',
                        'dist/locales'
                    ]
                }
            }
        },

        cssmin: {
            target: {
                files: {
                    'dist/assets/css/app.min.css': [
                        'assets/css/style.css',
                        'assets/css/theme.css',
                        'assets/css/ui.css',
                        'assets/libs/bootstrap-loading/lada.min.css',
                        'assets/libs/ng-table/ng-table.css',
                        'assets/libs/tree-control/tree-control-attribute.css',
                        'assets/libs/charts/angular-chart.min.css',
                        'assets/css/angular-theme.css'
                    ]
                }
            }
        },
        concat: {
            css: {
                src: [
                    'assets/css/style.css',
                    'assets/css/theme.css',
                    'assets/css/ui.css',
                    'assets/libs/bootstrap-loading/lada.min.css',
                    'assets/css/angular-theme.css',
                ],
                dest: 'dist/assets/css/app.min.css'
            },

            js: {
                src: [
                    'assets/libs/jquery/jquery-1.11.1.min.js',
                    'assets/libs/json3/lib/json3.min.js',
                    'assets/libs/angular/angular.min.js',
                    'assets/libs/angular-resource/angular-resource.min.js',
                    'assets/libs/angular-cookies/angular-cookies.min.js',
                    'assets/libs/angular-sanitize/angular-sanitize.min.js',
                    'assets/libs/angular-animate/angular-animate.min.js',
                    'assets/libs/angular-route/angular-route.min.js',
                    'assets/libs/angular-bootstrap/ui-bootstrap-tpls-0.12.1.js',
                    'assets/libs/angular-local-storage/angular-local-storage.min.js',
                    'assets/libs/ui-bootstrap/ui-bootstrap-tpls-1.3.2.min.js',
                    'assets/libs/bootstrap/js/bootstrap.min.js',
                    'assets/libs/bootstrap-loading/lada.min.js',
                    'dist/js/app.min.js'
                ],
                dest: 'dist/js/app.min.js'
            }
        },

        uglify: {
            build: {
                src: [
                    // Modules.
                    'app/core/core.js',
                    'app/app.js'
                ],
                dest: 'dist/js/app.min.js'
            }
        },

        copy: {
            index: {
                src: 'app/index.build.tmpl.html',
                dest: 'dist/index.html',
                flatten: true,
                filter: 'isFile'
            },

            favicon: {
                src: 'favicon.png',
                dest: 'dist/favicon.png',
                flatten: true,
                filter: 'isFile'
            }

            /*layout: {
                expand: true,
                cwd: 'app/layout/',
                src: [
                    'footerDrct.html',
                    'layoutDrct.html',
                    'topbarDrct.html'
                ],
                dest: 'dist/js/layout',
                flatten: true,
                filter: 'isFile'
            },

            dashboard: {
                src: 'app/dashboard/dashboard.html',
                dest: 'dist/js/dashboard/dashboard.html',
                flatten: true,
                filter: 'isFile'
            },*/
        },
        replace: {
            images: {
               src: ['dist/js/**/*.html'],
               overwrite: true,
               replacements: [{
                   from: 'src="../assets/images/',
                   to: 'src="assets/images/'
               }]
            },

            icons: {
                src: ['dist/assets/css/app.min.css'],
                overwrite: true,
                replacements: [{
                    from: 'url(/assets/images/',
                    to: 'url(../images/'
                }]
            }
        }
    });

    /**
     * Register main build task
     * ------------------------------------------
     */
    grunt.registerTask('build', [
        'clean:build',
        'mkdir:build',
        'less',
        //'concat:css',
        'cssmin',
        'uglify',
        'concat:js',
        'copy',
        'replace'
    ]);

    grunt.registerTask('lint', [
        'jshint',
        'gjslint'
    ]);
};
