# Pokémon Crystal Randomizer

Pokémon Crystal Randomizer is a tool for modifying the "vanilla" Pokémon Crystal Version 1.1. ROM.

## Installation

Download the latest release for your system from [here](https://github.com/dbagwell/pokemon-crystal-randomizer/releases/latest) and extract all the files.

## Usage

1. Launch the Pokémon Crystal Randomizer Application.
2. Click "GENERATE ROM".
3. Provide a base "vanilla" ROM of Pokémon Crystal Version 1.1.
4. Select a location to save the generated ROM.

## Development

Pokémon Crystal Randomizer is an [Electron](https://www.electronjs.org/) app built using [Electron Forge](https://www.electronforge.io/) and [Vite](https://vitejs.dev/). The source code is written in [TypeScript](https://www.typescriptlang.org/) and the front end uses [Svelte](https://svelte.dev/).

### Setting Up

1. Install nodejs and npm. They can be downloaded from [here](https://nodejs.org/en/download/current).
2. Install the project dependencies by running `npm i` within the project directory.
3. Build and launch the app in development mode by running `npm run dev`.

### Project Structure

The code is split into 4 main segments:

#### main

The back end portion and the main entry point of the app. Responsible for creating the windows used by the *renderer* and interacting with the lower level functions of the OS.

#### renderer

The user interface. Behaves like a web page. It runs on a completely separate process from *main* and does not have access to the lower level functions of the OS.

`mainWindow.html` acts as the root for all the UI of the main application window and loads all the necessary resources for displaying the UI. The UI is created using Svelte components and attached to the window using the `mainWindow.ts` script.

The Project uses base components from [Svelte Material UI](https://sveltematerialui.com/). These are styled with themes using [Sass](https://sass-lang.com/). The app's custom styles are also written in Sass. Whenever these change (such as when a new SMUI component type is installed), they need to be compiled into their CSS. This can be done by running `npm run gen:styles`.

#### preload

Code that runs before loading the *renderer* this can be used to help expose *main* functionality to the *renderer*.

#### shared

A set of shared utility code used by all other segments.

### Inter-Process Communication (IPC)

Because the *main* and *renderer* process are completely separate they need to use Inter-Process Communication to share information at runtime. To do this in a type safe manor the app uses [electron-affinity](https://github.com/jtlapp/electron-affinity). Each process defines it's own API and calls a function to expose it to the other processes using IPC. The other processes can then import the type of that API and create a binding to access it.

### ESLint

[ESLint](https://eslint.org/) is used to maintain a consistent codes style in html, svelte, js, cjs, mjs, ts, and json files throughout the project and help prevent potential runtime issues. Run `npm run lint` to find any issues and automatically fix certain style violations. 

It is highly recommended to use an IDE like [Visual Studio Code](https://code.visualstudio.com/) that can automatically warn you about ESLint/TypeScript violations as you work. 

Recommended VS Code extensions:
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (Add `html` and `svelte` to the `eslint.validate` setting in the extension's settings.)
- [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

### Distribution

Running `npm run package` will create packages for most platform/architecture combinations and output them to the `out` directory. Zip archives for distribution will also be made available in the `out/make` directory.

**Important Note**: Packages for Windows systems can only be created on Windows systems or Unix systems with [Wine](https://www.winehq.org/).