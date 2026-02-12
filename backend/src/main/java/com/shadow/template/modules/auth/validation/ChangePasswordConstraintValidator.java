package com.shadow.template.modules.auth.validation;

import org.springframework.util.StringUtils;

import com.shadow.template.modules.auth.dto.ChangePasswordDto;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ChangePasswordConstraintValidator implements ConstraintValidator<ChangePasswordConstraint, ChangePasswordDto> {

  @Override
  public boolean isValid(ChangePasswordDto dto, ConstraintValidatorContext context) {
    if (dto == null) {
      return true;
    }
    boolean hasOldPassword = StringUtils.hasText(dto.getOldPassword());
    boolean hasEmailCode = StringUtils.hasText(dto.getEmailCode());
    return hasOldPassword != hasEmailCode;
  }
}
