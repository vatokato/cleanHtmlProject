var gulp = require('gulp'),
    watch = require('gulp-watch'),
    rimraf = require('rimraf'),
    rigger = require('gulp-rigger'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),

    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),

    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),

    browserSync = require('browser-sync'),
    notify = require("gulp-notify");

/*
nmp install gulp-cli -g  - установка глобального окружения
npm install gulp -D
npm -v
npm init
npm install gulp-scss -D

npm install - обновить из package.json

1. gulp.task() - новая задача
2. gulp.src()  - отвечает за выборку файлов
3. gulp.dest() = определяет выходную дерикторимю файла
4. gulp.watch() - отслеживание в реал тайм
 */

var path = {
    app: {
        html: 'app/*.html',
        js: 'app/js/main.js',
        style: 'app/style/main.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/style/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('html:build', function () {
    gulp.src(path.app.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({stream: true})); //И перезагрузим наш сервер для обновлений
});
gulp.task('style:build', function () {
    gulp.src(path.app.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('js:build', function(){
    gulp.src(path.app.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('img:build', function () {
    gulp.src(path.app.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'img:build'
]);

gulp.task('watch', function () {
    gulp.watch([path.watch.html],   ['html:build']);
    gulp.watch([path.watch.style],  ['style:build']);
    gulp.watch([path.watch.js],     ['js:build']);
    gulp.watch([path.watch.fonts],  ['fonts:build']);
    gulp.watch([path.watch.img],    ['img:build']);
});

gulp.task('server', function () {
    browserSync({
        server:{
            baseDir:'./build/'
        }
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'server', 'watch']);

