# Auto Palette

[![NPM Version](https://img.shields.io/npm/v/auto-palette)](https://www.npmjs.com/package/auto-palette)
[![License](https://img.shields.io/npm/l/auto-palette)](https://github.com/t28hub/auto-palette-ts/blob/main/LICENSE)
[![GitHub Actions](https://github.com/t28hub/auto-palette-ts/actions/workflows/build.yml/badge.svg)](https://github.com/t28hub/auto-palette-ts/actions/workflows/build.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f133835017b04752aa3758dc62a8602e)](https://app.codacy.com/gh/t28hub/auto-palette-ts/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![codecov](https://codecov.io/gh/t28hub/auto-palette-ts/graph/badge.svg?token=F5obdWWvEt)](https://codecov.io/gh/t28hub/auto-palette-ts)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette-ts.svg?type=shield&issueType=license)](https://app.fossa.com/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette-ts?ref=badge_shield&issueType=license)

## Features

- 🎨Palette extraction
- 📦Zero-dependencies

## 📦Installation

```sh
# Install via npm
$ npm install auto-palette

# Install via pnpm
$ pnpm add auto-palette

# Install via yarn
$ yarn add auto-palette
```

## 👨‍💻Usage

```typescript
import { AutoPalette } from 'auto-palette';

const autoPalette = AutoPalette.create(options);
autoPalette
  .extract(image)
  .then((result) => {
    const dominantSwatch = result.getDominantSwatch();
    console.info(`Dominant swatch: ${dominantSwatch}`);
  })
  .catch((reason) => {
    console.warn(`Failed to build a palette: ${reason}`);
  });
```

## 📜License

This library is distributed under the MIT License.See the [LICENSE](https://github.com/t28hub/auto-palette-ts/blob/main/LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette-ts.svg?type=large&issueType=license)](https://app.fossa.com/projects/custom%2B14538%2Fgithub.com%2Ft28hub%2Fauto-palette-ts?ref=badge_large&issueType=license)
