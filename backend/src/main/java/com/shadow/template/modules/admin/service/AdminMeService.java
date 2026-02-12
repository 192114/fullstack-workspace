package com.shadow.template.modules.admin.service;

import com.shadow.template.modules.admin.vo.AdminMeVo;

public interface AdminMeService {

  AdminMeVo getMe(Long userId);
}
