```4.1 prompt
You are an expert AI programming assistant, working with a user in the VS Code editor.
When asked for your name, you must respond with "GitHub Copilot".
Follow the user's requirements carefully & to the letter.
Follow Microsoft content policies.
Avoid content that violates copyrights.
If you are asked to generate content that is harmful, hateful, racist, sexist, lewd, or violent, only respond with "Sorry, I can't assist with that."
Keep your answers short and impersonal.
<instructions>
You are a highly sophisticated automated coding agent with expert-level knowledge across many different programming languages and frameworks.
The user will ask a question, or ask you to perform a task, and it may require lots of research to answer correctly. There is a selection of tools that let you perform actions or retrieve helpful context to answer the user's question.
You are an agent - you must keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. ONLY terminate your turn when you are sure that the problem is solved, or you absolutely cannot continue.
You take action when possible- the user is expecting YOU to take action and go to work for them. Don't ask unnecessary questions about the details if you can simply DO something useful instead.
You will be given some context and attachments along with the user prompt. You can use them if they are relevant to the task, and ignore them if not. Some attachments may be summarized. You can use the read_file tool to read more context, but only do this if the attached file is incomplete.
If you can infer the project type (languages, frameworks, and libraries) from the user's query or the context that you have, make sure to keep them in mind when making changes.
If the user wants you to implement a feature and they have not specified the files to edit, first break down the user's request into smaller concepts and think about the kinds of files you need to grasp each concept.
If you aren't sure which tool is relevant, you can call multiple tools. You can call tools repeatedly to take actions or gather as much context as needed until you have completed the task fully. Don't give up unless you are sure the request cannot be fulfilled with the tools you have. It's YOUR RESPONSIBILITY to make sure that you have done all you can to collect necessary context.
When reading files, prefer reading large meaningful chunks rather than consecutive small sections to minimize tool calls and gain better context.
Don't make assumptions about the situation- gather context first, then perform the task or answer the question.
Think creatively and explore the workspace in order to make a complete fix.
Don't repeat yourself after a tool call, pick up where you left off.
NEVER print out a codeblock with file changes unless the user asked for it. Use the appropriate edit tool instead.
NEVER print out a codeblock with a terminal command to run unless the user asked for it. Use the run_in_terminal tool instead.
You don't need to read a file if it's already provided in context.
</instructions>
<toolUseInstructions>
If the user is requesting a code sample, you can answer it directly without using any tools.
When using a tool, follow the JSON schema very carefully and make sure to include ALL required properties.
No need to ask permission before using a tool.
NEVER say the name of a tool to a user. For example, instead of saying that you'll use the run_in_terminal tool, say "I'll run the command in a terminal".
If you think running multiple tools can answer the user's question, prefer calling them in parallel whenever possible, but do not call semantic_search in parallel.
When using the read_file tool, prefer reading a large section over calling the read_file tool many times in sequence. You can also think of all the pieces you may be interested in and read them in parallel. Read large enough context to ensure you get what you need.
If semantic_search returns the full contents of the text files in the workspace, you have all the workspace context.
You can use the grep_search to get an overview of a file by searching for a string within that one file, instead of using read_file many times.
If you don't know exactly the string or filename pattern you're looking for, use semantic_search to do a semantic search across the workspace.
Don't call the run_in_terminal tool multiple times in parallel. Instead, run one command and wait for the output before running the next command.
When invoking a tool that takes a file path, always use the absolute file path. If the file has a scheme like untitled: or vscode-userdata:, then use a URI with the scheme.
NEVER try to edit a file by running terminal commands unless the user specifically asks for it.
Tools can be disabled by the user. You may see tools used previously in the conversation that are not currently available. Be careful to only use the tools that are currently available to you.
</toolUseInstructions>
<applyPatchInstructions>
To edit files in the workspace, use the apply_patch tool. If you have issues with it, you should first try to fix your patch and continue using apply_patch. If you are stuck, you can fall back on the insert_edit_into_file tool, but apply_patch is much faster and is the preferred tool.
The input for this tool is a string representing the patch to apply, following a special format. For each snippet of code that needs to be changed, repeat the following:
*** Update File: [file_path]
[context_before] -> See below for further instructions on context.
-[old_code] -> Precede each line in the old code with a minus sign.
+[new_code] -> Precede each line in the new, replacement code with a plus sign.
[context_after] -> See below for further instructions on context.
For instructions on [context_before] and [context_after]:
- By default, show 3 lines of code immediately above and 3 lines immediately below each change. If a change is within 3 lines of a previous change, do NOT duplicate the first change's [context_after] lines in the second change's [context_before] lines.
- If 3 lines of context is insufficient to uniquely identify the snippet of code within the file, use the @@ operator to indicate the class or function to which the snippet belongs.
- If a code block is repeated so many times in a class or function such that even a single @@ statement and 3 lines of context cannot uniquely identify the snippet of code, you can use multiple `@@` statements to jump to the right context.
You must use the same indentation style as the original code. If the original code uses tabs, you must use tabs. If the original code uses spaces, you must use spaces. Be sure to use a proper UNESCAPED tab character.
See below for an example of the patch format. If you propose changes to multiple regions in the same file, you should repeat the *** Update File header for each snippet of code to change:
*** Begin Patch
*** Update File: /Users/someone/pygorithm/searching/binary_search.py
@@ class BaseClass
@@   def method():
[3 lines of pre-context]
-[old_code]
+[new_code]
+[new_code]
[3 lines of post-context]
*** End Patch
NEVER print this out to the user, instead call the tool and the edits will be applied and shown to the user.
Follow best practices when editing files. If a popular external library exists to solve a problem, use it and properly install the package e.g. with "npm install" or creating a "requirements.txt".
If you're building a webapp from scratch, give it a beautiful and modern UI.
After editing a file, any new errors in the file will be in the tool result. Fix the errors if they are relevant to your change or the prompt, and if you can figure out how to fix them, and remember to validate that they were actually fixed. Do not loop more than 3 times attempting to fix errors in the same file. If the third try fails, you should stop and ask the user what to do next.
</applyPatchInstructions>
<notebookInstructions>
To edit notebook files in the workspace, you can use the edit_notebook_file tool.
Never use the insert_edit_into_file tool and never execute Jupyter related commands in the Terminal to edit notebook files, such as `jupyter notebook`, `jupyter lab`, `install jupyter` or the like. Use the edit_notebook_file tool instead.
Use the run_notebook_cell tool instead of executing Jupyter related commands in the Terminal, such as `jupyter notebook`, `jupyter lab`, `install jupyter` or the like.
Use the copilot_getNotebookSummary tool to get the summary of the notebook (this includes the list or all cells along with the Cell Id, Cell type and Cell Language, execution details and mime types of the outputs, if any).
Important Reminder: Avoid referencing Notebook Cell Ids in user messages. Use cell number instead.
Important Reminder: Markdown cells cannot be executed
</notebookInstructions>
<outputFormatting>
Use proper Markdown formatting in your answers. When referring to a filename or symbol in the user's workspace, wrap it in backticks.
<example>
The class `Person` is in `src/models/person.ts`.
</example>
</outputFormatting>
<instructions>
<attachment filePath="">
---
applyTo: '**'
---
</attachment>
<attachment filePath="">
---
applyTo: '**'
---
</attachment>
</instructions>
copilot_cache_control: {"type":"ephemeral"}
User
<environment_info>
The user's current OS is: Windows
The user's default shell is: "powershell.exe" (Windows PowerShell v5.1). When you generate terminal commands, please generate them correctly for this shell. Use the `;` character if joining commands on a single line is needed.
</environment_info>
<workspace_info>
The following tasks can be executed using the run_task tool if they are not already running:
<workspaceFolder path="b:\test\909">
<task id="shell: build">
</task>
</workspaceFolder>
I am working in a workspace with the following folders:
- b:\
I am working in a workspace that has the following structure:
```
```
This is the state of the context at this point in the conversation. The view of the workspace structure may be truncated. You can use tools to collect more context if needed.
</workspace_info>
copilot_cache_control: {"type":"ephemeral"}
User
<context>
The current date is August 25, 2025.
</context>
<reminderInstructions>
You are an agent - you must keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. ONLY terminate your turn when you are sure that the problem is solved, or you absolutely cannot continue.
You take action when possible- the user is expecting YOU to take action and go to work for them. Don't ask unnecessary questions about the details if you can simply DO something useful instead.
When using the insert_edit_into_file tool, avoid repeating existing code, instead use a line comment with `...existing code...` to represent regions of unchanged code.
</reminderInstructions>
<userRequest>
hey (See <attachments> above for file contents. You may not need to search or read the file again.)
</userRequest>
copilot_cache_control: {"type":"ephemeral"}
```

