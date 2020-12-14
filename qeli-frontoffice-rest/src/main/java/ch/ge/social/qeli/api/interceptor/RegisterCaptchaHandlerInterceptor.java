package ch.ge.social.qeli.api.interceptor;

import com.captcha.botdetect.web.servlet.SimpleCaptcha;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * Un intercepteur qui enregistre toutes les métodes REST annoté avec {@link Captcha}.
 */
public class RegisterCaptchaHandlerInterceptor extends HandlerInterceptorAdapter {

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    if (handler instanceof HandlerMethod) {
      HandlerMethod handlerMethod = (HandlerMethod) handler;

      if (hasCaptcha(handlerMethod)) {
        String userEnteredCaptchaCode = request.getParameter("userEnteredCaptchaCode");
        String captchaId = request.getParameter("captchaId");
        SimpleCaptcha captcha = SimpleCaptcha.load(request);

        if (!captcha.validate(userEnteredCaptchaCode, captchaId)) {
          throw new InvalidCaptchaException("Le captcha n'est pas valide");
        }
      }
    }

    return true;
  }

  private boolean hasCaptcha(HandlerMethod handlerMethod) {
    return handlerMethod.getMethodAnnotation(Captcha.class) != null;
  }
}
