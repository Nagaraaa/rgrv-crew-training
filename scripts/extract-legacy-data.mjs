import { readFile, writeFile } from 'node:fs/promises'

const source = await readFile(new URL('../../index.html', import.meta.url), 'utf8')

function legacyArray(start, end) {
  const match = source.match(new RegExp(`const ${start} = ([\\s\\S]*?);\\s*\\n\\s*const ${end}`))
  if (!match) throw new Error(`Impossible de retrouver ${start} dans index.html`)
  return Function(`"use strict"; return (${match[1]})`)()
}

const officialTopics = legacyArray('officialTopics', 'distractors')
const distractors = legacyArray('distractors', 'officialQuestions')
const training = legacyArray('rawTrainingQuestions', 'trainingQuestions')
const finalOfficialIds = [2, 5, 7, 13, 14]

const output = `export type Question = { id: string; question: string; correct: string; wrong: string[]; explanation: string }\n\nexport const officialQuestions: Question[] = ${JSON.stringify(officialTopics.map((topic, index) => ({ id: `official-${index + 1}`, question: topic.q, correct: topic.a, wrong: distractors[index], explanation: topic.a })), null, 2)}\n\nexport const trainingQuestions: Question[] = ${JSON.stringify(training.map((question, index) => ({ id: `training-${index + 1}`, question: question.q, correct: question.correct, wrong: question.wrong, explanation: question.exp })), null, 2)}\n\nexport const finalOfficialIds = ${JSON.stringify(finalOfficialIds)}\n`

await writeFile(new URL('../src/features/learning/questions.ts', import.meta.url), output)
