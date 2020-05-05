package ch.ge.social.qeli.service.stats;

import ch.ge.social.qeli.service.api.pdf.dto.Eligibilite;
import ch.ge.social.qeli.service.api.pdf.dto.EligibiliteRefusee;
import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;
import ch.ge.social.qeli.service.api.pdf.dto.answer.Answer;
import ch.ge.social.qeli.service.api.pdf.dto.answer.ToAnswerValueVisitor;
import ch.ge.social.qeli.service.api.stats.StatsService;
import ch.ge.social.qeli.service.common.CannotWrite;
import com.opencsv.CSVWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
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


    StringBuilder builder = new StringBuilder();
    String uuid = UUID.randomUUID().toString();

      builder.append(prepareAnswers(uuid, result.getAnswers()))
             .append(prepareRefus(uuid, result.getEligibiliteRefusees()))
             .append(prepareEligibilite(uuid, result.getEligibilites()));

    logger.trace(builder.toString());
  }

  private String prepareAnswers(String id, Map<String, Answer> answers) {
    StringBuilder sb = new StringBuilder();
    answers.entrySet().stream()
         .map(answer ->
              answer.getValue().accept(new ToAnswerValueVisitor(answer.getKey()))
         )
         .flatMap(List::stream)
         .forEach(answerValue ->  sb.append(buildLigne(id, DataType.REPONSE, getKey(answerValue.getKey()), getMembre(answerValue.getKey()),answerValue.getValue())));

    return sb.toString();
  }

  private String prepareRefus(String id, List<EligibiliteRefusee> eligibiliteRefusees) {

    StringBuilder sb = new StringBuilder();
    eligibiliteRefusees.forEach(refus -> {
      ReponseStatus status = refus.isDejaPercue() ? ReponseStatus.DEJA_PERCUE : ReponseStatus.REFUSE;
      sb.append(buildLigne(id, DataType.RESULTAT, refus.getEligibilite().getPrestation().name(), refus.getEligibilite().getMembre().getId().toString(), status.value));
    });
    return sb.toString();
  }

  private String prepareEligibilite(String id, List<Eligibilite> eligibilites) {
    StringBuilder sb = new StringBuilder();
    eligibilites.forEach(eligible -> {
      sb.append(buildLigne(id, DataType.RESULTAT, eligible.getPrestation().name(), eligible.getMembre().getId().toString(), ReponseStatus.ELIGIBLE.value));
    });
    return sb.toString();

  }

  private String getMembre(String key) {
    return key.contains("_")
           ? key.substring(key.lastIndexOf("_") + 1)
           : "";
  }

  private String getKey(String key) {
    return key.contains("_")
           ? key.substring(0, key.lastIndexOf("_"))
           : key;
  }

  private String buildLigne(String id, DataType type, String key, String membre, String value) {
    StringWriter sw = new StringWriter();
    try {
      CSVWriter writer = new CSVWriter(sw, ';', '"', ';', "|");
      writer.writeNext(new String[]{id, escapeSeparator(type.value), key, membre, value});
      writer.close();
    } catch (IOException e) {
      throw new CannotWrite(e.getMessage());
    }
    return sw.toString();
  }

  private String escapeSeparator(String toEscape) {
    return toEscape.replaceAll("[;|]", "");
  }
}
