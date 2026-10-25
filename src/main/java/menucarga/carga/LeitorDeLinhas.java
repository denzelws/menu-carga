package menucarga.carga;

import java.io.InputStream;
import java.util.List;

public interface LeitorDeLinhas {

  List<String> ler(InputStream entrada);
}
