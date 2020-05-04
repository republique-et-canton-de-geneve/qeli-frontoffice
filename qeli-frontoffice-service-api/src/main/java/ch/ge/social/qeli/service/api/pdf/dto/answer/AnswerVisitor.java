package ch.ge.social.qeli.service.api.pdf.dto.answer;

import ch.ge.social.qeli.service.api.exception.InvalidAnswerFormat;

/**
 * Interface Visitor Model
 */
public interface AnswerVisitor<T> {

  T visitCheckboxGroupAnswer(CheckboxGroupAnswer answer) throws InvalidAnswerFormat;

  T visitDateAnser(DateAnswer answer);

  T visitOptionAnswer(OptionAnswer answer);

  T visitNationaliteAnswer(NationaliteAnswer answer);

  T visitNumberAnswer(NumberAnswer answer);

  T visitTextAnswer(StringAnswer answer);

  T visitCompositeAnswer(CompositeAnswer answer) throws InvalidAnswerFormat;

}
