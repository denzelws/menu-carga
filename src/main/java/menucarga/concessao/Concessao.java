package menucarga.concessao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
  name = "concessao",
  uniqueConstraints = @UniqueConstraint(
    name = "concessao_pessoa_path_uk",
    columnNames = { "pessoa", "path" }
  )
)
public class Concessao {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String pessoa;

  @Column(nullable = false)
  private String modulo;

  @Column(nullable = false)
  private String path;

  @Column(nullable = false)
  private String direito;

  @Column(nullable = false)
  private boolean ativa;

  protected Concessao() {
  }

  public Concessao(String pessoa, String modulo, String path, String direito) {
    this.pessoa = pessoa;
    this.modulo = modulo;
    this.path = path;
    this.direito = direito;
    this.ativa = true;
  }
}
