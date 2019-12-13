const gulp = require('gulp'); // сборщик проекта
const autoprefixer = require('gulp-autoprefixer'); // расставляет префиксы для разных браузеров 
const del = require('del'); // удаляет старый проект, перед сборкой
const browserSync = require('browser-sync').create(); // автообновление браузера при изменение кода
const cleanCSS = require('gulp-clean-css'); // удаляет лишние пробелы, табы, комментарии, объеденяет одинаковый цсс
const sourcemaps = require('gulp-sourcemaps'); // расшифровка сжатого файла
const gulpif = require('gulp-if'); // хитрая штука
const gcmq = require('gulp-group-css-media-queries'); // соединение медиа запросов
const less = require('gulp-less'); // препроцессор
const concat = require('gulp-concat'); // объединение файлов в один
const uglify = require('gulp-uglify'); // сжатие файлов js
const imagemin = require('gulp-imagemin'); // сжатие картинок
const babel = require('gulp-babel'); // перегоняет js в старый стандарт для кроссбраузерной поддержки


const development = (process.argv.indexOf('--development') !== -1);
const production = !development;
const synchronization = (process.argv.indexOf('--synchronization') !== -1);

function clear(){
	return del('build/*');
}

function styles() {
    return gulp.src('./src/css/styles.less')
                .pipe(gulpif(development, sourcemaps.init()))
                .pipe(less())
                .pipe(gcmq())
                .pipe(autoprefixer({
                    overrideBrowserslist: ['> 0.1%'],
                    cascade: false
                }))
                .pipe(gulpif(production, cleanCSS({
                        level: 2
                })))
                .pipe(gulpif(development, sourcemaps.write()))
                .pipe(gulp.dest('./build/css'))
                .pipe(gulpif(synchronization, browserSync.stream()));
}

function img(){
	return gulp.src('./src/img/**/*')
			   .pipe(imagemin())
			   .pipe(gulp.dest('./build/img'))
}

function fonts(){
	return gulp.src('./src/fonts/**/*')
			   .pipe(gulp.dest('./build/fonts'))
}

function html(){
	return gulp.src('./src/*.html')
               .pipe(gulp.dest('./build'))
               .pipe(gulpif(synchronization, browserSync.stream()));
}

function scripts(){
	return gulp.src('./src/js/*.js')
			   .pipe(gulpif(development, sourcemaps.init()))
			   .pipe(babel({
				   presets: ['@babel/preset-env']
			   }))
			   .pipe(concat('main.js'))
			   .pipe(gulpif(production, uglify({
				   toplevel: true
			   }))) 
			   .pipe(gulpif(development, sourcemaps.write()))
			   .pipe(gulp.dest('./build/js'))
			   .pipe(gulpif(synchronization, browserSync.stream()));
}

function watch(){
	if(synchronization){
		browserSync.init({
	        server: {
	            baseDir: "./build/",
	        }
	    });
	}

	gulp.watch('./src/css/**/*.less', styles);
	gulp.watch('./src/js/*.js', scripts);
	gulp.watch('./src/**/*.html', html);
}

let build = gulp.series(clear, gulp.parallel(styles, img, html, scripts, fonts));

gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));