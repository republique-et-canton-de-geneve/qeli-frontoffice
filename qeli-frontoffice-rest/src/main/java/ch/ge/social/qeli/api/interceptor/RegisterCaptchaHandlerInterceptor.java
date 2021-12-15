/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
