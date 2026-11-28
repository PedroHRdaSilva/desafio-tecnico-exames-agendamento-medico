export type ExamSeed = {
  id: number;
  name: string;
  durationMinutes: number;
};

const EXPECTED_HEADER = 'id,nome,duracao_minutos';

export function parseExamsCsv(content: string): ExamSeed[] {
  const lines = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim());

  const [header, ...rows] = lines;

  if (header !== EXPECTED_HEADER) {
    throw new Error(
      `Cabeçalho inválido no exames.csv: esperado "${EXPECTED_HEADER}", recebido "${header}"`,
    );
  }

  const ids = new Set<number>();

  return rows.flatMap((row, index) => {
    if (!row) return [];

    const lineNumber = index + 2;
    const columns = row.split(',');

    if (columns.length !== 3) {
      throw new Error(
        `exames.csv linha ${lineNumber}: esperado 3 colunas, encontrado ${columns.length}`,
      );
    }

    const [rawId, rawName, rawDuration] = columns;
    const id = Number(rawId);
    const name = rawName.trim();
    const durationMinutes = Number(rawDuration);

    if (!Number.isInteger(id) || id < 1) {
      throw new Error(`exames.csv linha ${lineNumber}: id inválido "${rawId}"`);
    }
    if (ids.has(id)) {
      throw new Error(`exames.csv linha ${lineNumber}: id ${id} repetido`);
    }
    if (!name) {
      throw new Error(`exames.csv linha ${lineNumber}: nome vazio`);
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1) {
      throw new Error(
        `exames.csv linha ${lineNumber}: duração inválida "${rawDuration}"`,
      );
    }

    ids.add(id);
    return [{ id, name, durationMinutes }];
  });
}
