// 加 md5
fis.match('/public/**.{js,css,png,ico,jpg}', {
  useHash: true,
  url:'/server$0'
});


//启用fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});

//对CSS进行图片合并
fis.match('*.css', {
  //给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

/*
fis.match('/public/(*.js)', {
  //fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});
*/

fis.match('*.css', {
  //fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  //fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});