package ch.ge.social.qeli.service.stats;

import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;
import ch.ge.social.qeli.service.api.pdf.dto.answer.Answer;
import ch.ge.social.qeli.service.api.stats.StatsService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Une implementation du service de stats, les données provenant du formulaire sont ajoutées à un log journal au format
 * csv.
 */
@Service
public class StatsServiceImpl implements StatsService {

  private static Logger logger = LoggerFactory.getLogger(StatsServiceImpl.class);

  @Override
  public void saveFormData(QeliResult result) {
    String type;
    String key;


    for (Map.Entry<String, Answer> answer : result.getAnswers().entrySet()) {
      // key = key de question (prestation, parentsEnfants ...) ; Value = c'est ici qu'il faut visitor pour recuperer la donnée.
      // Le visitor du value va donner une clef et une value que l'on mettra dans clef | value
      type = DataType.REPONSE.value;




    }
    result.getAnswers();

    String id = UUID.randomUUID().toString();
    String data = result.toString();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
    String formatDateTime = LocalDateTime.now().format(formatter);

    StringBuilder sb = new StringBuilder();
    sb.append(id).append(";").append(formatDateTime).append(";").append(data).append("|");

    logger.trace(sb.toString());
  }



}
