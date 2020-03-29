package ch.ge.social.qeli.api.formulaire;

import com.fasterxml.jackson.annotation.JsonRootName;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonRootName(value = "documentContent")
public class Formulaire {

    List<Answer> answers;

    List<String> prestationDejaPercues;

    List<String> prestationEligible;

    List<Refus> prestationRefusees;

}
