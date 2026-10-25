package menucarga.concessao;

import org.springframework.stereotype.Service;

@Service
public class ConcessaoService {

  static final String PATH = "/modulos/menu";

  private final ConcessaoRepository repository;

  public ConcessaoService(ConcessaoRepository repository) {
    this.repository = repository;
  }

  public void conceder(String pessoa, String modulo, String path, String direito) {
    repository.save(new Concessao(pessoa, modulo, path, direito));
  }

  public boolean permitido(String pessoa) {
    return repository.existsByPessoaAndPathAndAtivaTrue(pessoa, PATH);
  }
}
