import { readFile, writeFile } from 'node:fs/promises'

const source = await readFile(new URL('../src/features/learning/questions.ts', import.meta.url), 'utf8')
const extract = (name, following) => JSON.parse(source.match(new RegExp(`export const ${name}: Question\\[\\] = ([\\s\\S]*?)\\n\\nexport const ${following}`))[1])
const official = extract('officialQuestions', 'trainingQuestions')
const training = extract('trainingQuestions', 'finalOfficialIds')
const finalIds = JSON.parse(source.match(/export const finalOfficialIds = (\[[^\n]+\])/)[1]).map((index) => official[index].id)
const map = (questions) => Object.fromEntries(questions.map((question) => [question.id, question.correct]))

await writeFile(new URL('../supabase/functions/crew-api/answers.ts', import.meta.url), `export const OFFICIAL = ${JSON.stringify(map(official))} as Record<string, string>\nexport const TRAINING = ${JSON.stringify(map(training))} as Record<string, string>\nexport const FINAL_IDS = ${JSON.stringify(finalIds)} as string[]\n`)
