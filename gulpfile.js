/**
 * gulp的默认配置文件，在这面写gulp的任务
 */
var gulp = require('gulp')
// 删除文件和文件夹插件
var del = require('del')
// 合并js插件
var concat = require('gulp-concat')
// 压缩混淆js插件
var uglify = require('gulp-uglify')
// 合并css插件
var concatCss = require('gulp-concat-css')
// 压缩css插件
var cssnano = require('gulp-cssnano')
// 重命名插件
var rename = require("gulp-rename")
// 压缩html插件
var minifyHTML = require('gulp-minify-html')
// 压缩图片插件
var imagemin = require('gulp-imagemin')
// 自动打开浏览器插件
var open = require('gulp-open')
// 消息通知插件
var notify = require("gulp-notify")
// 处理复杂的任务依赖问题
var gulpSequence = require('gulp-sequence')
// 处理sass文件
var sass = require('gulp-sass');
// 自动增加前缀
var autoprefixer = require('gulp-autoprefixer')
// 有了这个插件，concat和gulp-concat插件就可以不用了
var useref=require('gulp-useref')

// 1、名称如果叫default，那么这就是一个默认任务了，当你在一个命令窗口运行的gulp命令的时候，他会自动去找gulpfile.js文件中任务名称叫default的任务去执行
// 2、指定某一个任务去执行，命令就是gulp+任务名
// 3、第二个参数是一个任务的字符串数组，作用就是启动数组中相同名称的任务，不过这几个任务是同时启动的，谁先执行完得看任务里面的工作量，而不是按照顺序执行完毕

// =========================开发任务配置=============================//

// 定义开发配置
gulp.task('develop', ['sequence'], function () {
    gulp.src('dist/index.html')
        .pipe(open({app: 'chrome'}))
        .pipe(notify("项目构建完成！"))
});

// 定义文件变化的监听任务
gulp.task('watch', function () {
    // 一般在开发中这里要执行的是类似于scss，less，es6之类的监听构建
    gulp.watch('src/js/*.js', ['js'])
    gulp.watch('src/css/*.css', ['css'])
    gulp.watch('src/scss/*.scsss', ['scss','css'])
    gulp.watch('src/*.html', ['html'])
})


// brower-sync



// =========================部署任务配置=============================//
// 定义部署配置
gulp.task('build', ['sequence'], function () {
    gulp.src('dist/index.html')
        .pipe(open({app: 'chrome'}))
        .pipe(notify("项目构建完成！"))
});

gulp.task('sequence', function (cb) {
    // 1、这个插件中写得任务得用cb或者是返回文件流
    // 2、简化了任务的依赖关系，控制了任务启动流程
    gulpSequence('clean','scss','html',['js', 'css', 'image'], cb)
})

// =========================通用任务配置=============================//

// 定义文件夹的清空任务
gulp.task('clean', function (cb) {
    del(['dist']).then(function () {
        cb()
        console.log('清空了dist目录里面里面的东西')
    })
})

// 处理js文件
gulp.task('js', function () {
    var stream = gulp.src('src/js/*.js')
        // .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({
            // dirname: 'dist/js',
            basename: "all",
            // prefix: "bonjour-",
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(gulp.dest('dist/js'))
    return stream
})

// 处理css文件
gulp.task('css', function () {
    var stream = gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(concatCss('all.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(cssnano())
        .pipe(rename({
            // dirname: 'dist/css',
            basename: "all",
            // prefix: "bonjour-",
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(gulp.dest('dist/css'))
    return stream
})

// 处理sass文件
gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'));
});


// 处理html插件
gulp.task('html', function () {
    var stream = gulp.src('src/*.html')
        .pipe(useref())
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist'))
    return stream
})

// 压缩图片插件
gulp.task('image', function () {
    var stream = gulp.src('src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
    return stream
})

