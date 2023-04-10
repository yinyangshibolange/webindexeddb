const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

exports.default = function() {
  return src('package/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('output/'));
}