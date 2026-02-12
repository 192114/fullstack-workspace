package com.shadow.template.modules.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shadow.template.common.exception.BizException;
import com.shadow.template.common.result.Result;
import com.shadow.template.common.result.ResultCode;
import com.shadow.template.common.util.CookieUtils;
import com.shadow.template.common.util.RequestUtils;
import com.shadow.template.config.AppProperties;
import com.shadow.template.modules.auth.dto.ChangePasswordCommand;
import com.shadow.template.modules.auth.dto.ChangePasswordDto;
import com.shadow.template.modules.auth.dto.ForgotPasswordDto;
import com.shadow.template.modules.auth.dto.LogoutDto;
import com.shadow.template.modules.auth.dto.RefreshTokenDto;
import com.shadow.template.modules.auth.dto.RefreshTokenRequestCommand;
import com.shadow.template.modules.auth.dto.ResetPasswordDto;
import com.shadow.template.modules.auth.dto.SendEmailDto;
import com.shadow.template.modules.auth.dto.UserLoginCommand;
import com.shadow.template.modules.auth.dto.UserLoginDto;
import com.shadow.template.modules.auth.dto.UserLogoutCommand;
import com.shadow.template.modules.auth.dto.UserRegisterDto;
import com.shadow.template.modules.auth.dto.UserTokenResult;
import com.shadow.template.modules.auth.enums.EmailUsageEnum;
import com.shadow.template.modules.auth.service.AuthService;
import com.shadow.template.modules.auth.service.EmailService;
import com.shadow.template.modules.auth.vo.TokenResponseVo;
import com.shadow.template.modules.auth.vo.UserMeVo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
  @Autowired
  private AuthService authService;

  @Autowired
  private EmailService mailService;

  @Autowired
  private AppProperties appProperties;

  @PostMapping("/email")
  public Result<Void> send(@RequestBody @Valid SendEmailDto sendEmailDto) {
    final EmailUsageEnum usage = EmailUsageEnum.fromCode(sendEmailDto.getUsage());
    mailService.sendEmail(sendEmailDto.getEmail(), usage);
    return Result.success();
  }

  @PostMapping("/register")
  public Result<Void> register(@RequestBody @Valid UserRegisterDto userRegisterDto) {
    authService.register(userRegisterDto);
    return Result.success();
  }

  @PostMapping("/login")
  public Result<TokenResponseVo> login(@RequestBody @Valid UserLoginDto userLoginDto, HttpServletRequest request,
      HttpServletResponse response) {
    final UserLoginCommand userLoginCommand = new UserLoginCommand();
    userLoginCommand.setEmail(userLoginDto.getEmail());
    userLoginCommand.setPassword(userLoginDto.getPassword());
    userLoginCommand.setLoginType(userLoginDto.getLoginType());
    userLoginCommand.setEmailCode(userLoginDto.getEmailCode());
    userLoginCommand.setIpAddress(RequestUtils.getIpAddress(request));
    userLoginCommand.setUseragent(RequestUtils.getUserAgent(request));
    userLoginCommand.setDeviceId(RequestUtils.getDeviceId(request));
    userLoginCommand.setClientType(RequestUtils.getClientType(request));

    UserTokenResult userTokenDto = authService.login(userLoginCommand);

    final TokenResponseVo tokenResponseVo = new TokenResponseVo();
    tokenResponseVo.setAccessToken(userTokenDto.getToken());
    tokenResponseVo.setRefreshToken(userTokenDto.getRefreshToken());

    String clientType = RequestUtils.getClientType(request);
    if ("web".equalsIgnoreCase(clientType) || "admin".equalsIgnoreCase(clientType)) {
      CookieUtils.setCookie(response, "refreshToken", userTokenDto.getRefreshToken(),
          appProperties.getRefresh().getExpireDays());
    }

    return Result.success(tokenResponseVo);
  }

  @PostMapping("/refresh")
  public Result<TokenResponseVo> refresh(@RequestBody(required = false) RefreshTokenDto body, HttpServletRequest request,
      HttpServletResponse response) {
    String refreshToken = body != null && org.springframework.util.StringUtils.hasText(body.getRefreshToken())
        ? body.getRefreshToken()
        : CookieUtils.getCookie(request, "refreshToken");
    if (!org.springframework.util.StringUtils.hasText(refreshToken)) {
      throw new BizException(ResultCode.TOKEN_INVALID);
    }
    String deviceId = body != null && body.getDeviceId() != null ? body.getDeviceId() : RequestUtils.getDeviceId(request);

    final RefreshTokenRequestCommand refreshTokenRequestCommand = new RefreshTokenRequestCommand();
    refreshTokenRequestCommand.setRefreshToken(refreshToken);
    refreshTokenRequestCommand.setDeviceId(deviceId);
    refreshTokenRequestCommand.setUserAgent(RequestUtils.getUserAgent(request));
    refreshTokenRequestCommand.setIpAddress(RequestUtils.getIpAddress(request));

    final UserTokenResult userTokenDto = authService.refreshToken(refreshTokenRequestCommand);

    final TokenResponseVo tokenResponseVo = new TokenResponseVo();
    tokenResponseVo.setAccessToken(userTokenDto.getToken());
    tokenResponseVo.setRefreshToken(userTokenDto.getRefreshToken());

    String clientType = RequestUtils.getClientType(request);
    if ("web".equalsIgnoreCase(clientType) || "admin".equalsIgnoreCase(clientType)) {
      CookieUtils.setCookie(response, "refreshToken", userTokenDto.getRefreshToken(),
          appProperties.getRefresh().getExpireDays());
    }

    return Result.success(tokenResponseVo);
  }

  @PostMapping("/logout")
  public Result<Void> logout(@RequestBody(required = false) LogoutDto body, HttpServletRequest request,
      HttpServletResponse response) {
    String refreshToken = body != null && org.springframework.util.StringUtils.hasText(body.getRefreshToken())
        ? body.getRefreshToken()
        : CookieUtils.getCookie(request, "refreshToken");
    String deviceId = body != null && body.getDeviceId() != null ? body.getDeviceId() : RequestUtils.getDeviceId(request);

    final UserLogoutCommand userLogoutDto = new UserLogoutCommand();
    userLogoutDto.setRefreshToken(refreshToken);
    userLogoutDto.setDeviceId(deviceId);
    userLogoutDto.setToken(RequestUtils.getToken(request));

    authService.logout(userLogoutDto);
    CookieUtils.deleteCookie(response, "refreshToken");
    return Result.success();
  }

  @PostMapping("/change-password")
  public Result<Void> changePassword(@RequestBody @Valid ChangePasswordDto dto, Authentication authentication) {
    Long userId = Long.parseLong(authentication.getName());
    ChangePasswordCommand cmd = new ChangePasswordCommand();
    cmd.setUserId(userId);
    cmd.setOldPassword(dto.getOldPassword());
    cmd.setEmailCode(dto.getEmailCode());
    cmd.setNewPassword(dto.getNewPassword());
    authService.changePassword(cmd);
    return Result.success();
  }

  @PostMapping("/forgot-password")
  public Result<Void> forgotPassword(@RequestBody @Valid ForgotPasswordDto dto) {
    authService.forgotPassword(dto.getEmail());
    return Result.success();
  }

  @PostMapping("/reset-password")
  public Result<Void> resetPassword(@RequestBody @Valid ResetPasswordDto dto) {
    authService.resetPassword(dto);
    return Result.success();
  }

  @GetMapping("/me")
  public Result<UserMeVo> me(Authentication authentication) {
    Long userId = Long.parseLong(authentication.getName());
    UserMeVo vo = authService.getCurrentUser(userId);
    return Result.success(vo);
  }
}
