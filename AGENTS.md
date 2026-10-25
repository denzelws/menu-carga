# Java Code Style

## Formatting
- Use 2 spaces for each indentation level.
- Never use tabs for indentation.
- Place opening braces on the same line as declarations.
- Keep one blank line between methods and logical blocks.
- Keep annotations aligned with the method or class they annotate.
- Avoid unnecessary blank lines and excessive vertical spacing.

## Method Calls
- Keep method calls on one line when reasonably short.
- For multiline calls, indent arguments consistently by 2 additional spaces.
- Group related arguments on the same line when readability is preserved.
- Prefer compact formatting without sacrificing clarity.

## Naming
- Classes and records: PascalCase.
- Methods and variables: camelCase.
- Constants: UPPER_SNAKE_CASE.

## General Rules
- Apply these conventions consistently across controllers, services, repositories, DTOs, and tests.
- Preserve existing project conventions unless explicitly asked to change them.
- Do not reformat unrelated code unnecessarily.
- Do not introduce abstractions or complexity solely for formatting purposes.
- Follow the project's configured formatter when one exists, unless explicitly instructed otherwise.