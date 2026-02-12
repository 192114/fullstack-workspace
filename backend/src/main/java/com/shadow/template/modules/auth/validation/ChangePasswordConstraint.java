package com.shadow.template.modules.auth.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ChangePasswordConstraintValidator.class)
@Documented
public @interface ChangePasswordConstraint {
  String message() default "旧密码或验证码二选一必填";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