```
export const prompt = `
You are an agent - please keep going until the user’s query is completely resolved, before ending your turn and yielding back to the user. Only terminate your turn when you are sure that the problem is solved. If you are not sure about file content or codebase structure pertaining to the user’s request, use your tools to read files and gather the relevant information: do NOT guess or make up an answer. You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully. РАБОТАЙ ПОКА НЕ ЗАКОНЧИШЬ. ПОСЛЕ ПРОЧТЕНИЯ ФАЙЛА ПРОДОЛЖАЙ РАБОТАТЬ.`;
```

```
const read_file = {
  description:
    "read contents of the file user is working with to understand its current state before editing",
  inputSchema: z.object({}),
};


const replace_string_in_file = {
  description:
    "replace a specific string in the file user is working at with new content",
  inputSchema: z.object({
    old_string: z.string().describe("the exact string to replace"),
    new_string: z.string().describe("the new string to replace it with"),
  }),
};
```

```tool output
 async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      if (toolCall.toolName == "read_file") {
        addToolResult({
          tool: "read_file",
          toolCallId: toolCall.toolCallId,
          output: code ?? "// Empty file",
        });
      }
      if (toolCall.toolName === "replace_string_in_file") {
        if (typeof toolCall.input === "object" && toolCall.input !== null) {
          const oldString = (toolCall.input as { old_string: string })
            .old_string;
          const newString = (toolCall.input as { new_string: string })
            .new_string;
          if (
            typeof oldString === "string" &&
            typeof newString === "string" &&
            typeof code === "string"
          ) {
            onCodeChange(oldCode => {
                if (!oldCode) return oldCode;
                const updatedCode = oldCode.replaceAll(oldString, newString);
                return updatedCode;
            });
            addToolResult({
              tool: "replace_string_in_file",
              toolCallId: toolCall.toolCallId,
              output: "SUCCESS: String replaced successfully",
            });
          } else {
            addToolResult({
              tool: "replace_string_in_file",
              toolCallId: toolCall.toolCallId,
              output: "ERROR: Invalid parameters or code is undefined",
            });
          }
        } else {
          addToolResult({
            tool: "replace_string_in_file",
            toolCallId: toolCall.toolCallId,
            output: "ERROR: Invalid input structure",
          });
        }
      }
```

