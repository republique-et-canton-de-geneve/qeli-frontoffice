package ch.ge.social.qeli.service.stats;

import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;
import ch.ge.social.qeli.service.api.stats.StatsService;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Properties;
import java.util.UUID;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

/**
 * Une implementation du service de création de PDF qui utilise le service de l'éditique..
 */
@Service
public class StatsServiceImpl implements StatsService {

  private static Logger logger = LoggerFactory.getLogger(StatsService.class);

  @Autowired
  public  StatsServiceImpl(@Value("classpath:/stats-log4j.properties") Resource src) throws IOException{
    try (InputStream input = src.getInputStream()) {
      Properties props = new Properties();
      props.load(input);
      PropertyConfigurator.configure(props);
    }

  }

  @Override
  public void saveFormData(QeliResult result){

    String id = UUID.randomUUID().toString();
    String data = result.toString();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
    String formatDateTime = LocalDateTime.now().format(formatter);

    StringBuilder sb = new StringBuilder();
    sb.append(id).append(";").append(formatDateTime).append(";").append(data).append("|");

    logger.info(sb.toString());
  }

}
