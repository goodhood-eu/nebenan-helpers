const gulp = require('gulp');

const BUILD_LOCATION = `${__dirname}/${config.build.assets_location}`;

gulp.task('clean', () => require('del')([BUILD_LOCATION]));
gulp.task('lint', () => require('./build/linters')().lintRun());
gulp.task('lint:scripts', () => require('./build/linters')().lintScripts());
gulp.task('lint:tofile', () => require('./build/linters')().lintRun({ toFile: true }));
gulp.task('default', ['clean'], () => require('./build/scripts')());
