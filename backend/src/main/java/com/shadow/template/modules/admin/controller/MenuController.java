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
import org.springframework.web.bind.annotation.RestController;

import com.shadow.template.common.result.Result;
import com.shadow.template.modules.admin.dto.MenuCreateDto;
import com.shadow.template.modules.admin.dto.MenuUpdateDto;
import com.shadow.template.modules.admin.vo.IdVo;
import com.shadow.template.modules.admin.vo.MenuManagementTreeVo;
import com.shadow.template.modules.rbac.service.MenuService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/menus")
public class MenuController {

  @Autowired
  private MenuService menuService;

  @GetMapping
  @PreAuthorize("hasAuthority('menu:list')")
  public Result<List<MenuManagementTreeVo>> getTree() {
    return Result.success(menuService.getTree());
  }

  @PostMapping
  @PreAuthorize("hasAuthority('menu:create')")
  public Result<IdVo> create(@RequestBody @Valid MenuCreateDto dto) {
    return Result.success(new IdVo(menuService.create(dto)));
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('menu:update')")
  public Result<Void> update(@PathVariable Long id, @RequestBody MenuUpdateDto dto) {
    menuService.update(id, dto);
    return Result.success();
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('menu:delete')")
  public Result<Void> delete(@PathVariable Long id) {
    menuService.delete(id);
    return Result.success();
  }
}
