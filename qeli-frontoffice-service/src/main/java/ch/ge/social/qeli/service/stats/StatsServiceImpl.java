package ch.ge.social.qeli.service.stats;

import ch.ge.social.qeli.service.api.answer.InvalidAnswerFormatException;
import ch.ge.social.qeli.service.api.answer.dto.Answer;
import ch.ge.social.qeli.service.api.demandeur.dto.Demandeur;
import ch.ge.social.qeli.service.api.demandeur.dto.MembreFamille;
import ch.ge.social.qeli.service.api.demandeur.dto.Relation;
import ch.ge.social.qeli.service.api.result.dto.QeliResult;
import ch.ge.social.qeli.service.api.result.dto.Result;
import ch.ge.social.qeli.service.api.result.dto.ResultByPrestation;
import ch.ge.social.qeli.service.api.stats.CannotSaveStatsException;
import ch.ge.social.qeli.service.api.stats.StatsService;
import com.opencsv.CSVWriter;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Une implementation du service de stats, les données provenant du formulaire sont ajoutées à un log journal au format
 * CSV.
 */
@Service
public class StatsServiceImpl implements StatsService {
  private static final Pattern MEMBRE_PATTERN = Pattern.compile("(.+?)_(\\d+)(?:(\\..+$)||$)");
  private static final Logger  logger         = LoggerFactory.getLogger(StatsServiceImpl.class);

  @Override
  public void saveFormData(QeliResult qeliResult) {
    StringWriter sw = new StringWriter();

    try (CSVWriter csvWriter = new CSVWriter(sw)) {
      String uuid = UUID.randomUUID().toString();
      Consumer<StatsDataLine> writeNextLine = stats -> csvWriter.writeNext(new String[]{
        stats.getId(),
        stats.getDataType().name(),
        stats.getKey(),
        stats.getMembre(),
        stats.getValue()
      });

      answersToStatsDataLines(uuid, qeliResult.getAnswers(), qeliResult.getDemandeur()).forEach(writeNextLine);
      resultsByPrestationToStatsDataLines(
        uuid, ResultStatus.ELIGIBLE, qeliResult.getResult().getPrestationsEligibles(), qeliResult.getDemandeur()
      ).forEach(writeNextLine);
      resultsByPrestationToStatsDataLines(
        uuid, ResultStatus.DEJA_PERCUE, qeliResult.getResult().getPrestationsDejaPercues(), qeliResult.getDemandeur()
      ).forEach(writeNextLine);
      resultsByPrestationToStatsDataLines(
        uuid, ResultStatus.REFUSE, qeliResult.getResult().getPrestationsRefusees(), qeliResult.getDemandeur()
      ).forEach(writeNextLine);

      BufferedReader bufReader = new BufferedReader(new StringReader(sw.toString().trim()));
      bufReader.lines().forEach(logger::trace);
    } catch (IOException e) {
      throw new CannotSaveStatsException("Un problème est survenu lors de l'écriture du CSV", e);
    }
  }

  private Stream<StatsDataLine> answersToStatsDataLines(String uuid,
                                                        Map<String, Answer> answers,
                                                        Demandeur demandeur) {
    return answers.entrySet()
                  .stream()
                  .map(answer -> answer.getValue().accept(new ToAnswerValueVisitor(answer.getKey())))
                  .flatMap(List::stream)
                  .map(answerValue -> {
                    if ("prestations" .equals(answerValue.getKey())) {
                      return new AnswerValue(answerValue.getKey(),
                                             interpolateMembre(answerValue.getValue(), demandeur));
                    }
                    return answerValue;
                  })
                  .map(answerValue -> new StatsDataLine(uuid,
                                                        StatsDataLineType.REPONSE,
                                                        toKeyWithoutMembre(answerValue.getKey()),
                                                        toMembre(answerValue.getKey(), demandeur),
                                                        answerValue.getValue()));
  }

  private Stream<StatsDataLine> resultsByPrestationToStatsDataLines(String uuid,
                                                                    ResultStatus status,
                                                                    List<ResultByPrestation> resultByPrestations,
                                                                    Demandeur demandeur) {
    return resultByPrestations.stream()
                              .map(resultByPrestation -> {
                                List<Result> results = resultByPrestation.getResults();
                                return results.stream()
                                              .map(result -> new StatsDataLine(
                                                uuid,
                                                StatsDataLineType.RESULTAT,
                                                resultByPrestation.getPrestation().name(),
                                                membreIdToRelation(result.getMembre().getId(), demandeur),
                                                status.name())
                                              ).collect(Collectors.toList());
                              }).flatMap(List::stream);
  }

  private String membreIdToRelation(Integer id, Demandeur demandeur) {
    return demandeur.getId().equals(id) ?
           "DEMANDEUR" :
           demandeur.getMembresFamille()
                    .stream()
                    .filter(membre -> membre.getId().equals(id))
                    .map(MembreFamille::getRelation)
                    .map(Relation::name)
                    .findFirst().orElse(null);
  }

  private String interpolateMembre(String key, Demandeur demandeur) {
    Matcher matcher = MEMBRE_PATTERN.matcher(key);
    if (matcher.matches()) {
      try {
        Integer id = Integer.parseInt(matcher.group(2));
        return new StringBuilder(key).replace(
          matcher.start(2), matcher.end(2), membreIdToRelation(id, demandeur)
        ).toString();
      } catch (NumberFormatException e) {
        throw new InvalidAnswerFormatException("Impossible de déterminer le membre de la famille", e);
      }
    }

    return key;
  }

  private String toMembre(String key, Demandeur demandeur) {
    Matcher matcher = MEMBRE_PATTERN.matcher(key);
    if (matcher.matches()) {
      try {
        Integer id = Integer.parseInt(matcher.group(2));
        return membreIdToRelation(id, demandeur);
      } catch (NumberFormatException e) {
        throw new InvalidAnswerFormatException("Impossible de déterminer le membre de la famille", e);
      }
    }

    return null;
  }

  private String toKeyWithoutMembre(String key) {
    Matcher matcher = MEMBRE_PATTERN.matcher(key);
    return matcher.matches() ?
           matcher.group(1) + (matcher.group(3) != null ? matcher.group(3) : "") :
           key;
  }
}
