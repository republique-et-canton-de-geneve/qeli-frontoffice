package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ToAnswerValueVisitor implements AnswerModel<List<AnswerValue>> {

  String key;

  public ToAnswerValueVisitor(String key) {
    this.key = key;
  }

  @Override
  public List<AnswerValue> visitCheckboxGroupAnswer(CheckboxGroupAnswer answers) throws InvalidAnswerFormat {
    List<AnswerValue> res = new ArrayList<>();
    if (answers.none != null && "NON".equals(answers.none.value)) {
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
    DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-YYYY");
    String date = answer.value.format(format);
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
    List<AnswerValue> res = new ArrayList<>();
    answer.pays.forEach(
      pays -> {
        String nationalite = answer.apatride ? "apatride" : pays.value;
        res.add(new AnswerValue(key, nationalite));
      });
    return res;
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

  public static class InvalidAnswerFormat extends Exception {
    public InvalidAnswerFormat(String errorMessage) {
      super(errorMessage);
    }
  }
}
