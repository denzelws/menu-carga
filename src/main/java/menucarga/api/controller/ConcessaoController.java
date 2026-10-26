package menucarga.api.controller;

import jakarta.validation.Valid;
import menucarga.api.ErroArquivo;
import menucarga.api.NovaConcessao;
import menucarga.api.PermissaoResponse;
import menucarga.concessao.ConcessaoDuplicadaException;
import menucarga.concessao.ConcessaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConcessaoController {

  private final ConcessaoService service;

  public ConcessaoController(ConcessaoService service) {
    this.service = service;
  }

  @PostMapping("/concessoes")
  @ResponseStatus(HttpStatus.CREATED)
  public void criar(@Valid @RequestBody NovaConcessao pedido) {
    service.conceder(
      pedido.pessoa(), pedido.modulo(),
      pedido.path(), pedido.direito()
    );
  }

  @ExceptionHandler(ConcessaoDuplicadaException.class)
  public ResponseEntity<ErroArquivo> duplicada(ConcessaoDuplicadaException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErroArquivo(ex.getMessage()));
  }

  @GetMapping("/modulos/menu")
  public ResponseEntity<PermissaoResponse> consultar(
    @RequestParam(required = false) String pessoa
  ) {
    if (pessoa == null || pessoa.isBlank()) {
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.ok(new PermissaoResponse(service.permitido(pessoa)));
  }
}
