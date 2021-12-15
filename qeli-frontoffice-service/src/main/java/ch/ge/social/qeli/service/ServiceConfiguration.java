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

package ch.ge.social.qeli.service;

import ch.ge.cti.fwk.cmp.dialogue.outils.rapport.OutilsRapportDialogue;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import javax.xml.bind.Marshaller;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import outils.exception.CtiMetierException;

/**
 * Classe de configuration Spring pour la couche de services.
 */
@Configuration
@ComponentScan("ch.ge.social.qeli.service")
public class ServiceConfiguration {

  @Bean("editiqueJaxbMarshaller")
  public Jaxb2Marshaller editiqueJaxbMarshaller() {
    Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
    marshaller.setContextPaths("ch.ge.social.qeli.xml.edition");
    marshaller.setMarshallerProperties(Collections.singletonMap(Marshaller.JAXB_ENCODING, "ISO-8859-1"));
    return marshaller;
  }

  @Bean
  public OutilsRapportDialogue outilsRapportDialogue(
    @Value("${social.tools.editique.ws-location}") String wsLocation
  ) throws MalformedURLException, CtiMetierException {
    return new OutilsRapportDialogue(new URL(wsLocation));
  }
}
