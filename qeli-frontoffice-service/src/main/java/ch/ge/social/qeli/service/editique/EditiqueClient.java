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

package ch.ge.social.qeli.service.editique;

import ch.ge.cti.fwk.cmp.dialogue.outils.rapport.OutilsRapportDialogue;
import ch.ge.cti.fwk.cmp.dialogue.outils.rapport.Report;
import ch.ge.cti.fwk.cmp.dialogue.outils.rapport.ReportFormat;
import ch.ge.social.qeli.xml.edition.RapportType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.stereotype.Component;
import org.springframework.xml.transform.StringResult;
import outils.exception.CtiException;

/**
 * Un service pour la comunnication avec l'éditique.
 */
@Component
public class EditiqueClient {

  private final OutilsRapportDialogue outilsRapport;
  private final Jaxb2Marshaller       marshaller;

  @Autowired
  public EditiqueClient(OutilsRapportDialogue outilsRapport,
                        @Qualifier("editiqueJaxbMarshaller") Jaxb2Marshaller marshaller) {
    this.outilsRapport = outilsRapport;
    this.marshaller = marshaller;
  }

  /**
   * Demande la génération d'un document à l'éditique pour le rapport en paramètre.
   *
   * @param rapport le rapport avec les contenus attendu dans le document resultant.
   *
   * @return le document.
   *
   * @throws EditiqueClientException si la communication avec l'éditique échoue.
   */
  public byte[] generateDocument(RapportType rapport) {
    try {
      Report report = outilsRapport.createReport(toModel(rapport), toXmlString(rapport), ReportFormat.PDF);
      return report.getData();
    } catch (CtiException e) {
      throw new EditiqueClientException("Un problème est survenur lors de la géneration du rapport", e);
    }
  }

  private String toXmlString(RapportType rapport) {
    StringResult result = new StringResult();
    marshaller.marshal(rapport, result);
    return result.toString();
  }

  private String toModel(RapportType rapport) {
    return rapport.getDEBUTDOCUMENT()
                  .getDOCUMENT()
                  .getNomModele();
  }


}
