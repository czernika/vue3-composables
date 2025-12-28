export default {
    '**/*.ts': [
        'bunx --bun biome format --write',
        'bunx --bun biome lint --write',
    ],
}
