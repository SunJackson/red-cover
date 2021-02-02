
### 微信红包封面领取小程序，用户观看视频广告或者邀请新用户可获取微信红包封面序列号，还可给外卖优惠券引流

微信红包封面领取小程序

本项目基于【小疯子】的 [封面红包](https://github.com/zwpro/redCover)开源项目魔改

#### 新增功能：
- 首页显示可自定义排序（后台参数为cover表sort，从大到小排列）
- 首页显示已发放封面红包个数（后台参数为cover表sendnum）
- 后台设置封面库存，根据完成活动人数自动减少库存（后台参数为cover表num）
- 封面红包页任务显示修改，当库存为0时，任务按钮变灰，停止任务
- 修改原助力规则只允许新人助力为助力一次后可看广告继续助力，每个人看广告完成助力难度随助力次数增加，比如第一次看一次广告完成助力，第二次需看3次广告，第三次需看6次
- 修改任务完成领取页面，添加点击复制到剪切板
- 修改任务完成领取页面，添加前往公众号按钮，添加公众号红包序列码使用讲解页面，方便用户快速跳转公众号（没有公众号的同学可以把这里改成自动发卡按钮，完成任务自动跳转到红包封面领取页，亲测可以实现）
- 后台添加任务完成记录，只用查询record表就能知道谁完成了哪个封面红包任务
- 后台添加红包封面序列号发放程序，源码见云函数wechat.js，方便对接自动发卡程序
- 添加自动发卡程序，发卡程序需要使用服务器，源码为flask代码，在wechat-api文件夹下，如需对接可以联系我


### 使用方法

源码为uniapp项目，需下载hbuilder导入项目打包，编译成小程序

[在线文档](http://lianghua.wxthe.com/docs/)

### 注意

- 本项目任务完成方式为两个任务必须同时完成才能领取封面
- record表里面的所有用户均为已完成任务，status字段为发卡情况

### 程序部分截图

<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd/2e3ad21d-e749-4ec6-a33e-5dd75a1340ed.jpg" width="200"/><img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd/a362a56d-d21a-4ba1-89c9-8b284c030696.jpg" width="200"/><img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd/f18bf039-0da1-4088-8d65-5db21b75c2d1.jpg" width="200"/>
<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd/c79cb81c-3274-40cc-ba57-d72ab8186696.jpg" width="200"/><img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd/f87dcd0e-5869-47d7-bceb-dbe79755244f.jpg" width="200"/><img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd/e37d98d3-9caa-411e-bc6d-af6e9b2a9aa9.jpg" width="200"/>

### 程序效果体验

<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd/59be6be5-0336-45a0-9f4d-0e471383191f.jpg" width="200"/>


### 发卡公众号

<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd/1baf2d4d-2586-46b7-8fa5-f126517b220e.jpg" width="200"/>


### 赞赏

如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励 ❤️，也可以帮我买杯果汁，哈哈

小疯子的赞赏：

<img src="http://cdn.letwind.com/me/zanshang.jpg" width="200"/>

我的赞赏：

<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3e08f5fc-25d1-41dc-9dab-418a7fb3e2dd/f1f31b4e-5ff1-4d36-bae6-bf89104b0c26.jpg" width="200"/>