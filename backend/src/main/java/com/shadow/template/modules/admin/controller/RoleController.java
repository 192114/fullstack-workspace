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
import com.shadow.template.modules.admin.dto.RoleCreateDto;
import com.shadow.template.modules.admin.dto.RolePermissionIdsDto;
import com.shadow.template.modules.admin.dto.RoleUpdateDto;
import com.shadow.template.modules.admin.vo.PageResult;
import com.shadow.template.modules.admin.vo.RoleDetailVo;
import com.shadow.template.modules.admin.vo.RoleListVo;
import com.shadow.template.modules.admin.vo.IdVo;
import com.shadow.template.modules.rbac.service.RoleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/roles")
public class RoleController {

  @Autowired
  private RoleService roleService;

  @GetMapping
  @PreAuthorize("hasAuthority('role:list')")
  public Result<PageResult<RoleListVo>> list(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int pageSize,
      @RequestParam(required = false) String keyword) {
    return Result.success(roleService.list(page, pageSize, keyword));
  }

  @PostMapping
  @PreAuthorize("hasAuthority('role:create')")
  public Result<IdVo> create(@RequestBody @Valid RoleCreateDto dto) {
    return Result.success(new IdVo(roleService.create(dto)));
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('role:detail')")
  public Result<RoleDetailVo> getById(@PathVariable Long id) {
    return Result.success(roleService.getById(id));
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('role:update')")
  public Result<Void> update(@PathVariable Long id, @RequestBody RoleUpdateDto dto) {
    roleService.update(id, dto);
    return Result.success();
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('role:delete')")
  public Result<Void> delete(@PathVariable Long id) {
    roleService.delete(id);
    return Result.success();
  }

  @GetMapping("/{id}/permissions")
  @PreAuthorize("hasAuthority('role:detail')")
  public Result<List<Long>> getPermissions(@PathVariable Long id) {
    return Result.success(roleService.getPermissionIds(id));
  }

  @PutMapping("/{id}/permissions")
  @PreAuthorize("hasAuthority('role:update')")
  public Result<Void> assignPermissions(@PathVariable Long id, @RequestBody @Valid RolePermissionIdsDto dto) {
    roleService.assignPermissions(id, dto.getPermissionIds());
    return Result.success();
  }
}
