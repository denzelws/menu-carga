package menucarga.carga;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;
import menucarga.api.NovaConcessao;
import org.springframework.stereotype.Component;

@Component
public class ValidadorDeLinha {

  static final String CAMPO_OBRIGATORIO = "campo obrigatorio";
  static final String PATH_INVALIDO = "path invalido";
  static final String DIREITO_INVALIDO = "direito invalido";

  private final Validator validator;

  public ValidadorDeLinha(Validator validator) {
    this.validator = validator;
  }

  public AvaliacaoDeLinha avaliar(String linha) {
    String[] campos = linha.split(",", -1);
    if (campos.length != 4) {
      return AvaliacaoDeLinha.invalida(CAMPO_OBRIGATORIO);
    }
    NovaConcessao concessao = new NovaConcessao(
      campos[0].trim(),
      campos[1].trim(),
      campos[2].trim(),
      campos[3].trim()
    );
    Set<ConstraintViolation<NovaConcessao>> violacoes = validator.validate(concessao);
    if (violacoes.isEmpty()) {
      return AvaliacaoDeLinha.valida(concessao);
    }
    boolean emBranco = violacoes.stream()
      .anyMatch(v -> v.getConstraintDescriptor().getAnnotation() instanceof NotBlank);
    if (emBranco) {
      return AvaliacaoDeLinha.invalida(CAMPO_OBRIGATORIO);
    }
    boolean path = violacoes.stream()
      .anyMatch(v -> "path".equals(v.getPropertyPath().toString()));
    if (path) {
      return AvaliacaoDeLinha.invalida(PATH_INVALIDO);
    }
    return AvaliacaoDeLinha.invalida(DIREITO_INVALIDO);
  }
}
