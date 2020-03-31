package ch.ge.social.qeli.api.controller;

import ch.ge.social.qeli.serviceapi.PDFCreationService;
import ch.ge.social.qeli.serviceapi.dto.Formulaire;
import java.io.IOException;
import java.nio.file.Files;
import javax.xml.bind.JAXBException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@ComponentScan("ch.ge.social.qeli.api.controller")
@RestController
@RequestMapping("/api")
public class PDFGenerationController {

  @Autowired
  PDFCreationService pdfCreationService;

  @Value("classpath:hbt.pdf")
  Resource src;

  @PostMapping(value = "/pdf", consumes ={MediaType.APPLICATION_JSON_VALUE})
  public byte[] generatePDF(@RequestBody Formulaire form) throws IOException, JAXBException {

    this.pdfCreationService.generatePDF(form);


    return Files.readAllBytes(src.getFile().toPath());
  }



}
