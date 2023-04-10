var babel = require("gulp-babel")
var gulp = require("gulp")
var uglify = require('gulp-uglify');        //    ----- //压缩JS
// var cssmin = require('gulp-cssmin');        //-----//压缩CSS
// var imagemin = require('gulp-imagemin');// ----- //压缩图片
// var htmlmin = require('gulp-htmlmin'); 　// -----//压缩html
// var rename = require('gulp-rename'); 　//　-----//重命名

gulp.task('uglify', function (done) {
 gulp.src('./package/index.js')
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest('./dist'))
 done()
})