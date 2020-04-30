package ch.ge.social.qeli.service.stats;

import ch.ge.social.qeli.service.api.pdf.dto.Eligibilite;
import ch.ge.social.qeli.service.api.pdf.dto.EligibiliteRefusee;
import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;
import ch.ge.social.qeli.service.api.pdf.dto.answer.Answer;
import ch.ge.social.qeli.service.api.pdf.dto.answer.ToAnswerValueVisitor;
import ch.ge.social.qeli.service.api.stats.StatsService;
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
    for (Map.Entry<String, Answer> answer : answers.entrySet()) {
      answer.getValue().accept(new ToAnswerValueVisitor(answer.getKey()))
            .forEach(answerValue ->
                       sb.append(buildLigne(id, DataType.REPONSE, answerValue.getKey(), answerValue.getValue()))
            );
    }
    return sb.toString();
  }

  private String prepareRefus(String id, List<EligibiliteRefusee> eligibiliteRefusees) {
    StringBuilder sb = new StringBuilder();
    eligibiliteRefusees.forEach(refus -> {
      ReponseStatus status = refus.isDejaPercue() ? ReponseStatus.DEJA_PERCUE : ReponseStatus.REFUSE;
      String key = refus.getEligibilite().getPrestation().name() + "_" + refus.getEligibilite().getMembre().getId();
      sb.append(buildLigne(id, DataType.RESULTAT, key, status.value));
    });
    return sb.toString();
  }

  private String prepareEligibilite(String id, List<Eligibilite> eligibilites) {
    StringBuilder sb = new StringBuilder();
    eligibilites.forEach(eligible -> {
      String key = eligible.getPrestation().name() + "_" + eligible.getMembre().getId();
      sb.append(buildLigne(id, DataType.RESULTAT, key, ReponseStatus.ELIGIBLE.value));
    });
    return sb.toString();

  }

  private String getKey(String key) {
    return key.contains("_")
           ? key.substring(key.indexOf("_") + 1)
           : "";
  }

  private String getMembre(String key) {
    return key.contains("_")
           ? key.substring(0, key.indexOf("_"))
           : key;
  }

  private String buildLigne(String id, DataType type, String key, String value) {
    StringBuilder res = new StringBuilder();

    return res.append(id)
              .append(";")
              .append(type.value)
              .append(";")
              .append(getKey(key))
              .append(";")
              .append(getMembre(key))
              .append(";")
              .append(value)
              .append("|")
              .toString();
  }
}
