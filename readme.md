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

The components are styled motly with inline styles which colors being dynamically being determined using the `colors` object exported from `scripts/colors.ts`. There are also a few global styles written in [Sass](https://sass-lang.com/). Whenever the sass files are changed, they need to be compiled into their CSS. This can be done by running `npm run gen:styles`.

#### preload

Code that runs before loading the *renderer* this can be used to help expose *main* functionality to the *renderer*.

#### shared

A set of shared utility code used by all other segments.

### Inter-Process Communication (IPC)

Because the *main* and *renderer* process are completely separate they need to use Inter-Process Communication to share information at runtime. To do this in a type safe manner the app uses [electron-affinity](https://github.com/jtlapp/electron-affinity). Each process defines it's own API and calls a function to expose it to the other processes using IPC. The other processes can then import the type of that API and create a binding to access it.

### Patch Specs

The app uses a custom specification for defining data patches with dynamic content that can be applied to a ROM while reducing the risk of conflicts with patches to other portions of the ROM. These are defined using Yaml files with the following structure: 

- `description`: **String (optional)** - A human readable description of what the patch does.
- `extends`: **String (optional)** - A path to another Patch Spec that this spec extends. This spec recursively inherits all the properties of the extended spec. If the specs share a property with the same key, the value from this spec is used instead of the value from the extended spec. The path must be relative to the root of the Patch Spec directory.
- `includes`: **[String: String] (optional)** - A dictionary of paths to other Patch Specs that can be referenced in the Data Formats included in this spec. The paths must be relative to the root of the Patch Spec directory.
- `values`: **[String: [DataFormat](#DataFormat)] (optional)** - A dictionary of Data Formats that can be referenced by other Data Fromats in this spec.
- `changes`: **[[Change](#Change)] (optional)** - A list of changes to be applied to the ROM.
- `freeSpaces`: **[FreeSpace](#FreeSpace) (optional)** - A list of spaces in the ROM that can be marked as free for use by other patches.

#### DataFormat

This is a string made up of whitespace separated tokens that describe sequences of bytes that can be applied as a data patch. The following is a list of allowed tokens:

- **Byte**: A two character hexadecimal number describing a literal byte of data. ex: `C9`
- **Value Reference**: A chain of period separated reference path components that resolve to another value defined in the spec or one of its includes. For example, `#parent.#options.first.$data`. Each path component is a reference to a property belonging to the Patch Spec that is referenced by the reference path the precedes it (or the containing Patch Spec if it is the first component in the path). The following is the list of path components, each value reference must have exactly on `$value` or `index` component.
  - `$value`: Where `value` is the key of the value in its respective values dictionary. Must always be the last compontent in the reference.
  - `#include`: Where `include` is the key of an included patch spec (or array of included patch specs). If this is a reference to an array of patch specs, and is not followed by `first` or `last` path components, it will resolve the value reference for all the patch specs in the array and concatinate the results.
  - `first`: References the first spec in an array of includes. Must follow an include path component that references an array of includes.
  - `last`: References the last spec in an array of includes. Must follow an include path component that references an array of includes.
  - `index`: References the array index of the currently referenced patch spec. Must always be the last compontent in the reference.
  - `#parent`: References the patch spec that included the currently referenced patch spec.
- **Address Reference**: A Value Reference prefixed by `@`. Resolves to the two byte (little endian) ROM Bank address of the first appearance of the referenced value in the entire patch.
- **Sum**: A function that takes two arguments. The first argument is a Value Reference that must resolve to an array of single numerical values, these will be added together and encoded to little endian bytes. The second argument is a number of bytes to which to truncate the resulting value. ex: `sum(#options.$value, 2)`
- **Split**: A function that takes two arguments. The first argument is a Value Reference that must resolve to an array of values. The second argument is a data format that will be inserted between each resolved value of the array before concatinating everything. ex: `split(#options.$data, A1 B2 $someValue)`
- **Expression**: Describes an expression that resolves to a number that is then encoded to little endian bytes. The number is truncated to the set number of bytes indicated in the square brackets preceding the expression. Expressions follow basic math principles and can include binary (prefixed with `0b`), decimal and hexadecimal (prefixed with `0x`) values as well as Value References that will resolve to a single numerical value. ex: `[2]{(64 + 5 - 0x2F) * 0b00000010 / $value >> 1 << 1}`. Supported operations are as follows:
  - `+`: Add two numbers.
  - `-`: Subtract the right number from the left number.
  - `*`: Multiply two numbers.
  - `/`: Divide the left number by the right number.
  - `<<`: Bit shift the left number to the left by the right number.
  - `>>`: Bit shift the left number to the right by the right number.

Certain Patch Specs may need extra information that can only be provided by the generator at runtime. These can be in the form of extra includes (which can also include arrays of includes) or values. Data Formats may reference these includes/values even though they are not defined in their spec, but must be confident that the generator will provide them.

#### Change

- `description`: **String (optional)** - A human readable description of what the change does.
- `locations`: **[Location]** - A list of locations in the ROM where the change should be applied.
- `value`: **DataFormat** - The Data Format of the change to be applied to the ROM.

#### Location

- `bank`: **Number** - The numerical identifier of the ROM Bank where the change should be applied.
- `address`: **Number (optional)** - The starting address within the ROM Bank where the change should be applied. If the address is omitted, the generator will try to fit the change into a hunk of free space in the specified ROM Bank.
- `maxSize`: **Number (optional)** - The maximum size the resolved change can be if it were to be applied at the specified bank and address. If the size of the resolved change exceeds this value, the location of the changed will be moved to some other free space in the ROM and a farcall will be added that points to the new location. Any space within the space alloted by the starting location and the max size that is not used will be updated as free space that can be used by other patches. Ignored if `address` is not specified.
- `freeUnused`: **Boolean (optional)** - Tells the generator to mark as free any space in `bank` at `address` up to `maxSize` that does not get overwritten by the patch. Ignored if `maxSize` is not specified.

#### FreeSpace

- `bank`: **Number** - The numerical identifier of the ROM Bank where the start of the space is.
- `address`: **Number** - The starting address of the space within the ROM Bank.
- `size`: **Number** - The size the space to be marked as free.

### Nearley

[Nearley](https://nearley.js.org/) is used to parse the Data Formats included in the Patch Specs. The parsing rules are defined in `src/nearley/data.ne` this is then compiled to a CommonJS javascript module that is included in the application code using `npm run gen:grammars`.

### Tools

The tools folder contains utility scripts for things like generating info about game data. These scripts are not included in the compiled application. They require a `.tools.env` file with the following values to run:

- `pokecrystalPath`: The absolute path to pokemon crystal disassembly project.
- `outputPath`: The absolute path of where to write the output of these utility scripts.

### ESLint

[ESLint](https://eslint.org/) is used to maintain a consistent codes style in html, svelte, js, cjs, mjs, ts, and json files throughout the project and help prevent potential runtime issues. Run `npm run lint` to find any issues and automatically fix certain style violations. 

It is highly recommended to use an IDE like [Visual Studio Code](https://code.visualstudio.com/) that can automatically warn you about ESLint/TypeScript violations as you work. 

Recommended VS Code extensions:
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (Add `html` and `svelte` to the `eslint.validate` setting in the extension's settings.)
- [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

### Distribution

Running `npm run package` will create packages for most platform/architecture combinations and output them to the `out` directory. Zip archives for distribution will also be made available in the `out/make` directory.

**Important Note**: Packages for Windows systems can only be created on Windows systems or Unix systems with [Wine](https://www.winehq.org/).