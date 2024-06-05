// exports
module.exports = function(grunt) {

	// verupの度に書き換えること
	var ver_app_tab = '3.0.8';
	var ver_sp_starlink = '1.0.1';

	// サーバデプロイの際に書き換えること
	// var deploy_target = 'sach5_sky_dev';
	// var deploy_target = 'tvespa';
	// var deploy_target = 'tvespa_test';
	var deploy_target = 'smt';

	var deploy_env_dir = '../../deploy/' + ver_app_tab + '/' + deploy_target;
	var deploy_dir = '../../deploy/target/h5ContentsDownload';

	// execute設定
	grunt.initConfig({
		copy: {
			prepair: {
				files:[
					{
						expand:true,
						cwd: 'ts/',
						src:["**"],
						dest: 'bin/ts/'
					},
				]
			},
			result: {
				files:[
					{
						expand:true,
						cwd: 'bin/js/',
						src:["*.js"],
						dest: '../../h5ContentsDownload/smartphone/starlink/' + ver_sp_starlink + '/more/js/'
					},
				]
			},
			result_map: {
				files:[
					{
						expand:true,
						cwd: 'bin/js/',
						src:["*.map"],
						dest: 'js/map/'
					},
				]
			},
			deploy_before_proxy: {
				files:[
					{
						expand:true,
						cwd: deploy_env_dir,
						src:['proxy.html', 'smt.proxy.common.js'],
						dest: '../../h5ContentsDownload/starlink/proxy'
					},
				]
			},
			deploy_before_app_ver_js: {
				files:[
					{
						expand:true,
						cwd: deploy_env_dir,
						src:['smt.app.js', 'smt.common.js'],
						dest: '../../h5ContentsDownload/starlink/' + ver_app_tab + '/js'
					},
				]
			},
			deploy_before_app_ver_app: {
				files:[
					{
						expand:true,
						cwd: deploy_env_dir,
						src:['write_cookie.html'],
						dest: '../../h5ContentsDownload/starlink/' + ver_app_tab + '/app'
					},
				]
			},
			deploy: {
				files:[
					{
						expand:true,
						cwd: '../../h5ContentsDownload',
						src:['**'],
						dest: deploy_dir
					},
				]
			},
		},
		typescript: {
			build:{
				src:[
					'bin/ts/mwsRequestManager.d.ts',
					'bin/ts/jquery.d.ts',
					'bin/ts/jquerymobile.d.ts',
					'bin/ts/bxSlider.d.ts',
					'bin/ts/smt.word.ts',
					'bin/ts/aha_connect_sdk.ts',
					'bin/ts/harman_ota_common.ts',
					'bin/ts/harman_ota_controller.ts',
					'bin/ts/harman_ota_sdk.ts',
					'bin/ts/harman_ota_ui.ts'
					],
				dest:'bin/js/',
				options:{
					target: "ES5",
					module: "commonjs",
					comments:true,
					sourceMap:true
				}
			},
		},
		clean: {
			// ビルド後に不要となる外部Libの削除
			before: ['bin/', 'js/'],
			after: ['bin/'],
		},
	});

	// module参照を階層上の共通パスに変更する
	grunt.file.setBase('../');

	// 使用するGruntプラグインを読み込む
	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-typedoc');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// パスを開発パスに戻す
	// grunt.file.setBase('./');
    grunt.file.setBase('src');

	// タスク登録
	grunt.registerTask('default',
		[
			'clean:before',
			'copy:prepair',
			'typescript:build',
			'copy:result',
			'copy:result_map',
			'copy:deploy_before_proxy',
			'copy:deploy_before_app_ver_js',
			'copy:deploy_before_app_ver_app',
			'copy:deploy',
			'clean:after',
		]
	);
}
