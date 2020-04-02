package ch.ge.social.qeli.service.pdf;

import ch.ge.social.qeli.service.api.pdf.dto.Prestation;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

@Value
@AllArgsConstructor
@Builder
public class BodyTemplateParameters {
  List<Prestation> prestationsDejaPercues;
  List<Prestation> prestationsEligibles;
  List<Prestation> prestationsRefusees;
}
