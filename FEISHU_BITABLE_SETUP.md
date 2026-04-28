# MissDill 飞书多维表格后台部署说明

这份文档给不熟悉部署的人使用，目标是让 MissDill 的网站内容可以从飞书多维表格维护。

网站会优先读取：

```text
https://missdill.beyondmotion.net/api/content
```

如果飞书还没有配置好，网站会自动回退到代码里的静态数据 `content-data.js`，不会白屏。

## 1. 已创建好的多维表格

我已经用本机 `lark-cli` 创建了一个飞书多维表格：

```text
名称：MissDill 网站内容后台
链接：https://my.feishu.cn/base/RmyKbzMNLaO3vssPQThcKeZ9nmb
```

Cloudflare Worker 需要用到的表格参数：

```text
FEISHU_APP_TOKEN=RmyKbzMNLaO3vssPQThcKeZ9nmb
FEISHU_TABLE_PRODUCTS=tblGdIm6yLITnxIs
FEISHU_TABLE_FILTERS=tblsuNag1CpXNNoF
FEISHU_TABLE_VIDEO_STORIES=tblGA42wJGMqEjc6
FEISHU_TABLE_SETTINGS=tbl25vtP2iDbarC6
```

表格结构：

| 表名 | 用途 | 当前记录 |
| --- | --- | --- |
| 产品课程 | 花礼、课程、定制服务 | 6 条正式内容，另有 1 条隐藏测试记录 |
| 分类筛选 | 网站商品筛选按钮 | 5 条 |
| 视频内容 | 视频区右侧故事卡片 | 3 条 |
| 站点设置 | 小程序文案、主视频文案 | 10 条 |

隐藏测试记录名称是 `测试记录-请勿使用`，字段 `上架=false`，网站不会读取。

## 2. 飞书后台怎么编辑内容

### 修改一个花礼

打开 `产品课程` 表，找到对应行，直接改这些字段：

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| 商品ID | 稳定 ID，不建议改 | `spring-pink-bouquet` |
| 名称 | 商品标题 | `春日浅粉花束` |
| 类型 | `product`、`class`、`custom` | `product` |
| 分类 | 多个分类用英文逗号隔开 | `spring,gift` |
| 短描述 | 商品卡片副标题 | `温柔粉系 · 雏菊玫瑰` |
| 详情 | 商品弹窗里的详情 | `适合生日、纪念日...` |
| 价格 | 数字 | `398` |
| 价格文案 | 前台显示价格 | `¥398` |
| 图片 | 网站图片路径或公网图片 URL | `./assets/product-spring-bouquet.png` |
| 图片描述 | 图片 alt 文案 | `春日浅粉花束` |
| 按钮文案 | 卡片按钮 | `加入` |
| 供应状态 | 商品状态 | `当日花材需提前确认` |
| 配送说明 | 弹窗配送说明 | `建议提前 1 天预约` |
| 小程序路径 | 小程序跳转路径 | `/pages/product/detail?id=spring-pink-bouquet` |
| 排序 | 数字越小越靠前 | `10` |
| 上架 | 是否在网站显示 | `true` |

### 新增一个花礼

1. 在 `产品课程` 表新增一行。
2. 填写 `商品ID`，必须唯一，建议用英文小写和连字符，例如 `summer-white-bouquet`。
3. 填写 `名称`、`类型`、`分类`、`价格`、`价格文案`、`图片` 等字段。
4. 把 `上架` 勾选为 true。
5. 等 Cloudflare Worker 缓存刷新，通常几分钟内生效。

### 下架一个花礼

把 `产品课程` 表里的 `上架` 取消勾选即可。不要删除行，方便以后恢复。

### 修改筛选分类

打开 `分类筛选` 表：

| 字段 | 说明 |
| --- | --- |
| 分类ID | 和产品表 `分类` 字段对应，例如 `spring` |
| 名称 | 前台按钮文案，例如 `春日限定` |
| 排序 | 数字越小越靠前 |
| 显示 | 是否显示这个筛选按钮 |

### 修改视频故事

打开 `视频内容` 表：

| 字段 | 说明 |
| --- | --- |
| 视频ID | 稳定 ID |
| 标题 | 视频故事标题 |
| 说明 | 视频时长/分类说明 |
| 图片 | 图片路径或公网图片 URL |
| 图片描述 | 图片 alt 文案 |
| 排序 | 数字越小越靠前 |
| 显示 | 是否显示 |

### 修改主视频和小程序文案

打开 `站点设置` 表，只改 `value`，不要改 `key`。

常用 key：

| key | 说明 |
| --- | --- |
| `miniProgram.name` | 小程序名称 |
| `miniProgram.status` | 小程序接入状态 |
| `miniProgram.appId` | 真实小程序 AppID |
| `miniProgram.fallbackMessage` | 网站购物袋里的小程序交接说明 |
| `videos.feature.title` | 主视频标题 |
| `videos.feature.summary` | 主视频简介 |
| `videos.feature.src` | 主视频地址 |
| `videos.feature.poster` | 主视频封面 |

