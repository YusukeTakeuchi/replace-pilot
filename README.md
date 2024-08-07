# Replace Pilot

**Replace Pilot** is an AI-powered extension for Visual Studio Code (VS Code) that transforms text based on user-defined customizable rules. This allows for seamless and intelligent text modifications directly within your editor.

## Features

- **Customizable Transformation Rules**: Transform text based on user-defined rules.
- **AI-Powered Transformation**: Use language models like GPT-4 for flexible text transformation.
- **Seamless VS Code Integration**: Easily accessible from the command palette.

## Installation

1. Open Visual Studio Code.
2. Click on the Extensions view icon on the Sidebar.
3. In the search box, type "Replace Pilot" and click the Install button.

## Usage

1. Select the text you want to transform in the editor.
2. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
3. Select the `Run Replace Pilot` command.
4. If multiple rules are defined, choose the appropriate rule.
5. The transformed text will be displayed in the editor.

## Configuration

`Replace Pilot` uses user-defined transformation rules specified in the VS Code settings.

### Adding and Editing Rules

1. Open the VS Code settings file (`settings.json`).
2. Add rules in the following format:

```json
"replace-pilot.rules": [
  {
    "id": "sample-uppercase",
    "title": "(Sample) Uppercase",
    "prompt": "Convert text to uppercase."
  },
  {
    "id": "custom-rule",
    "title": "Custom Rule",
    "prompt": "Your custom transformation prompt here."
  }
]
```

- **id**: (optional) A unique identifier for each rule. Can be specified by command args.
- **title**: The display name of the rule shown in the quick pick menu.
- **prompt**: The prompt used for transformation, serving as an instruction to the language model.

### Sample Configuration

Below is a sample rule that converts text to uppercase.

```json
"replace-pilot.rules": [
  {
    "id": "uppercase",
    "title": "Uppercase Conversion",
    "prompt": "Convert the text to uppercase."
  }
]
```

prompt can be an array of strings.

```json
"replace-pilot.rules": [
  {
    "title": "Uppercase Conversion except prepositions",
    "prompt": [
      "Convert the text to uppercase.",
      "but leave the prepositions as they are."
    ]
  }
]
```

### Key Mapping Configuration

You can set up a keyboard shortcut to instantly apply a specific transformation rule by specifying a `ruleId`. Here's an example of setting up key mappings in `keybindings.json`.

1. Open the command palette and select `Preferences: Open Keyboard Shortcuts (JSON)`.
2. Add the following configuration:

```json
[
  {
    "key": "ctrl+alt+r",
    "command": "replace-pilot.run",
    "args": { "ruleId": "uppercase" },
    "when": "editorTextFocus"
  }
]
```

- **key**: Specifies the keyboard shortcut, such as `Ctrl+Alt+R`.
- **command**: The command to be executed, here `replace-pilot.run`.
- **args**: Pass arguments to specify the `ruleId` for the transformation. In this case, the rule with the ID `"uppercase"` is applied.
- **when**: Context in which the shortcut is active; here, when the editor has focus.

## FAQ

### What to do if an error occurs while using the language model

- **User Consent**: Using the language model may require user consent.
- **Model Availability**: Ensure that the selected model is available.

## Development

This extension is developed using the VS Code Extension API. For more details, refer to the [VS Code API Reference](https://code.visualstudio.com/api).

## Release Notes

### 0.0.1

Initial release
