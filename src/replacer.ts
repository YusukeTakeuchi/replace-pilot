import * as vscode from "vscode";
import { LanguageModelChatMessage } from "vscode";

type Rule = {
  id?: string;
  title: string;
  prompt: string;
};

type CommandArgs = {
  ruleId?: string;
};

export async function runReplacer(args: CommandArgs = {}) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("No editor is active");
    return;
  }

  const rules: Rule[] = vscode.workspace.getConfiguration().get("replace-pilot.rules") || [];
  if (rules.length === 0) {
    vscode.window.showInformationMessage("No transformation rules found");
    return;
  }

  let selectedRule;

  if (args.ruleId === undefined) {
    selectedRule = await chooseRule(rules);
  } else {
    selectedRule = findRuleById(rules, args.ruleId);
    if (!selectedRule) {
      vscode.window.showInformationMessage(`Replace pilot: Rule with id ${args.ruleId} not found`);
    }
  }

  if (!selectedRule) {
    return;
  }

  const selection = editor.selection;
  const text = editor.document.getText(selection);

  let transformedText: string;
  try {
    transformedText = await transformTextWithLm(text, selectedRule);
  } catch (err) {
    vscode.window.showErrorMessage(`Failed to transform the text: ${err}`);
    return;
  }

  editor.edit(editBuilder => {
    editBuilder.replace(selection, transformedText);
  });
}

function findRuleById(rules: Rule[], id: string): Rule | undefined {
  return rules.find(rule => rule.id === id);
}

async function chooseRule(rules: Rule[]): Promise<Rule | undefined> {
  const options = rules.map(rule => ({
    label: rule.title,
    description: rule.prompt,
    rule: rule,
  }));

  const selectedOption = await vscode.window.showQuickPick(
    options,
    { placeHolder: "Select a transformation rule" }
  );

  if (!selectedOption) {
    return undefined;
  }

  return selectedOption.rule;
}

async function transformTextWithLm(text: string, rule: Rule): Promise<string> {
  const prompt = createPrompt(text, rule);

  try {
    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
    const response = await model.sendRequest(prompt, {}, new vscode.CancellationTokenSource().token);

    let result = '';
    for await (const fragment of response.text) {
      result += fragment;
    }

    return result;
  } catch (err) {
    // Making the chat request might fail because
    // - model does not exist
    // - user consent not given
    // - quota limits were exceeded
    if (err instanceof vscode.LanguageModelError) {
      console.error(err.message, err.code, err.cause);
    } else {
      console.error(err);
    }
    throw err;
  }
}

function createPrompt(text: string, rule: Rule): LanguageModelChatMessage[] {
  return [
    LanguageModelChatMessage.User("Transform the text with the rule below:\n-------------------\n"),
    LanguageModelChatMessage.User(`rule: ${rule.prompt}\n-------------------\n`),
    LanguageModelChatMessage.User(`${text}`),
  ];
}