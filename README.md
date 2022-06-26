# vue_manage
来自B站黑马程序员
#### 配置环境 `npm install`
#### 启动项目 `npm run serve`
#### 文件说明  
- `assets` 本地资源    
- `components` 项目组件    
- `pages`Home页面组件   
  - `user` 用户管理组件
  - `power` 权限管理组件
- `plugins` 按需导入配置elementui
- `router` 路由配置
- `App.vue` 应用组件 
- `mian.js` 项目入口文件  
- `.prettierrc`代码格式化配置
- `package.json` 项目配置文件  
---
### 后台服务器（先将mydb.sql导入本地数据库）
#### 进入server文件夹
#### 配置环境 `npm install`
#### 启动项目 `node app.js`
#### server文件说明
- `config` 配置文件目录
  - `default.json` 默认配置文件（其中包含数据库配置，jwt配置）
- `dao` 数据访问层，存放对数据库的增删改查操作
  - `DAO.js` 提供的公共访问数据库的方法
- `db` 用于导入本地数据库的文件
- `models` 存放具体数据库 ORM 模型文件
- `modules` 当前项目模块
  - `authorization.js` API权限验证模块
  - `database.js` 数据库模块（数据库加载基于 nodejs-orm2 库加载）
  - `passport.js` 基于 passport 模块的登录搭建
  - `resextra.js` API 统一返回结果接口
- `node_modules` 项目依赖的第三方模块
- `routes` 统一路由
  - `api` 提供 api 接口
  - `mapp` 提供移动APP界面
  - `mweb` 提供移动web站点
- `services` 服务层，业务逻辑代码在这一层编写，通过不同的接口获取的数据转换成统一的前端所需要的数据
- `app.js` 主项目入口文件
- `package.json` 项目配置文件
---
> 6.20 配置环境，完成登录功能  
> 6.21 用户列表大部分功能  
> 6.22 权限管理功能  
> 6.23 商品分类页部分
> 6.24 商品分类所有功能  
> 6.25 商品参数页  
> 6.26 商品列表页 (编辑商品接口文档错误)     
> 6.27 添加商品页 (编辑商品调试成功)   