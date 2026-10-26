package menucarga;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ConcessaoApiTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void semConcessaoRespondeNaoPermitido() throws Exception {
    mockMvc.perform(get("/modulos/menu").param("pessoa", "Ana"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.permitido").value(false));
  }

  @Test
  void concessaoValidaLiberaAcessoDaPessoa() throws Exception {
    mockMvc.perform(post("/concessoes")
      .contentType(MediaType.APPLICATION_JSON)
      .content("""
        {"pessoa":"Ana","modulo":"Cardapio","path":"/modulos/menu","direito":"ACESSO"}
        """))
      .andExpect(status().isCreated());

    mockMvc.perform(get("/modulos/menu").param("pessoa", "Ana"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.permitido").value(true));
  }

  @Test
  void menuSemPessoaRespondeOkEInglesNaoExiste() throws Exception {
    mockMvc.perform(get("/modulos/menu"))
      .andExpect(status().isOk());

    mockMvc.perform(get("/modules/menu"))
      .andExpect(status().isNotFound());
  }

  @Test
  void concessaoRepetidaRespondeConflito() throws Exception {
    String corpo = """
      {"pessoa":"Ana","modulo":"Cardapio","path":"/modulos/menu","direito":"ACESSO"}
      """;

    mockMvc.perform(post("/concessoes")
      .contentType(MediaType.APPLICATION_JSON)
      .content(corpo))
      .andExpect(status().isCreated());

    mockMvc.perform(post("/concessoes")
      .contentType(MediaType.APPLICATION_JSON)
      .content(corpo))
      .andExpect(status().isConflict())
      .andExpect(jsonPath("$.error").value("concessao duplicada"));

    mockMvc.perform(get("/modulos/menu").param("pessoa", "Ana"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.permitido").value(true));
  }

  @Test
  void corpoInvalidoNaoPersiste() throws Exception {
    mockMvc.perform(post("/concessoes")
      .contentType(MediaType.APPLICATION_JSON)
      .content("""
        {"pessoa":"","modulo":"Cardapio","path":"/modulos/menu","direito":"ACESSO"}
        """))
      .andExpect(status().isBadRequest());

    mockMvc.perform(get("/modulos/menu").param("pessoa", "Ana"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.permitido").value(false));
  }
}