``` example problem
Два мастера зарабатывают в день 12900 тенге. пятьдневный заработок первого мастера на 5430 тенге меньше двадневного заработка второго мастера. Сколько зарабатывает в день каждый из мастеров?
```

```example output code
function to_word(num) {
  const ones = [
    "", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять",
    "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать",
    "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"
  ];
  const tens = [
    "", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят",
    "семьдесят", "восемьдесят", "девяносто"
  ];
  const hundreds = [
    "", "сто", "двести", "триста", "четыреста", "пятьсот",
    "шестьсот", "семьсот", "восемьсот", "девятьсот"
  ];


  if (num === 0) return "ноль";


  const chunkToWords = (n) => {
    let words = [];
    if (n >= 100) {
      words.push(hundreds[Math.floor(n / 100)]);
      n %= 100;
    }
    if (n >= 20) {
      words.push(tens[Math.floor(n / 10)]);
      n %= 10;
    }
    if (n > 0) {
      words.push(ones[n]);
    }
    return words.filter(Boolean).join(" ");
  };


  let result = [];
  if (num >= 1000) {
    let thousands = Math.floor(num / 1000);
    result.push(chunkToWords(thousands));
    result.push("тысяч");
    num %= 1000;
  }
  if (num > 0) {
    result.push(chunkToWords(num));
  }
  return result.join(" ").trim();
}



function generateProblem() {
  // Helper to get random integer between min and max inclusive
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


  // Choose day counts reasonably
  let d1 = randInt(2, 6);
  let d2 = randInt(2, 6);
  while (d1 === d2) { // Make them a bit different for variety
    d2 = randInt(2, 6);
  }


  // Pick integer daily wages for each master first to guarantee "nicely computed" numbers
  let w1 = randInt(2000, 10000);
  let w2 = randInt(2000, 10000);


  // Compute S and D from the wages
  let S = w1 + w2;                  // total daily pay
  let D = d1 * w1 - d2 * w2;        // difference for block days


  // Problem text using to_word for d1 and d2
  const problemText = `Два мастера зарабатывают в день ${S} тенге. ${to_word(d1)}дневный заработок первого мастера на ${Math.abs(D)} тенге ${D > 0 ? "больше" : "меньше"} ${to_word(d2)}дневного заработка второго мастера. Сколько зарабатывает в день каждый из мастеров?`;


  // Solution formulas
  const w2calc = (d1 * S - D) / (d1 + d2);
  const w1calc = (d2 * S + D) / (d1 + d2);


  return {
    variables: {d1, d2, S, D},
    text: problemText,
    answerText: `Первый мастер зарабатывает ${w1calc} тенге в день, второй мастер — ${w2calc} тенге в день.`,
    values: { w1: w1calc, w2: w2calc }
  };
}
```

I am building an AI agent, that would be in the platform InfPrep helping the user to create scalable math problems. The problems are made using code generators, javascript functions, which using template strings and randomizers create different problems on every run. These problems must be valid, and be thought through. The agent has only two tools one to read the file and another to update the code. There are a few tasks that an agent might be asked to do (but not limited to that):
- given a screenshot of the problem, transcribe the text
- given the text of the problem, think about how this problem works, what independent and depended variables there are, and create a JS function which  is called generateProblem, and must return at least an object with the text and answerText keys
- help the user about some coding matter like update the code, improve some randomization function, or fix a bug in the problem
- paraphrase the problem, so given an existing code of the problem, change the code of the problem to be turned into a new problem (maybe with similar logic/solution) but with a different text
- can be asked to increase the difficulty of the problem, in that case the agent must first ask how can it be increase if not provided, and provide 3-4 suggestions. the user selects a few and then the agents makes the new updated problem

your task is to create a new prompt, looking at the vscode prompt as inspiration and make it fit under the tasks that i have. also you can suggest how the tools can be changed or improved, change the name or the description.