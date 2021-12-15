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

package ch.ge.social.qeli.api.controller.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Un controller REST qui permet de récupérer des informations sur la version actuelle de l'application.
 */
@RestController
@RequestMapping("/api/configuration")
public class QeliConfigurationPropertiesController {
  private final QeliConfigurationProperties qeliConfigurationProperties;

  /**
   * Constructeur par défaut du controller.
   *
   * @param qeliConfigurationProperties la configuration du formulaire.
   */
  @Autowired
  public QeliConfigurationPropertiesController(QeliConfigurationProperties qeliConfigurationProperties) {
    this.qeliConfigurationProperties = qeliConfigurationProperties;
  }

  /**
   * Récupère les paramètres de configuration du front office de l'application.
   *
   * @return les paramètres de configuration du front office de l'application.
   */
  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public QeliConfigurationProperties getQeliConfigurationProperties() {
    return qeliConfigurationProperties;
  }
}
