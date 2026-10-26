package menucarga.carga;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import menucarga.api.ErroDeLinha;
import menucarga.api.NovaConcessao;
import menucarga.api.ResultadoCarga;
import menucarga.concessao.ConcessaoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CargaService {

  static final String CABECALHO = "pessoa,modulo,path,direito";
  static final String DUPLICADA = "concessao duplicada";

  private final LeitorDeLinhas leitor;
  private final ValidadorDeLinha validador;
  private final ConcessaoService concessoes;

  public CargaService(
    LeitorDeLinhas leitor,
    ValidadorDeLinha validador,
    ConcessaoService concessoes
  ) {
    this.leitor = leitor;
    this.validador = validador;
    this.concessoes = concessoes;
  }

  @Transactional
  public ResultadoCarga carregar(InputStream entrada) {
    List<String> linhas = leitor.ler(entrada);
    if (linhas.isEmpty() || !CABECALHO.equals(linhas.get(0).trim())) {
      throw new ArquivoRejeitadoException();
    }

    List<NovaConcessao> validas = new ArrayList<>();
    List<ErroDeLinha> erros = new ArrayList<>();
    Set<String> chavesAceitas = new HashSet<>();
    for (int i = 1; i < linhas.size(); i++) {
      AvaliacaoDeLinha avaliacao = validador.avaliar(linhas.get(i));
      if (!avaliacao.aceita()) {
        erros.add(new ErroDeLinha(i + 1, avaliacao.mensagem()));
        continue;
      }
      NovaConcessao pedido = avaliacao.concessao();
      String chave = pedido.pessoa() + "|" + pedido.path();
      if (chavesAceitas.contains(chave) || concessoes.permitido(pedido.pessoa())) {
        erros.add(new ErroDeLinha(i + 1, DUPLICADA));
        continue;
      }
      chavesAceitas.add(chave);
      validas.add(pedido);
    }

    for (NovaConcessao pedido : validas) {
      concessoes.conceder(
        pedido.pessoa(),
        pedido.modulo(),
        pedido.path(),
        pedido.direito()
      );
    }
    return new ResultadoCarga(validas.size(), erros);
  }
}
