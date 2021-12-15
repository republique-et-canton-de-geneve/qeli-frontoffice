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

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.context.annotation.Configuration;

/**
 * La configuration des paramètres du questionnaire d'éligibilité.
 */
@Data
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties("social.tools.qeli")
@JsonAutoDetect(
  fieldVisibility = Visibility.NONE,
  setterVisibility = Visibility.NONE,
  getterVisibility = Visibility.NONE,
  isGetterVisibility = Visibility.NONE,
  creatorVisibility = Visibility.NONE
)
public class QeliConfigurationProperties {
  /**
   * Le nombre d'années maximales dans le passé saisissable dans un champ de type date.
   */
  @JsonProperty
  private int minYearsFromNow = 130;

  /**
   * Le nombre d'enfants maximales saisissables dans le formulaire.
   */
  @JsonProperty
  private int maxEnfantsACharge = 20;

  /**
   * Le taux minimal d'activité pour une personne seule pour recevoir des prestations complémentaires familiales.
   */
  @JsonProperty
  private int minTauxActiviteSeul = 40;

  /**
   * Le taux minimal d'activité pour personne seule et son conjoint/concubin pour recevoir des prestations
   * complémentaires familiales.
   */
  @JsonProperty
  private int minTauxActiviteAvecConjoint = 90;

  /**
   * La limite de fortune pour être éligible à l'aide sociale pour une personne seule.
   */
  @JsonProperty
  private int limiteFortune = 4000;

  /**
   * La limite de fortune pour être éligible à l'aide sociale pour un enfant à charge.
   */
  @JsonProperty
  private int limiteFortunePerEnfant = 2000;

  /**
   * La limite de fortune pour être éligible à l'aide sociale pour le conjoint.
   */
  @JsonProperty
  private int limiteFortuneConjoint = 4000;

  /**
   * Le nombre d'enfants maximales saisissables dans le formulaire.
   */
  @JsonProperty
  private int maxLimiteFortune = 10000;

  /**
   * Le nombre d'années écoulées depuis la dernière taxation AFC pertinente.
   */
  @JsonProperty
  private int taxationAfcYearsFromNow = 2;

  /**
   * Le nombre d'heure de travail par semaine (consideré comme 100% pour les taux d'activité)
   */
  @JsonProperty
  private int heuresTravailParSemaine = 40;

  /**
   * La configuration matomo.
   */
  @JsonProperty
  @NotNull
  @Valid
  @NestedConfigurationProperty
  private MatomoConfiguration matomo;


  /**
   * Active ou désactive le bandeau cookie
   */
  @JsonProperty
  private boolean cookieBannerEnabled = false;

  @JsonProperty
  @NestedConfigurationProperty
  private ApiConfiguration api = new ApiConfiguration();

  @JsonProperty
  private boolean deepLinkEnabled = true;

}