## 3. 首次部署到自己的环境

### 第一步：准备账号

需要三个账号或权限：

1. GitHub 账号，用来托管网站代码和 GitHub Pages。
2. Cloudflare 账号，用来部署 Worker 和绑定域名。
3. 飞书开放平台自建应用，用来让 Worker 读取多维表格。

### 第二步：创建飞书自建应用

1. 打开飞书开放平台。
2. 创建一个自建应用，例如 `MissDill Website CMS`。
3. 记录应用的：
   - `App ID`
   - `App Secret`
4. 给应用开通 Base/多维表格读取相关权限，至少需要能读取记录。
5. 发布/启用应用。
6. 回到多维表格，把这个应用或机器人添加为协作者，至少给读取权限。

Cloudflare Worker 会用 `App ID` 和 `App Secret` 换取 `tenant_access_token`，再读取多维表格。

### 第三步：配置 Cloudflare Worker secrets

在项目根目录执行：

```bash
npx wrangler secret put FEISHU_APP_ID
npx wrangler secret put FEISHU_APP_SECRET
npx wrangler secret put FEISHU_APP_TOKEN
npx wrangler secret put FEISHU_TABLE_PRODUCTS
npx wrangler secret put FEISHU_TABLE_FILTERS
npx wrangler secret put FEISHU_TABLE_VIDEO_STORIES
npx wrangler secret put FEISHU_TABLE_SETTINGS
```

其中这些值使用本文件第 1 节的表格参数：

```text
FEISHU_APP_TOKEN=RmyKbzMNLaO3vssPQThcKeZ9nmb
FEISHU_TABLE_PRODUCTS=tblGdIm6yLITnxIs
FEISHU_TABLE_FILTERS=tblsuNag1CpXNNoF
FEISHU_TABLE_VIDEO_STORIES=tblGA42wJGMqEjc6
FEISHU_TABLE_SETTINGS=tbl25vtP2iDbarC6
```

`FEISHU_APP_ID` 和 `FEISHU_APP_SECRET` 来自飞书开放平台自建应用。

注意：不要把 `FEISHU_APP_SECRET` 写进 GitHub 仓库、前端代码或文档截图里。

### 第四步：部署 Worker

配置完 secrets 后重新部署：

```bash
npx wrangler deploy --domain missdill.beyondmotion.net
```

### 第五步：检查接口

检查 Worker 是否识别到飞书配置：

```bash
curl https://missdill.beyondmotion.net/api/health
```

如果配置成功，应看到：

```json
{
  "ok": true,
  "feishuConfigured": true
}
```

检查内容接口：

```bash
curl https://missdill.beyondmotion.net/api/content
```

如果成功，返回内容里应看到：

```json
{
  "source": "feishu_bitable",
  "configured": true,
  "products": []
}
```

`products` 里应该有产品数据。

### 第六步：刷新网站

打开：

```text
https://missdill.beyondmotion.net/
```

修改飞书表格后，网站通常几分钟内会更新。Cloudflare Worker 对 `/api/content` 有短缓存，避免每个访客都直接打到飞书 API。

## 4. 常见问题

### 网站没有显示飞书内容

先检查：

```bash
curl https://missdill.beyondmotion.net/api/health
```

如果 `feishuConfigured=false`，说明 Cloudflare Worker secrets 没配好。

如果 `/api/content` 返回 502，通常是：

- App ID / App Secret 错误。
- 自建应用没有 Base/多维表格读取权限。至少需要类似 `base:record:retrieve` 的记录读取权限。
- 自建应用没有被加入这个多维表格。
- app_token 或 table_id 填错。

### 改了飞书但网站没变化

可能是缓存。等待几分钟，或重新部署 Worker：

```bash
npx wrangler deploy --domain missdill.beyondmotion.net
```

### 图片怎么换

最稳妥的方式是使用网站已有图片路径，例如：

```text
./assets/product-spring-bouquet.png
```

如果要用新图片，需要先把图片上传到可公网访问的位置，再把图片 URL 填到 `图片` 字段。

### 能不能让朋友只编辑飞书，不碰代码

可以。上线后日常只需要：

- 改产品：编辑 `产品课程`
- 改分类：编辑 `分类筛选`
- 改视频卡片：编辑 `视频内容`
- 改主视频/小程序文案：编辑 `站点设置`

不需要改 GitHub 或 Cloudflare。

## 5. 本地 CLI 创建记录

本次创建使用的是本机：

```bash
/opt/homebrew/bin/lark-cli
```

CLI 状态：

```text
lark-cli version 1.0.1
已登录飞书用户：王灵威
```

后续如果要继续用 CLI 操作，可以先检查：

```bash
/opt/homebrew/bin/lark-cli doctor
```

## 6. 官方文档

- Base v3 记录读取接口：
  - https://open.feishu.cn/document/server-docs/docs/bitable-v1/base-v3/record/list
- tenant_access_token：
  - https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal
