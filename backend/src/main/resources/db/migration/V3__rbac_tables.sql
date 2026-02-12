-- sys_role
CREATE TABLE IF NOT EXISTS sys_role (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(64) NOT NULL COMMENT '角色编码',
  name VARCHAR(128) NOT NULL COMMENT '角色名称',
  description VARCHAR(255) COMMENT '描述',
  type TINYINT NOT NULL COMMENT '1=Admin 2=普通用户',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '0=禁用 1=启用',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_code (code),
  INDEX idx_type_status (type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- sys_permission
CREATE TABLE IF NOT EXISTS sys_permission (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(128) NOT NULL COMMENT '权限编码',
  name VARCHAR(128) NOT NULL COMMENT '权限名称',
  type TINYINT NOT NULL COMMENT '1=菜单 2=按钮/接口',
  parent_id BIGINT NOT NULL DEFAULT 0 COMMENT '父权限ID 0为根',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_code (code),
  INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- sys_role_permission
CREATE TABLE IF NOT EXISTS sys_role_permission (
  id BIGINT NOT NULL AUTO_INCREMENT,
  role_id BIGINT NOT NULL COMMENT '角色ID',
  permission_id BIGINT NOT NULL COMMENT '权限ID',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_role_permission (role_id, permission_id),
  INDEX idx_role_id (role_id),
  INDEX idx_permission_id (permission_id),
  CONSTRAINT fk_role_permission_role FOREIGN KEY (role_id) REFERENCES sys_role(id) ON DELETE CASCADE,
  CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id) REFERENCES sys_permission(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- sys_user_role
CREATE TABLE IF NOT EXISTS sys_user_role (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT '用户ID',
  role_id BIGINT NOT NULL COMMENT '角色ID',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_role (user_id, role_id),
  INDEX idx_user_id (user_id),
  INDEX idx_role_id (role_id),
  CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES user_auth(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) REFERENCES sys_role(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- sys_menu
CREATE TABLE IF NOT EXISTS sys_menu (
  id BIGINT NOT NULL AUTO_INCREMENT,
  permission_id BIGINT NOT NULL COMMENT '关联权限ID',
  parent_id BIGINT NOT NULL DEFAULT 0 COMMENT '父菜单ID 0为根',
  name VARCHAR(64) NOT NULL COMMENT '菜单名称',
  path VARCHAR(255) COMMENT '前端路由path',
  component VARCHAR(255) COMMENT '前端组件路径',
  icon VARCHAR(64) COMMENT '图标',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  visible TINYINT NOT NULL DEFAULT 1 COMMENT '0=隐藏 1=可见',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_permission_id (permission_id),
  INDEX idx_parent (parent_id),
  CONSTRAINT fk_menu_permission FOREIGN KEY (permission_id) REFERENCES sys_permission(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- user_session 新增 client_type
ALTER TABLE user_session ADD COLUMN client_type VARCHAR(32) COMMENT 'admin/web/native';
