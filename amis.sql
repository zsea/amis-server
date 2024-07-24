/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80029 (8.0.29)
 Source Host           : localhost:3306
 Source Schema         : amis

 Target Server Type    : MySQL
 Target Server Version : 80029 (8.0.29)
 File Encoding         : 65001

 Date: 11/07/2024 00:28:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for application
-- ----------------------------
DROP TABLE IF EXISTS `application`;
CREATE TABLE `application`  (
  `key` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` bigint NULL DEFAULT NULL,
  `updated_at` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of application
-- ----------------------------
INSERT INTO `application` VALUES ('asideAfter', NULL, 0, 0);
INSERT INTO `application` VALUES ('asideBefore', NULL, 0, 0);
INSERT INTO `application` VALUES ('brandName', 'hAdmin', 0, 0);
INSERT INTO `application` VALUES ('className', NULL, 0, 0);
INSERT INTO `application` VALUES ('footer', NULL, 0, 0);
INSERT INTO `application` VALUES ('header', '{\n  \"type\": \"grid\",\n  \"align\": \"between\",\n  \"valign\": \"middle\",\n  \"columns\": [\n    {\n      \"md\": 6,\n      \"body\": [\n        {\n          \"type\": \"plain\",\n          \"text\": \"\"\n        }\n      ]\n    },\n    {\n      \"md\": 6,\n      \"body\": {\n        \"type\": \"service\",\n        \"api\": \"get:/api/amis/self\",\n        \"body\": {\n          \"type\": \"flex\",\n          \"justify\": \"flex-end\",\n          \"items\": [\n            {\n              \"type\": \"service\",\n              \"api\": \"get:/api/amis/self\",\n              \"body\": {\n                \"type\": \"avatar\",\n                \"icon\": \"fa fa-user\",\n                \"src\": \"${avatar}\",\n                \"size\": \"small\",\n                \"className\": \"inline\"\n              }\n            },\n            {\n              \"type\": \"dropdown-button\",\n              \"label\": \"${username}\",\n              \"trigger\": \"hover\",\n              \"hideCaret\": false,\n              \"level\": \"link\",\n              \"buttons\": [\n                {\n                  \"type\": \"button\",\n                  \"label\": \"修改密码\",\n                  \"actionType\": \"link\",\n                  \"link\": \"/html/self/passwd\"\n                },\n                {\n                  \"type\": \"button\",\n                  \"label\": \"个人设置\",\n                  \"disabled\": true\n                },\n                {\n                  \"type\": \"divider\"\n                },\n                {\n                  \"type\": \"button\",\n                  \"label\": \"退出登录\",\n                  \"confirmText\": \"你确定要退出登录吗？\",\n                  \"confirmTitle\": \"请确认\",\n                  \"actionType\": \"ajax\",\n                  \"api\": \"get:/api/amis/logout\",\n                  \"redirect\": \"/html\"\n                }\n              ]\n            },\n            {\n              \"type\": \"tpl\",\n              \"className\": \"mx-3\"\n            }\n          ]\n        }\n      }\n    }\n  ]\n}', 0, 0);
INSERT INTO `application` VALUES ('homePage', '/html/default', 0, 0);
INSERT INTO `application` VALUES ('logo', 'https://aisuda.bce.baidu.com/amis/static/favicon_b3b0647.png', 0, 0);

-- ----------------------------
-- Table structure for models
-- ----------------------------
DROP TABLE IF EXISTS `models`;
CREATE TABLE `models`  (
  `id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `method` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `anonymous` int NULL DEFAULT NULL,
  `order` int NULL DEFAULT NULL,
  `codes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `usefunc` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `table` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `where` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `fields` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `entity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `desc_by_time` int NULL DEFAULT NULL,
  `has_time` int NULL DEFAULT NULL,
  `updater` int NULL DEFAULT NULL,
  `created_at` bigint NULL DEFAULT NULL,
  `updated_at` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of models
-- ----------------------------

-- ----------------------------
-- Table structure for pages
-- ----------------------------
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages`  (
  `id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `label` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `icon` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `schema` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `schema_api` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `schema_mode` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'json/url',
  `link` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `redirect` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `rewrite` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_default_page` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'true/false',
  `visible` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'true/false',
  `class_name` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pid` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `order` int NULL DEFAULT 0,
  `model` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '对应模块ID，只有模块有权限才能显示菜单',
  `is_system_page` int NULL DEFAULT 0 COMMENT '是否是系统页面，系统页面不允许进行编辑：1/0',
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'enable' COMMENT '可选值：enable/disabled',
  `created_at` bigint NULL DEFAULT 0,
  `updated_at` bigint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pages
-- ----------------------------
INSERT INTO `pages` VALUES ('284ba5cd-dae9-4b21-85b9-757b340409cc', '用户管理', 'fa fa-user', '/html/acl/users', NULL, '/html/schemas/users.json', 'url', NULL, NULL, NULL, 'false', 'true', NULL, '67a8140d-872f-4000-a780-f37db162a000', 1, 'limit:user', 1, 'enable', 0, 0);
INSERT INTO `pages` VALUES ('3385d30d-e102-4000-ac97-0d2393522000', '应用设置', 'fa fa-th-large', '/html/settings/application', NULL, '/html/schemas/app.json', 'url', NULL, NULL, NULL, 'false', 'true', NULL, '352fee91-a286-4000-a583-88d1d7661000', 1, 'system:application', 1, 'enable', 0, 0);
INSERT INTO `pages` VALUES ('352fee91-a286-4000-a583-88d1d7661000', '系统设置', 'fa-solid fa-gear', '/html/settings', NULL, NULL, 'json', NULL, '/html/settings/pages', NULL, 'false', 'true', NULL, '', 1, 'system', 1, 'enable', 0, 0);
INSERT INTO `pages` VALUES ('3a580e5c-7ce8-4000-ad0c-5a570677d000', '修改密码', NULL, '/html/self/passwd', NULL, '/html/schemas/passwd.json', 'url', NULL, NULL, NULL, 'false', 'false', NULL, 'a0145cb6-0107-4000-a49a-06076d718000', 1, 'self:passwd', 1, 'enable', 0, 0);
INSERT INTO `pages` VALUES ('67a8140d-872f-4000-a780-f37db162a000', '权限管理', 'fa-solid fa-door-closed', '/html/acl', NULL, NULL, 'json', NULL, '/html/acl/users', NULL, 'false', 'true', NULL, '', 2, 'limit', 1, 'enable', 0, 0);
INSERT INTO `pages` VALUES ('964a504a-304f-4000-ac41-5ab5f9635000', '软件管理', 'fab fa-innosoft', '/html/softs', '{\"type\":\"page\",\"body\":[{\"type\":\"crud\",\"syncLocation\":false,\"api\":{\"method\":\"get\",\"url\":\"/api/softs/packages\",\"requestAdaptor\":\"\",\"adaptor\":\"\",\"messages\":{}},\"bulkActions\":[],\"itemActions\":[],\"filterSettingSource\":[\"package\",\"name\",\"version\",\"updated_at\",\"created_at\",\"old_offline\"],\"headerToolbar\":[{\"label\":\"新增\",\"type\":\"button\",\"actionType\":\"dialog\",\"level\":\"primary\",\"editorSetting\":{\"behavior\":\"create\"},\"dialog\":{\"title\":\"新增\",\"body\":{\"type\":\"form\",\"api\":{\"method\":\"post\",\"url\":\"/api/softs/packages\",\"requestAdaptor\":\"\",\"adaptor\":\"\",\"messages\":{}},\"body\":[{\"type\":\"input-text\",\"name\":\"软件ID\",\"label\":\"package\"},{\"type\":\"input-text\",\"name\":\"软件名称\",\"label\":\"name\"},{\"type\":\"input-text\",\"name\":\"版本号\",\"label\":\"version\"},{\"type\":\"input-date\",\"name\":\"更新时间\",\"label\":\"updated_at\"},{\"type\":\"input-date\",\"name\":\"创建时间\",\"label\":\"created_at\"},{\"type\":\"input-text\",\"name\":\"旧版本\",\"label\":\"old_offline\"}]}},\"id\":\"u:2c5ae0805ef9\"},{\"type\":\"bulk-actions\"}],\"id\":\"u:f7000be83a68\",\"perPageAvailable\":[10],\"messages\":{},\"columns\":[{\"label\":\"ID\",\"type\":\"text\",\"name\":\"package\",\"id\":\"u:c6c0574ab447\"},{\"label\":\"名称\",\"type\":\"text\",\"name\":\"name\",\"id\":\"u:6940d49abb3e\"},{\"label\":\"版本\",\"type\":\"text\",\"name\":\"version\",\"id\":\"u:529c97348b43\"},{\"label\":\"旧版本\",\"type\":\"text\",\"name\":\"old_offline\",\"id\":\"u:6f76731e02da\"},{\"type\":\"text\",\"name\":\"created_at\",\"label\":\"创建时间\",\"id\":\"u:25e9776ca1f1\"},{\"label\":\"最后更新\",\"type\":\"text\",\"name\":\"updated_at\",\"id\":\"u:bcb1bfeaea9e\"}]}],\"regions\":[\"body\"],\"id\":\"u:04d87ac29121\",\"pullRefresh\":{\"disabled\":true}}', NULL, 'json', '', '/html/softs/packages', NULL, 'false', 'true', NULL, '', 3, 'soft', 0, 'enable', 1719248469616, 1719333799374);
INSERT INTO `pages` VALUES ('9fccc1e7-484a-486e-9bef-9438d1a6fb49', '页面管理', 'fa-solid fa-bars', '/html/settings/pages', NULL, '/html/schemas/pages.json', 'url', NULL, NULL, NULL, 'false', 'true', NULL, '352fee91-a286-4000-a583-88d1d7661000', 2, 'system:pages', 1, 'enable', 0, 0);
INSERT INTO `pages` VALUES ('a0145cb6-0107-4000-a49a-06076d718000', '个人信息', NULL, '/html/self', NULL, NULL, 'json', NULL, NULL, NULL, 'false', 'false', NULL, NULL, 0, 'self', 1, 'enable', 0, 0);
INSERT INTO `pages` VALUES ('a1bee19a-9aae-4000-ab0c-0500ee687000', '接口管理', 'fa-solid fa-paperclip', '/html/settings/apis', '{\"type\":\"page\",\"body\":[{\"type\":\"crud\",\"syncLocation\":false,\"api\":{\"method\":\"get\",\"url\":\"/api/amis/settings/apis\",\"requestAdaptor\":\"\",\"adaptor\":\"\",\"messages\":{}},\"bulkActions\":[],\"itemActions\":[],\"headerToolbar\":[{\"label\":\"新增\",\"type\":\"button\",\"actionType\":\"drawer\",\"level\":\"primary\",\"editorSetting\":{\"behavior\":\"create\"},\"id\":\"u:b457a42bde0f\",\"drawer\":{\"title\":\"新增接口\",\"body\":{\"type\":\"form\",\"api\":{\"method\":\"post\",\"url\":\"/api/amis/settings/apis\",\"requestAdaptor\":\"\",\"adaptor\":\"\",\"messages\":{}},\"body\":[{\"type\":\"input-text\",\"name\":\"id\",\"label\":\"ID\"},{\"type\":\"input-text\",\"name\":\"name\",\"label\":\"名称\"},{\"type\":\"input-text\",\"name\":\"method\",\"label\":\"方法\"},{\"type\":\"input-text\",\"name\":\"status\",\"label\":\"状态\"},{\"type\":\"input-text\",\"name\":\"order\",\"label\":\"排序\"},{\"type\":\"input-text\",\"name\":\"codes\",\"label\":\"代码\"}]},\"size\":\"xl\"}},{\"type\":\"bulk-actions\"},{\"type\":\"button\",\"tpl\":\"内容\",\"wrapperComponent\":\"\",\"id\":\"u:c374c69e0bb1\",\"label\":\"\",\"align\":\"right\",\"icon\":\"fa fa-repeat\",\"target\":\"u:2d6e7fa5fee2\",\"actionType\":\"reload\"},{\"type\":\"button\",\"tpl\":\"内容\",\"wrapperComponent\":\"\",\"id\":\"u:306fd88b1f57\",\"label\":\"重新加载\",\"align\":\"right\",\"confirmText\":\"你确定要重新加载所有接口数据吗？\",\"tooltip\":\"在服务器中重新加载所有接口数据。\",\"level\":\"warning\"}],\"id\":\"u:2d6e7fa5fee2\",\"perPageAvailable\":[10],\"messages\":{},\"perPage\":\"\",\"filterSettingSource\":[\"id\",\"name\",\"method\",\"status\",\"order\",\"codes\",\"created_at\",\"updated_at\",\"level\",\"parent\"],\"columns\":[{\"label\":\"名称\",\"type\":\"text\",\"name\":\"name\",\"id\":\"u:2119de954156\"},{\"label\":\"方法\",\"type\":\"text\",\"name\":\"method\",\"id\":\"u:df7978ad757d\"},{\"label\":\"状态\",\"type\":\"text\",\"name\":\"status\",\"id\":\"u:0bd21ace848a\"},{\"label\":\"创建时间\",\"type\":\"text\",\"name\":\"created_at\",\"id\":\"u:7ba548a4da98\"}]}],\"regions\":[\"body\"],\"id\":\"u:366b163ac78e\",\"pullRefresh\":{\"disabled\":true}}', '/html/schemas/apis.json', 'url', NULL, NULL, NULL, 'false', 'true', NULL, '352fee91-a286-4000-a583-88d1d7661000', 3, 'system:apis', 1, 'enable', 0, 0);
INSERT INTO `pages` VALUES ('d8417a03-d3a9-4cdd-8e46-c97f8f4c4dc2', '角色管理', 'fa-solid fa-user-group', 'html/acl/roles', NULL, '/html/schemas/roles.json', 'url', NULL, NULL, NULL, 'false', 'true', NULL, '67a8140d-872f-4000-a780-f37db162a000', 2, 'limit:roles', 1, 'enable', 0, 0);

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ur_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户或角色id，创建者账号不能设置权限，全0账号在这里代表角色Everyone',
  `model` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '模块id',
  `limit` int NULL DEFAULT NULL COMMENT '权限，用两个二进制位置表示：00，右1表示禁止，右2表示允许，对应位值为0表示未勾选，为1表示已勾选。',
  `created_at` bigint NULL DEFAULT 0,
  `updated_at` bigint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES ('login:00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'login', 2, 0, 0);
INSERT INTO `permissions` VALUES ('self:00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'self', 2, 0, 0);
INSERT INTO `permissions` VALUES ('self:passwd:00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'self:passwd', 2, 0, 0);

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `desc` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` bigint NULL DEFAULT 0,
  `updated_at` bigint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------

-- ----------------------------
-- Table structure for user_role_links
-- ----------------------------
DROP TABLE IF EXISTS `user_role_links`;
CREATE TABLE `user_role_links`  (
  `id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `uid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户id',
  `rid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '角色id',
  `created_at` bigint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_role_links
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `avatar` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` bigint NULL DEFAULT NULL,
  `updated_at` bigint NULL DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '状态:enable/disabled',
  `error_times` int NULL DEFAULT 0 COMMENT '连续登录的错误次数',
  `last_error_at` bigint NULL DEFAULT 0 COMMENT '最后一次错误的时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('00000000-0000-0000-0000-000000000000', 'admin', '21232f297a57a5a743894a0e4a801fc3', NULL, 0, 0, 'enable', 0, 0);

SET FOREIGN_KEY_CHECKS = 1;
