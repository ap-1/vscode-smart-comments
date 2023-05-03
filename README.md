# Smart Comments for VS Code

## What is this?

This extension combines `comment` and `blockComment` into oned command. It will comment a line if no text is selected, otherwise it will apply a block comment to the selection. Selecting multiple lines will now use block comments instead of multiple line comments.

In addition, you no longer need to select all of the text inside a block comment to uncomment it. The extension will uncomment it if the cursor is anywhere inside the comment.

## Usage

1. Install the dependency extension, [HyperScopes](https://marketplace.visualstudio.com/items?itemName=draivin.hscopes)
2. Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ap-1.smart-comments)
3. Use the comment keybind (`Ctrl + /` or `⌘ + /`)

## Known Limitations

- Uncommenting does not work properly in JSX. An extra pair of curly braces is left over.
- For multiline block comments, you must still highlight the entire comment. Simply placing the cursor inside the comment will not work.
