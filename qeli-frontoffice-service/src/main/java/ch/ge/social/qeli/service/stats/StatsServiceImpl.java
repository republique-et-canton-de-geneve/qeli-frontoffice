package ch.ge.social.qeli.service.stats;

import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;
import ch.ge.social.qeli.service.api.pdf.dto.answer.AnswerValue;
import ch.ge.social.qeli.service.api.pdf.dto.answer.ToAnswerValueVisitor;
import ch.ge.social.qeli.service.api.stats.StatsService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
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

    List<AnswerValue> answerValues =
      result.getAnswers().entrySet().stream().flatMap(answer -> answer.getValue().accept((new ToAnswerValueVisitor(answer.getKey()))).stream()).collect(Collectors.toList());

    answerValues.forEach(System.out::println);

    String id = UUID.randomUUID().toString();
    String data = result.toString();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
    String formatDateTime = LocalDateTime.now().format(formatter);

    StringBuilder sb = new StringBuilder();
    sb.append(id).append(";").append(formatDateTime).append(";").append(data).append("|");

    logger.trace(sb.toString());
  }



}
