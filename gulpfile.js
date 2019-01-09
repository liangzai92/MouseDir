const path = require("path");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

// =============================================================
// babel
var src_js_dir = path.join(__dirname, "src/**/*.js");
gulp.task("babel", function() {
  return (
    gulp
      .src(src_js_dir)
      .pipe(plumber())
      // .pipe(sourcemaps.init())
      .pipe(babel())
      // .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist"))
  );
});

gulp.task("babel:watch", function() {
  gulp.watch(src_js_dir, gulp.series("babel"));
});

// =============================================================
// sass
var src_sass_dir = path.join(__dirname, "src/**/*.scss");

gulp.task("sass", function() {
  let plugins = [
    autoprefixer({
      browsers: [
        "last 2 versions",
        "Android >= 4",
        "iOS >= 8",
        "Firefox >= 20",
        "ie 6-11"
      ]
    })
  ];
  return (
    gulp
      .src(src_sass_dir)
      .pipe(plumber())
      // .pipe(sourcemaps.init())
      .pipe(
        sass({
          outputStyle: "expanded" // compact | compressed | expanded | nested
        }).on("error", sass.logError)
      )
      .pipe(postcss(plugins))
      // .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist"))
  );
});

gulp.task("sass:watch", function() {
  gulp.watch(src_sass_dir, gulp.series("sass"));
});

// =============================================================
// copy
var copy_dir = path.join(__dirname, "src/**/*.html");
var copy_dest = path.join(__dirname, "dist");

gulp.task("copy", function() {
  return gulp.src(copy_dir).pipe(gulp.dest(copy_dest));
});

gulp.task("copy:watch", function() {
  gulp.watch(copy_dir, gulp.series("copy"));
});

// =============================================================
// task
gulp.task("build", gulp.parallel("sass", "babel", "copy"));
gulp.task("dev", gulp.parallel("sass:watch", "babel:watch", "copy:watch"));
