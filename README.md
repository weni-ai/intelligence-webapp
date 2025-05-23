<div align="center">

<img src="https://github.com/Ilhasoft/weni-webapp/raw/main/src/assets/LogoWeniAnimada.svg" height="100" />

[![codecov](https://codecov.io/github/weni-ai/intelligence-webapp/graph/badge.svg?token=CCIUMVG2HW)](https://codecov.io/github/weni-ai/intelligence-webapp) [![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

*This project is a module of [Weni](https://github.com/weni-ai) integrated inside [Weni WebApp (Connect)](https://github.com/weni-ai/weni-webapp)*

# :desktop_computer: Artificial Intelligence

This repository is responsible for all Weni - Artificial Intelligence-related projects. It hosts the documentation and other misc. resources for  Weni - Artificial Intelligence. Code for other projects, like the [Engine](https://github.com/bothub-it/bothub-engine), [NLP Worker](https://github.com/bothub-it/bothub-nlp), [NLP API](https://github.com/bothub-it/bothub-nlp-api) and [NLP On Demand](https://github.com/bothub-it/bothub-nlp-on-demand), are hosted in other repositories.

</div>

# About Artificial Intelligence

Weni - Artificial Intelligence is an open platform for predicting, training and sharing NLU (Natural Language Understanding) datasets in multiple languages in a cooperative way. with Weni - Artificial Intelligence, you can not only create NLP datasets, but you can also access, use and evolve datasets that were already built by other users in the community! These collaboration methods + integration options make it easier for the user to apply NLU concepts in different platforms and contexts.
> [Usability documentation](https://docs.weni.ai/l/pt/bothub)

![ia-platform-frontend-preview](https://raw.githubusercontent.com/Ilhasoft/ia-platform-frontend/main/.github/images/weni-ai.png)

# Main Technologies

- [Vue 3](https://vuejs.org/)
- [Sass](https://sass-lang.com/)
- [i18n](https://www.i18next.com/)
- [Axios](https://axios-http.com/ptbr/docs/intro)
- [Unnnic](https://github.com/weni-ai/unnnic) (Weni's design system)

# Requirements

Before running the application, make sure you have installed the following tools on your machine:

- [Node.js 18.x](https://nodejs.org/en)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (recommended)

# Set up

1. Open the terminal and clone the repository

```
  git clone https://github.com/weni-ai/intelligence-webapp.git
```

2. Enter the created directory

```
  cd intelligence-webapp
```

3. Install the dependencies:

```
  yarn
``` 

# How to develop

## Environment variables

1. Configure the config.js following the patterns below
 
| Variable | Type | Default | Description |
|--|--|--|--|
| API_BASE_URL | `string` | In development mode is `http://localhost:8000/api` | [bothub-engine](https://github.com/bothub-it/bothub-engine) HTTP service API URL
| BOTHUB_WEBAPP_BASE_URL | `string` | In development mode is `http://localhost:8080/` |[bothub-webapp](https://github.com/bothub-it/bothub-webapp)  Bothub Webapp service URL
| SUPPORTED_LANGUAGES | `string` | `en\|pt` | Check description and formatation in [Supported_Languages environment variable](https://github.com/bothub-it/bothub-engine#environment-variables)
| BOTHUB_WEBAPP_SENTRY | `string` | Empty | Sentry.io DNS*
| HOTJAR_ID | `string` | Empty | [Hotjar](https://www.hotjar.com/) ID*

# Development

Start the server with:

```
  yarn dev
```

After that, it will be available at http://localhost:5173.

# Development Workflow

| Command | Description |
|--|--|
| yarn | Install dependencies
| yarn dev | serve with hot reload at localhost:5173
| yarn build | Build for production with minification
| yarn build --report | Build for production and view the bundle analyzer report
| yarn lint | Show lint warnings and errors
| yarn test:unit | Run all tests
| yarn test:unit --watch | Run test in watch mode

# Open-Source Governance

The Weni Platform open source projects are governed by [@weni-ai](https://github.com/weni-ai/). Weni opens all its software parts under terms of an open-source license to reach potential users and partners mainly. Secondly, Weni wants to reach developers by building a community for some pieces that are more reusable in other businesses or software projects, such as NLP models or tools. Besides that, the openness of our software is also related to building trust by enabling our external stakeholders to audit the security of our software.

# Community

- Join our [community chat](https://community-chat.weni.ai) to discuss with our internal team
- Join [#dev](https://community-chat.weni.ai/channel/dev) for help from the community to development issues

# Contributing

**We are looking for collaboration from the Open Source community!** There's so much we want to do,
including but not limited to: enhancing existing applications with new features,
optimizing the NLP tasks and algorithms involved that boost accuracy, new communication channels and integrations.

* Please read our [contribution guidelines](https://github.com/ilhasoft/weni-platform/blob/main/.github/CONTRIBUTING.md) for details on what and how you can contribute.
* Report a bug by using [this guideline](https://github.com/ilhasoft/weni-platform/blob/main/.github/CONTRIBUTING.md#report-a-bug) for details on what and how you can contribute.
