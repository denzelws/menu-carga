package menucarga.concessao;

public class ConcessaoDuplicadaException extends RuntimeException {

  public ConcessaoDuplicadaException() {
    super("concessao duplicada");
  }
}
