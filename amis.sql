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

 Date: 25/06/2024 00:01:08
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
INSERT INTO `application` VALUES ('brandName', 'zAdmin', 0, 0);
INSERT INTO `application` VALUES ('className', NULL, 0, 0);
INSERT INTO `application` VALUES ('footer', NULL, 0, 0);
INSERT INTO `application` VALUES ('header', '{\n  \"type\": \"grid\",\n  \"align\": \"between\",\n  \"valign\": \"middle\",\n  \"columns\": [\n    {\n      \"md\": 6,\n      \"body\": [\n        {\n          \"type\": \"plain\",\n          \"text\": \"\"\n        }\n      ]\n    },\n    {\n      \"md\": 6,\n      \"body\": {\n        \"type\": \"service\",\n        \"api\": \"get:/api/amis/self\",\n        \"body\": {\n          \"type\": \"flex\",\n          \"justify\": \"flex-end\",\n          \"items\": [\n            {\n              \"type\": \"service\",\n              \"api\": \"get:/api/amis/self\",\n              \"body\": {\n                \"type\": \"avatar\",\n                \"icon\": \"fa fa-user\",\n                \"src\": \"${avatar}\",\n                \"size\": \"small\",\n                \"className\": \"inline\"\n              }\n            },\n            {\n              \"type\": \"dropdown-button\",\n              \"label\": \"${username}\",\n              \"trigger\": \"hover\",\n              \"hideCaret\": false,\n              \"level\": \"link\",\n              \"buttons\": [\n                {\n                  \"type\": \"button\",\n                  \"label\": \"修改密码\",\n                  \"actionType\": \"link\",\n                  \"link\": \"/html/self/passwd\"\n                },\n                {\n                  \"type\": \"button\",\n                  \"label\": \"个人设置\",\n                  \"disabled\": true\n                },\n                {\n                  \"type\": \"divider\"\n                },\n                {\n                  \"type\": \"button\",\n                  \"label\": \"退出登录\",\n                  \"confirmText\": \"你确定要退出登录吗？\",\n                  \"confirmTitle\": \"请确认\",\n                  \"actionType\": \"ajax\",\n                  \"api\": \"get:/api/amis/logout\",\n                  \"redirect\": \"/html\"\n                }\n              ]\n            },\n            {\n              \"type\": \"tpl\",\n              \"className\": \"mx-3\"\n            }\n          ]\n        }\n      }\n    }\n  ]\n}', 0, 0);
INSERT INTO `application` VALUES ('homePage', '/html/default', 0, 0);
INSERT INTO `application` VALUES ('logo', 'https://aisuda.bce.baidu.com/amis/static/favicon_b3b0647.png', 0, 0);

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
INSERT INTO `pages` VALUES ('9fccc1e7-484a-486e-9bef-9438d1a6fb49', '页面管理', 'fa-solid fa-bars', '/html/settings/pages', NULL, '/html/schemas/pages.json', 'url', NULL, NULL, NULL, 'false', 'true', NULL, '352fee91-a286-4000-a583-88d1d7661000', 2, 'system:pages', 1, 'enable', 0, 0);
INSERT INTO `pages` VALUES ('a0145cb6-0107-4000-a49a-06076d718000', '个人信息', NULL, '/html/self', NULL, NULL, 'json', NULL, NULL, NULL, 'false', 'false', NULL, NULL, 0, 'self', 1, 'enable', 0, 0);
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
INSERT INTO `permissions` VALUES ('system:00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'system', 0, 0, 0);

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
