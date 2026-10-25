package menucarga.carga;

import menucarga.api.NovaConcessao;

public record AvaliacaoDeLinha(NovaConcessao concessao, String mensagem) {

  static AvaliacaoDeLinha valida(NovaConcessao concessao) {
    return new AvaliacaoDeLinha(concessao, null);
  }

  static AvaliacaoDeLinha invalida(String mensagem) {
    return new AvaliacaoDeLinha(null, mensagem);
  }

  boolean aceita() {
    return mensagem == null;
  }
}
