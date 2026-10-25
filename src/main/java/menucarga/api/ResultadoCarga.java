package menucarga.api;

import java.util.List;

public record ResultadoCarga(int persisted, List<ErroDeLinha> errors) {
}
