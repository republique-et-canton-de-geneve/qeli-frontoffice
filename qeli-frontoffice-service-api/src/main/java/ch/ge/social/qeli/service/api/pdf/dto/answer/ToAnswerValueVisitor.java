package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ToAnswerValueVisitor implements AnswerVisitorModel<List<AnswerValue>> {

  String key;

  public ToAnswerValueVisitor(String key) {
    this.key = key;
  }

  @Override
  public List<AnswerValue> visitCheckboxGroupAnswer(CheckboxGroupAnswer answers) {
    List<AnswerValue> res = new ArrayList<>();
    if (answers.none != null && answers.none.value != null) {
      res.add(new AnswerValue(key, answers.none.value));
    } else if (answers.choices != null && answers.choices.size() > 0) {
      for (QuestionOption<String> answer : answers.choices) {
        res.add(new AnswerValue(key, answer.value));
      }
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
    String nationalite = answer.apatride ? "apatride" : ((QuestionOption<String>) answer.pays).value;
    res.add(new AnswerValue(key, nationalite));
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
  public List<AnswerValue> visitCompositeAnswer(CompositeAnswer answer) {
    answer.answers.entrySet().stream().map(subAnswer -> subAnswer.getValue().accept(new ToAnswerValueVisitor(subAnswer.getKey())));
                                      // .map(answerValue -> new AnswerValue(key, answerValue.getValue()));

    return null;
  }
}
