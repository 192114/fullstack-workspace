package com.shadow.template.modules.user.service;

import com.shadow.template.modules.user.dto.UserCreateCommand;
import com.shadow.template.modules.user.entity.UserAuthEntity;
import com.shadow.template.modules.user.entity.UserProfileEntity;

public interface UserService {
  boolean isExistByEmail(String email);

  UserAuthEntity getUserByEmail(String email);

  UserAuthEntity getUserById(Long id);

  UserProfileEntity getProfileByUserId(Long userId);

  void createUser(UserCreateCommand user);

  void disabledUser(Long userId);

  void updatePassword(Long userId, String newPasswordHash);
}
