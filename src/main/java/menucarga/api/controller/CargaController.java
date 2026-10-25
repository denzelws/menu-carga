package menucarga.api.controller;

import java.io.IOException;
import menucarga.api.ErroArquivo;
import menucarga.carga.ArquivoRejeitadoException;
import menucarga.carga.CargaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class CargaController {

  private final CargaService carga;

  public CargaController(CargaService carga) {
    this.carga = carga;
  }

  @PostMapping("/cargas")
  public ResponseEntity<?> criar(
    @RequestParam(value = "arquivo", required = false) MultipartFile arquivo
  ) throws IOException {
    if (arquivo == null || arquivo.isEmpty()) {
      return rejeitado();
    }
    try {
      return ResponseEntity.ok(carga.carregar(arquivo.getInputStream()));
    } catch (ArquivoRejeitadoException ex) {
      return rejeitado();
    }
  }

  private ResponseEntity<ErroArquivo> rejeitado() {
    return ResponseEntity.badRequest().body(new ErroArquivo("arquivo rejeitado"));
  }
}
