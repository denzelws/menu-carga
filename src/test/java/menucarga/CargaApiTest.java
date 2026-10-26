package menucarga;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CargaApiTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void gravaSoALinhaValidaEDevolveOErroDaLinha() throws Exception {
    String csv = """
      pessoa,modulo,path,direito
      Ana,Cardapio,/modulos/menu,ACESSO
      ,Cardapio,/modulos/menu,ACESSO
      """;

    mockMvc.perform(multipart("/cargas").file(csv("carga.csv", csv)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.persisted").value(1))
      .andExpect(jsonPath("$.errors[0].line").value(3))
      .andExpect(jsonPath("$.errors[0].message").value("campo obrigatorio"));

    mockMvc.perform(get("/modulos/menu").param("pessoa", "Ana"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.permitido").value(true));
  }

  @Test
  void arquivoAusenteVazioOuCabeçalhoErradoNaoPersiste() throws Exception {
    mockMvc.perform(post("/cargas"))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$.error").value("arquivo rejeitado"));

    mockMvc.perform(multipart("/cargas").file(csv("vazio.csv", "")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$.error").value("arquivo rejeitado"));

    mockMvc.perform(multipart("/cargas").file(csv("errado.csv", "nome,idade\nAna,1\n")))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$.error").value("arquivo rejeitado"));

    mockMvc.perform(get("/modulos/menu").param("pessoa", "Ana"))
      .andExpect(jsonPath("$.permitido").value(false));
  }

  @Test
  void soCabeçalhoPersisteZero() throws Exception {
    mockMvc.perform(multipart("/cargas").file(csv("so.csv", "pessoa,modulo,path,direito\n")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.persisted").value(0))
      .andExpect(jsonPath("$.errors").isEmpty());
  }

  @Test
  void pathOuDireitoInvalidoNaoGravaALinha() throws Exception {
    String csv = """
      pessoa,modulo,path,direito
      Ana,Cardapio,/outro,ACESSO
      Bruno,Cardapio,/modulos/menu,LEITURA
      """;

    mockMvc.perform(multipart("/cargas").file(csv("regras.csv", csv)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.persisted").value(0))
      .andExpect(jsonPath("$.errors[0].line").value(2))
      .andExpect(jsonPath("$.errors[0].message").value("path invalido"))
      .andExpect(jsonPath("$.errors[1].line").value(3))
      .andExpect(jsonPath("$.errors[1].message").value("direito invalido"));
  }

  @Test
  void linhaDuplicadaNaoGravaDeNovo() throws Exception {
    String repetida = """
      pessoa,modulo,path,direito
      Ana,Cardapio,/modulos/menu,ACESSO
      Ana,Cardapio,/modulos/menu,ACESSO
      """;

    mockMvc.perform(multipart("/cargas").file(csv("repetida.csv", repetida)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.persisted").value(1))
      .andExpect(jsonPath("$.errors[0].line").value(3))
      .andExpect(jsonPath("$.errors[0].message").value("concessao duplicada"));

    String contraBanco = """
      pessoa,modulo,path,direito
      Ana,Cardapio,/modulos/menu,ACESSO
      """;

    mockMvc.perform(multipart("/cargas").file(csv("banco.csv", contraBanco)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.persisted").value(0))
      .andExpect(jsonPath("$.errors[0].line").value(2))
      .andExpect(jsonPath("$.errors[0].message").value("concessao duplicada"));

    mockMvc.perform(get("/modulos/menu").param("pessoa", "Ana"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.permitido").value(true));
  }

  private MockMultipartFile csv(String nome, String conteudo) {
    return new MockMultipartFile("arquivo", nome, "text/csv", conteudo.getBytes());
  }
}
