## COSMOS检查新投票脚本

1. 安装node和git，要求nodejs版本不低于12.16.0 (可以不安装git, 直接下载zip文件获得源码)

2. 从github上复制代码

  ```
  git clone git@github.com:fxhash001/cosmos_voting.git
  ```

3. 获得源码后进入源码所在路经，安装运行脚本需要的依赖包

  ```
  npm install
  ```

4. 编辑main.js，配置好所使用代理的端口号（科学上网）

  ```
  proxy: "http://127.0.0.1:7890",
  ```

  端口号7890按实际修改

5. 如果没有使用代理，跳过第4步，代码中做一下切换

  ```
  require("request").get(options, function (error, response, body) {
  // requestProxy.get(options, function (error, response, body) {
  ```
6. 运行脚本

  ```
  node main.js
  ```

  输出log带有 ** ** 的即是上次运行到现在新增的proposals.

That's all.


  脚本可每2～3天运行一次。evmos投票还未调试，临时注释掉