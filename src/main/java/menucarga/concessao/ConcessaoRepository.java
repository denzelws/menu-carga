package menucarga.concessao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConcessaoRepository extends JpaRepository<Concessao, Long> {

  boolean existsByPessoaAndPathAndAtivaTrue(String pessoa, String path);
}
