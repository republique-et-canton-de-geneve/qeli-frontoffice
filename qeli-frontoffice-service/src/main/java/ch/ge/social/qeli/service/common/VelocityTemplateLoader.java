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

package ch.ge.social.qeli.service.common;

import java.util.Properties;
import org.apache.velocity.Template;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.stereotype.Component;

/**
 * Une class utilitaire qui permet de charger un modèle mustache.
 */
@Component
public class VelocityTemplateLoader {
  private final VelocityEngine velocityEngine;

  public VelocityTemplateLoader() {
    this.velocityEngine = new VelocityEngine();
    Properties p = new Properties();
    p.setProperty("resource.loader", "class");
    p.setProperty("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
    this.velocityEngine.init(p);
  }

  /**
   * Charge et compile le modèle velocity avec le nom donnée.
   *
   * @param name le nom du modèle velocity.
   *
   * @return le modèle velocity compilé.
   */
  public Template load(String name) {
    return velocityEngine.getTemplate(String.format("template/%s", name));
  }
}
