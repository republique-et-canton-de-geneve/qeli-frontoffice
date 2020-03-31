package ch.ge.social.qeli.service;

import ch.ge.social.qeli.serviceapi.DataFormatterService;
import ch.ge.social.qeli.serviceapi.dto.Formulaire;
import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;
import java.io.IOException;
import java.io.StringWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class DataFormatterServiceImpl implements DataFormatterService {

  @Value("classpath:template.yml")
  Resource templateSrc;

  public String formatData(Formulaire form) throws IOException {

    MustacheFactory mf = new DefaultMustacheFactory();
    Mustache mustache = mf.compile(templateSrc.getFile().getAbsolutePath());
    String formatDataForEditique = mustache.execute(new StringWriter(), form).toString();

    return formatDataForEditique;
  }


}
