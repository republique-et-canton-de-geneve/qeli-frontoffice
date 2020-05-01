package ch.ge.social.qeli.service.stats;

import ch.ge.social.qeli.service.api.pdf.dto.Eligibilite;
import ch.ge.social.qeli.service.api.pdf.dto.EligibiliteRefusee;
import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;
import ch.ge.social.qeli.service.api.pdf.dto.answer.Answer;
import ch.ge.social.qeli.service.api.pdf.dto.answer.ToAnswerValueVisitor;
import ch.ge.social.qeli.service.api.stats.StatsService;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.opencsv.CSVWriter;

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

    try {
      builder.append(prepareAnswers(uuid, result.getAnswers()))
             .append(prepareRefus(uuid, result.getEligibiliteRefusees()))
             .append(prepareEligibilite(uuid, result.getEligibilites()));
    } catch (ToAnswerValueVisitor.InvalidAnswerFormat invalidAnswerFormat) {
      invalidAnswerFormat.printStackTrace();
    }

    logger.trace(builder.toString());
  }

  private String prepareAnswers(String id, Map<String, Answer> answers)
    throws ToAnswerValueVisitor.InvalidAnswerFormat {
    StringBuilder sb = new StringBuilder();
    answers.entrySet().stream()
         .map(answer -> {
           try {
             return answer.getValue().accept(new ToAnswerValueVisitor(answer.getKey()));
           } catch (ToAnswerValueVisitor.InvalidAnswerFormat invalidAnswerFormat) {
             invalidAnswerFormat.printStackTrace();
           }
           return null;
         })
         .flatMap(List::stream) // Décompose les listes : Stream<List<AnswerValue>> devient Stream<AnswerVAlue>
         .forEach(answerValue ->  sb.append(buildLigne(id, DataType.REPONSE, answerValue.getKey(), answerValue.getValue())));

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
    StringWriter sw = new StringWriter();
    try {
      CSVWriter writer = null;
      writer = new CSVWriter(sw, ';', '"', ';', "|");
      // feed in your array (or convert your data to an array)
      StringBuilder sb = new StringBuilder();
      String[] entries = sb.append(id)
                           .append(";")
                           .append(escapeSeparator(type.value))
                           .append(";")
                           .append(escapeSeparator(getKey(key)))
                           .append(";")
                           .append(escapeSeparator(getMembre(key)))
                           .append(";")
                           .append(escapeSeparator(value))
                           .toString()
                           .split(";");
      writer.writeNext(entries);
      writer.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
    return sw.toString();
  }

  private String escapeSeparator(String toEscape) {
    return toEscape.replaceAll("[;|]", "");
  }
}
