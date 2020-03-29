package ch.ge.social.qeli.api.controller;

import ch.ge.social.qeli.api.formulaire.Formulaire;
import ch.ge.social.qeli.api.formulaire.jaxb.DebutDocument;
import ch.ge.social.qeli.api.formulaire.jaxb.Document;
import ch.ge.social.qeli.api.formulaire.jaxb.Expediteur;
import ch.ge.social.qeli.api.formulaire.jaxb.Metier;
import ch.ge.social.qeli.api.formulaire.jaxb.Rapport;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;
import java.awt.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Calendar;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class QeliGUIController {

  @Value("classpath:hbt.pdf")
  Resource src;

  @Value("classpath:template.yml")
  Resource templateSrc;

  @PostMapping(value = "/pdf", consumes ={MediaType.APPLICATION_JSON_VALUE})
  byte[] generatePDF(@RequestBody String body) throws IOException, JAXBException {

    ObjectMapper mapper = new ObjectMapper();
    mapper.enable(SerializationFeature.WRAP_ROOT_VALUE);
    mapper.enable(DeserializationFeature.UNWRAP_ROOT_VALUE);
    Formulaire form = mapper.readValue(body, Formulaire.class);

    JAXBContext context = JAXBContext.newInstance(Rapport.class);
    Marshaller marshaller = context.createMarshaller();

    marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

    //TODO : faire l'appel à l'éditique client pour generer le pdf avec l'output de ce marshal et le return
    marshaller.marshal(constructXmlForEditique(form), System.out);

    return Files.readAllBytes(src.getFile().toPath());
  }

  Rapport constructXmlForEditique(Formulaire form) throws IOException {

    MustacheFactory mf = new DefaultMustacheFactory();
    Mustache mustache = mf.compile(templateSrc.getFile().getAbsolutePath());
    String formatDataForEditique = mustache.execute(new PrintWriter(System.out), form).toString();

    Expediteur exp = new Expediteur("Departement de la cohésion sociale", "Centre de compétence du RDU");
    Metier metier = new Metier(formatDataForEditique);
    Document doc = new Document("QELI", LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.YYYY")), "Genève", exp);
    DebutDocument dd = new DebutDocument(doc, metier);
    Rapport rapport = new Rapport(dd);

    return rapport;
  }

}
