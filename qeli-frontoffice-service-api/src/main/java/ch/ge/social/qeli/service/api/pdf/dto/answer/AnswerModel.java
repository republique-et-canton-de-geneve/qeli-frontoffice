package ch.ge.social.qeli.service.api.pdf.dto.answer;

/**
 * Interface Visitor Model
 */
public interface AnswerModel<T> {

  T visitCheckboxGroupAnswer(CheckboxGroupAnswer answer) throws ToAnswerValueVisitor.InvalidAnswerFormat;

  T visitDateAnser(DateAnswer answer);

  T visitOptionAnswer(OptionAnswer answer);

  T visitNationaliteAnswer(NationaliteAnswer answer);

  T visitNumberAnswer(NumberAnswer answer);

  T visitTextAnswer(StringAnswer answer);

  T visitCompositeAnswer(CompositeAnswer answer) throws ToAnswerValueVisitor.InvalidAnswerFormat;

}
