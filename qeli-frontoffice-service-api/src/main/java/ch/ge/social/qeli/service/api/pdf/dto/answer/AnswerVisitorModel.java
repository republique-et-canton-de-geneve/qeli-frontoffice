package ch.ge.social.qeli.service.api.pdf.dto.answer;

/**
 * Interface Visitor Model
 */
public interface AnswerVisitorModel<T> {

  T visitCheckboxGroupAnswer(CheckboxGroupAnswer answer);

  T visitDateAnser(DateAnswer answer);

  T visitOptionAnswer(OptionAnswer answer);

  T visitNationaliteAnswer(NationaliteAnswer answer);

  T visitNumberAnswer(NumberAnswer answer);

  T visitTextAnswer(StringAnswer answer);

  T visitCompositeAnswer(CompositeAnswer answer);

}
