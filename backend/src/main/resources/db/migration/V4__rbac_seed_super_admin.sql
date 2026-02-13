-- ============ RBAC 超级管理员种子数据 ============
-- 默认账号: admin@admin.com / admin123
-- 使用高位 ID 避免与正常注册用户冲突

-- 1. 插入 sys_permission（type=2 表示按钮/接口）
INSERT INTO sys_permission (code, name, type, parent_id, sort_order) VALUES
  ('role:list', '角色列表', 2, 0, 10),
  ('role:create', '创建角色', 2, 0, 11),
  ('role:detail', '角色详情', 2, 0, 12),
  ('role:update', '更新角色', 2, 0, 13),
  ('role:delete', '删除角色', 2, 0, 14),
  ('user:list', '用户列表', 2, 0, 20),
  ('user:create', '创建用户', 2, 0, 21),
  ('user:detail', '用户详情', 2, 0, 22),
  ('user:update', '更新用户', 2, 0, 23),
  ('user:delete', '删除用户', 2, 0, 24),
  ('menu:list', '菜单列表', 2, 0, 30),
  ('menu:create', '创建菜单', 2, 0, 31),
  ('menu:update', '更新菜单', 2, 0, 32),
  ('menu:delete', '删除菜单', 2, 0, 33),
  ('permission:list', '权限列表', 2, 0, 40)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 2. 插入超级管理员角色（type=1 Admin端）
INSERT INTO sys_role (code, name, description, type, status) VALUES
  ('super_admin', '超级管理员', '拥有所有权限，无需单独分配', 1, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

-- 3. 关联 super_admin 角色与所有权限
INSERT INTO sys_role_permission (role_id, permission_id)
SELECT r.id, p.id
FROM sys_role r
CROSS JOIN sys_permission p
WHERE r.code = 'super_admin'
  AND p.code IN (
    'role:list', 'role:create', 'role:detail', 'role:update', 'role:delete',
    'user:list', 'user:create', 'user:detail', 'user:update', 'user:delete',
    'menu:list', 'menu:create', 'menu:update', 'menu:delete',
    'permission:list'
  )
ON DUPLICATE KEY UPDATE role_id = role_id;

-- 4. 插入超级管理员用户（ID=9007199254740991 避免与正常用户冲突）
-- 密码: admin123 (BCrypt)
INSERT IGNORE INTO user_auth (id, email, status, password_hash) VALUES
  (9007199254740991, 'admin@admin.com', 1, '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQBjm2yTuVhRVBxO6R4FQz8nQ8qBKS');

INSERT IGNORE INTO user_profile (user_id, nickname) VALUES
  (9007199254740991, '超级管理员');

-- 5. 为用户分配 super_admin 角色（仅当超级管理员用户存在时）
INSERT IGNORE INTO sys_user_role (user_id, role_id)
SELECT 9007199254740991, r.id
FROM sys_role r
WHERE r.code = 'super_admin'
  AND EXISTS (SELECT 1 FROM user_auth WHERE id = 9007199254740991)
LIMIT 1;
