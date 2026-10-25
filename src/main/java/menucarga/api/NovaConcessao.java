package menucarga.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record NovaConcessao(
  @NotBlank String pessoa,
  @NotBlank String modulo,
  @NotBlank @Pattern(regexp = "/modulos/menu") String path,
  @NotBlank @Pattern(regexp = "ACESSO") String direito
) {
}
