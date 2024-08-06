# Project for AODN portal v2

## Getting Started

To set up this project locally, follow these steps using Yarn and Vite for a smooth development experience.

## Prerequisites

- Node.js installed on your system with version 18.x || >=20.0.0 (you can use [nvm](https://github.com/nvm-sh/nvm) for changing the node version).
- Npm installed on your system with version >=8.0.0

## Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
```

2. **Navigate to the project directory:**

```bash
cd <project-name>
```

3. **Install the project dependencies:**

```bash
yarn install
```

4. **Run dev mode:**

```bash
yarn dev
```

This will start the project on a local server, typically http://localhost:5173/, and you can begin exploring the enhanced data visualization features.

## Dependencies

List of primary dependencies:

- React
- Vite
- Material UI
- ESLint
- Prettier
- Husky
- Vitest
- Mapbox

## Configuration

- `.eslintrc.js` for linting rules
- `vite.config.ts` for Vite build tool configuration
- `tsconfig.json` for TypeScript configuration
- `docker-compose` and `dockerfile` for Docker configuration
- `AppThene.ts` for css theme

## Styles

We are using [material ui](https://mui.com/material-ui/) and our configuration theme file it's in `AppThene.ts`

## Commit

We are using [gitmoji](https://gitmoji.dev/)(OPTIONAL) with husky and commitlint. Here you have an example of the most used ones:

- :art: - Improving structure/format of the code.
- :zap: - Improving performance.
- :fire: - Removing code or files.
- :bug: - Fixing a bug.
- :ambulance: - Critical hotfix.
- :sparkles: - Introducing new features.
- :memo: - Adding or updating documentation.
- :rocket: - Deploying stuff.
- :lipstick: - Updating the UI and style files.
- :tada: - Beginning a project.

Example of use:
`:wrench: add husky and commitlint config`

## Branching name

- `hotfix/`: for quickly fixing critical issues,
- `usually/`: with a temporary solution
- `bugfix/`: for fixing a bug
- `feature/`: for adding, removing or modifying a feature
- `test/`: for experimenting something which is not an issue
- `wip/`: for a work in progress

And add the issue id after an `/` followed with an explanation of the task.

Example of use:
`feature/5348-create-react-app`

## Feature tips

- On advanced filter, the unit of the barchart(TimeRangeBarChart) will change (year / month / day) according to the selected date range.
