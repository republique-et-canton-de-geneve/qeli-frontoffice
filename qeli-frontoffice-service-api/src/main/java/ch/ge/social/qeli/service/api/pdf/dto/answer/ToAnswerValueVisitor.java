package ch.ge.social.qeli.service.api.pdf.dto.answer;

import ch.ge.social.qeli.service.api.exception.InvalidAnswerFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ToAnswerValueVisitor implements AnswerVisitor<List<AnswerValue>> {

  String key;

  public static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd-MM-YYYY");

  public ToAnswerValueVisitor(String key) {
    this.key = key;
  }

  @Override
  public List<AnswerValue> visitCheckboxGroupAnswer(CheckboxGroupAnswer answers) throws InvalidAnswerFormat {
    List<AnswerValue> res = new ArrayList<>();
    if (answers.none != null &&
        ("NON".equals(answers.none.value)
         || "INCONNU".equals(answers.none.value))) {
      res.add(new AnswerValue(key, answers.none.value));
    } else if (answers.choices != null && answers.choices.size() > 0) {
      for (QuestionOption<String> answer : answers.choices) {
        res.add(new AnswerValue(key, answer.value));
      }
    } else {
      throw new InvalidAnswerFormat("Invalid checkbox answer format");
    }
    return res;
  }

  @Override
  public List<AnswerValue> visitDateAnser(DateAnswer answer) {
    List<AnswerValue> res = new ArrayList<>();
    String date = answer.value.format(FORMATTER);
    res.add(new AnswerValue(key, date));
    return res;
  }

  @Override
  public List<AnswerValue> visitOptionAnswer(OptionAnswer answer) {
    List<AnswerValue> res = new ArrayList<>();
    res.add(new AnswerValue(key, answer.value.value.toString()));
    return res;
  }

  @Override
  public List<AnswerValue> visitNationaliteAnswer(NationaliteAnswer answer) {
    if (answer.apatride) {
      return Arrays.asList(new AnswerValue(key, "apatride"));
    }

    return answer.pays.stream().map(pays -> {
      return new AnswerValue(key, pays.value);
    }).collect(Collectors.toList());

  }

  @Override
  public List<AnswerValue> visitNumberAnswer(NumberAnswer answer) {
    List<AnswerValue> res = new ArrayList<>();
    res.add(new AnswerValue(key, String.valueOf(answer.value)));
    return res;
  }

  @Override
  public List<AnswerValue> visitTextAnswer(StringAnswer answer) {
    List<AnswerValue> res = new ArrayList<>();
    res.add(new AnswerValue(key, answer.value));
    return res;
  }

  @Override
  public List<AnswerValue> visitCompositeAnswer(CompositeAnswer answer) throws InvalidAnswerFormat {
    List<AnswerValue> res = new ArrayList<>();
    for (Map.Entry<String, Answer> subAnswer : answer.answers.entrySet()) {
      res.addAll(subAnswer.getValue().accept(new ToAnswerValueVisitor(subAnswer.getKey()))
                          .stream()
                          .map(subAnswerValue -> new AnswerValue(this.key, subAnswerValue.getValue()))
                          .collect(Collectors.toList())
      );
    }
    return res;
  }

}
