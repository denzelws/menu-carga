package menucarga.carga;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class LeitorCsv implements LeitorDeLinhas {

  @Override
  public List<String> ler(InputStream entrada) {
    try (BufferedReader reader = new BufferedReader(
      new InputStreamReader(entrada, StandardCharsets.UTF_8)
    )) {
      return reader.lines().toList();
    } catch (IOException ex) {
      throw new UncheckedIOException(ex);
    }
  }
}
