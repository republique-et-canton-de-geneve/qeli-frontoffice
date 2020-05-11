package ch.ge.social.qeli.service.pdf;

import ch.ge.social.qeli.service.api.result.dto.Prestation;
import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BodyTemplateParameters {
  List<Prestation> prestationsDejaPercues;
  List<Prestation> prestationsEligibles;
  List<Prestation> prestationsRefusees;
}
