import { expect, type Locator, test } from '@playwright/test';

const marca = Date.now();
const pessoaCadastro = `E2E-CAD-${marca}`;
const pessoaCarga = `E2E-CSV-${marca}`;

async function preencher(campo: Locator, valor: string) {
  await expect(async () => {
    await campo.fill(valor);
    await campo.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined)));
        }),
    );
    expect(await campo.inputValue()).toBe(valor);
  }).toPass();
}

test('consulta, grava, recusa duplicata e importa CSV', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'grava uma pessoa por execução');
  await page.goto('/');
  await page.getByRole('button', { name: 'Consultar' }).click();
  await expect(page.getByText('corpo vazio')).toBeVisible();

  await preencher(page.getByLabel('Nome da pessoa'), pessoaCadastro);
  await page.getByRole('button', { name: 'Consultar' }).click();
  await expect(page.getByText('permitido: false')).toBeVisible();

  await page.getByRole('link', { name: 'Concessão Manual' }).click();
  await expect(page.getByLabel('Path')).toHaveValue('/modulos/menu');
  await preencher(page.getByLabel('Nome da pessoa'), pessoaCadastro);
  await preencher(page.getByLabel('Módulo'), 'gestao-estoque');
  await page.getByRole('button', { name: 'Conceder' }).click();
  await expect(page.getByRole('heading', { name: 'Concessão gravada' })).toBeVisible();

  await page.getByRole('button', { name: 'Conceder' }).click();
  await expect(page.getByRole('heading', { name: 'Concessão duplicada' })).toBeVisible();

  await page.getByRole('link', { name: 'Consultar Permissão' }).click();
  await preencher(page.getByLabel('Nome da pessoa'), pessoaCadastro);
  await page.getByRole('button', { name: 'Consultar' }).click();
  await expect(page.getByText('permitido: true')).toBeVisible();

  const csv = [
    'pessoa,modulo,path,direito',
    `${pessoaCarga},gestao-estoque,/modulos/menu,ACESSO`,
    ',gestao-estoque,/modulos/menu,ACESSO',
    '',
  ].join('\n');
  await page.getByRole('link', { name: 'Importação CSV' }).click();
  await page.getByLabel('Arquivo CSV').setInputFiles({
    name: 'lote.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(csv),
  });
  await page.getByRole('button', { name: 'Importar' }).click();
  await expect(page.getByText('1 concessão gravada')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'campo obrigatorio' })).toBeVisible();

  await page.getByRole('link', { name: 'Consultar Permissão' }).click();
  await preencher(page.getByLabel('Nome da pessoa'), pessoaCarga);
  await page.getByRole('button', { name: 'Consultar' }).click();
  await expect(page.getByText('permitido: true')).toBeVisible();
});

test('as três telas cabem na largura do celular', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'só no viewport estreito');
  for (const rota of ['/', '/cadastro', '/cargas']) {
    await page.goto(rota);
    const estoura = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(estoura).toBe(false);
  }
});
