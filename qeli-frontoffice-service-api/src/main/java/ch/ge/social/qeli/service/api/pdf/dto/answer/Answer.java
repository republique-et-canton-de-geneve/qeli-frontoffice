package ch.ge.social.qeli.service.api.pdf.dto.answer;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes(
  {
    @Type(value = CheckboxGroupAnswer.class, name = "checkbox-group"),
    @Type(value = OptionAnswer.class, name = "option")
  }
)
public interface Answer {

}
