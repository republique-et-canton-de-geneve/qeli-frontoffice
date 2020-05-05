package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import ch.ge.social.qeli.service.api.answer.InvalidAnswerFormatException;
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
    @Type(value = TauxAnswer.class, name = "taux"),
    @Type(value = NationaliteAnswer.class, name = "nationalite"),
    @Type(value = CompositeAnswer.class, name = "composite")
  }
)
public interface Answer {
  <T> T accept(AnswerVisitor<T> visitor) throws InvalidAnswerFormatException;
}
