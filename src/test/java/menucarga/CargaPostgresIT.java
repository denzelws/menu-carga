package menucarga;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@TestPropertySource(properties = {
  "spring.flyway.enabled=true",
  "spring.jpa.hibernate.ddl-auto=validate",
  "spring.datasource.driver-class-name=org.postgresql.Driver"
})
class CargaPostgresIT {

  @Container
  @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JdbcTemplate jdbc;

  @Test
  void cargaNoPostgresAplicaFlywayEGravaSoALinhaValida() throws Exception {
    String csv = """
      pessoa,modulo,path,direito
      Ana,Cardapio,/modulos/menu,ACESSO
      ,Cardapio,/modulos/menu,ACESSO
      """;

    mockMvc.perform(multipart("/cargas").file(arquivo(csv)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.persisted").value(1))
      .andExpect(jsonPath("$.errors[0].line").value(3))
      .andExpect(jsonPath("$.errors[0].message").value("campo obrigatorio"));

    mockMvc.perform(get("/modulos/menu").param("pessoa", "Ana"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.permitido").value(true));

    Integer versoes = jdbc.queryForObject("""
      select count(*) from flyway_schema_history
      where version in ('1', '2') and success
      """, Integer.class);
    Integer indice = jdbc.queryForObject("""
      select count(*) from pg_indexes
      where indexname = 'concessao_pessoa_path_uk'
      """, Integer.class);
    assertEquals(2, versoes);
    assertEquals(1, indice);
  }

  private MockMultipartFile arquivo(String conteudo) {
    return new MockMultipartFile(
      "arquivo", "carga.csv", "text/csv", conteudo.getBytes()
    );
  }
}
