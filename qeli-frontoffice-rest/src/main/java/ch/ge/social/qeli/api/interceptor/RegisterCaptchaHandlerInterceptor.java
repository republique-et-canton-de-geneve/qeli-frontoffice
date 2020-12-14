package ch.ge.social.qeli.api.interceptor;

import com.captcha.botdetect.web.servlet.SimpleCaptcha;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * Un intercepteur qui enregistre toutes les métodes REST annoté avec {@link Captcha}.
 */
@Component
public class RegisterCaptchaHandlerInterceptor extends HandlerInterceptorAdapter {

  @Override
  public boolean preHandle(
    HttpServletRequest request, HttpServletResponse response, Object handler
  ) throws IOException {
    if (handler instanceof HandlerMethod) {
      HandlerMethod handlerMethod = (HandlerMethod) handler;

      if (hasCaptcha(handlerMethod)) {
        DocumentContext context = JsonPath.parse(request.getReader());
        String userEnteredCaptchaCode = context.read("$.userEnteredCaptchaCode");
        String captchaId = context.read("$.captchaId");
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
