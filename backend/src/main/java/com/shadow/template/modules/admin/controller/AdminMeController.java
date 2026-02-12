package com.shadow.template.modules.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shadow.template.common.result.Result;
import com.shadow.template.modules.admin.service.AdminMeService;
import com.shadow.template.modules.admin.vo.AdminMeVo;

@RestController
@RequestMapping("/admin")
public class AdminMeController {

  @Autowired
  private AdminMeService adminMeService;

  @GetMapping("/me")
  public Result<AdminMeVo> me(Authentication authentication) {
    Long userId = Long.parseLong(authentication.getName());
    AdminMeVo vo = adminMeService.getMe(userId);
    return Result.success(vo);
  }
}
