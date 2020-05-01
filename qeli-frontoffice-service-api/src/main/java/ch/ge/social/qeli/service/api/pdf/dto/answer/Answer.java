package ch.ge.social.qeli.service.api.pdf.dto.answer;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * Un modèle représentant la réponse de l'utilistateur à une question.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes(
  {
    @Type(value = OptionAnswer.class, name = "option"),
    @Type(value = StringAnswer.class, name = "string"),
    @Type(value = NumberAnswer.class, name = "number"),
    @Type(value = DateAnswer.class, name = "date"),
    @Type(value = CheckboxGroupAnswer.class, name = "checkbox-group"),
    @Type(value = NationaliteAnswer.class, name = "nationalite"),
    @Type(value = CompositeAnswer.class, name = "composite")
  }
)
public interface Answer {

  abstract <T> T accept(AnswerModel<T> visitor) throws ToAnswerValueVisitor.InvalidAnswerFormat;

}
