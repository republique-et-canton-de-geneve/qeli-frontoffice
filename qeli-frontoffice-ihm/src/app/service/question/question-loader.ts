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

import { QeliConfiguration } from '../configuration/qeli-configuration.model';
import { QeliQuestionDecorator } from './qeli-question-decorator.model';
import { Demandeur } from '../configuration/demandeur.model';

/**
 * Une interface qui définit l'API pour un service de chargement de questions.
 */
export abstract class QuestionLoader {
  demandeur: Demandeur;

  constructor(demandeur: Demandeur) {
    this.demandeur = demandeur;
  }

  /**
   * Charge un ensemble de questions avec la configuration donnée.
   *
   * @param configuration un objet contenant tous les paramètres qui concernent la configuration des questions.
   */
  abstract loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[];
}

