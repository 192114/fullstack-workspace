package com.shadow.template.modules.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shadow.template.common.result.Result;
import com.shadow.template.modules.admin.vo.PermissionTreeVo;
import com.shadow.template.modules.rbac.service.PermissionService;

@RestController
@RequestMapping("/admin/permissions")
public class PermissionController {

  @Autowired
  private PermissionService permissionService;

  @GetMapping
  @PreAuthorize("hasAuthority('permission:list')")
  public Result<List<PermissionTreeVo>> getTree() {
    return Result.success(permissionService.getTree());
  }
}
