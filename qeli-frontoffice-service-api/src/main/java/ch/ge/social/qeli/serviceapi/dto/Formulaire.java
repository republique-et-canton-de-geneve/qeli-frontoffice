package ch.ge.social.qeli.serviceapi.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Formulaire {

    List<Answer> answers;

    List<String> prestationDejaPercues;

    List<String> prestationEligible;

    List<Refus> prestationRefusees;

}
