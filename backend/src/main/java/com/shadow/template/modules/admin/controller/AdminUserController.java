package com.shadow.template.modules.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shadow.template.common.result.Result;
import com.shadow.template.modules.admin.dto.AdminUserCreateDto;
import com.shadow.template.modules.admin.dto.AdminUserUpdateDto;
import com.shadow.template.modules.admin.dto.UserRoleIdsDto;
import com.shadow.template.modules.admin.service.AdminUserService;
import com.shadow.template.modules.admin.vo.AdminUserDetailVo;
import com.shadow.template.modules.admin.vo.AdminUserListVo;
import com.shadow.template.modules.admin.vo.IdVo;
import com.shadow.template.modules.admin.vo.PageResult;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

  @Autowired
  private AdminUserService adminUserService;

  @GetMapping
  @PreAuthorize("hasAuthority('user:list')")
  public Result<PageResult<AdminUserListVo>> list(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int pageSize,
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false) Integer status) {
    return Result.success(adminUserService.list(page, pageSize, keyword, status));
  }

  @PostMapping
  @PreAuthorize("hasAuthority('user:create')")
  public Result<IdVo> create(@RequestBody @Valid AdminUserCreateDto dto) {
    return Result.success(new IdVo(adminUserService.create(dto)));
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('user:detail')")
  public Result<AdminUserDetailVo> getById(@PathVariable Long id) {
    return Result.success(adminUserService.getById(id));
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('user:update')")
  public Result<Void> update(@PathVariable Long id, @RequestBody AdminUserUpdateDto dto) {
    adminUserService.update(id, dto);
    return Result.success();
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('user:delete')")
  public Result<Void> delete(@PathVariable Long id) {
    adminUserService.delete(id);
    return Result.success();
  }

  @GetMapping("/{id}/roles")
  @PreAuthorize("hasAuthority('user:detail')")
  public Result<List<Long>> getRoles(@PathVariable Long id) {
    return Result.success(adminUserService.getRoleIds(id));
  }

  @PutMapping("/{id}/roles")
  @PreAuthorize("hasAuthority('user:update')")
  public Result<Void> assignRoles(@PathVariable Long id, @RequestBody @Valid UserRoleIdsDto dto) {
    adminUserService.assignRoles(id, dto.getRoleIds());
    return Result.success();
  }
}
