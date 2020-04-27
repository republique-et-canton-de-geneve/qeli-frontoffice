package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ToAnswerValueVisitor implements AnswerVisitorModel<List<AnswerValue>> {

  @Override
  public List<AnswerValue> visitCheckboxGroupAnswer(CheckboxGroupAnswer answers) {
    List<AnswerValue> res = new ArrayList<AnswerValue>();
    if(answers.none != null && answers.none.value != null) {
      res.add(new AnswerValue("key", answers.none.value));
    } else if (answers.choices != null && answers.choices.size() > 0) {
      for (QuestionOption<String> answer : answers.choices) {
        res.add(new AnswerValue("key", answer.value));
      }
    }
    return res;
  }

  @Override
  public List<AnswerValue> visitDateAnser(DateAnswer answer) {
    List<AnswerValue> res = new ArrayList<AnswerValue>();
    DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-YYYY");
    String date = answer.value.format(format);
    res.add(new AnswerValue("key", date));
    return res;
  }

  @Override
  public List<AnswerValue> visitOptionAnswer(OptionAnswer answer) {
    List<AnswerValue> res = new ArrayList<AnswerValue>();
    res.add(new AnswerValue("res", answer.value));
    return res;
  }

  @Override
  public List<AnswerValue> visitNationaliteAnswer(NationaliteAnswer answer) {
    List<AnswerValue> res = new ArrayList<AnswerValue>();
    String nationalite = answer.apatride ? "apatride" : ((QuestionOption<String>)answer.pays).value;
    res.add(new AnswerValue("key", nationalite));
    return res;
  }

  @Override
  public List<AnswerValue> visitNumberAnswer(NumberAnswer answer) {
    List<AnswerValue> res = new ArrayList<AnswerValue>();
    res.add(new AnswerValue("key", String.valueOf(answer.value)));
    return res;
  }

  @Override
  public List<AnswerValue> visitTextAnswer(StringAnswer answer) {
    List<AnswerValue> res = new ArrayList<AnswerValue>();
    res.add(new AnswerValue("key", answer.value));
    return res;
  }

  @Override
  public List<AnswerValue> visitCompositeAnswer(CompositeAnswer answer) {
    List<AnswerValue> res = new ArrayList<AnswerValue>();
    // Map<String, Answer> -> string = key ; Answer.value= value
    for (Map.Entry<String, Answer> item : answer.answers.entrySet()) {
      res.add(new AnswerValue(item.getKey(), "value"));
    }
    return res;
  }
}
