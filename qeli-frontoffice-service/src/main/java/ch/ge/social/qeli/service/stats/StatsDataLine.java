package ch.ge.social.qeli.service.stats;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
class StatsDataLine {
  private final String            id;
  private final StatsDataLineType dataType;
  private final String            key;
  private final String   membre;
  private final String   value;
}
