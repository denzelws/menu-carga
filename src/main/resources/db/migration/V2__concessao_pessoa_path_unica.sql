alter table concessao
  add constraint concessao_pessoa_path_uk unique (pessoa, path);
