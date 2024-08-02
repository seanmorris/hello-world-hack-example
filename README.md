# VS Code Extension Hack Example

This example extension shows how to tunnel out of the worker sandbox that VS Code for web extensions run in, and gain access to window APIs.

This is meant to be used with this distribution found at:

https://github.com/seanmorris/vscode-static-web

## How it works

[This patch](https://github.com/seanmorris/vscode-static-web/blob/master/patch/vscode.patch) and [this index page generator](https://github.com/seanmorris/vscode-static-web/blob/master/source/index-template.html.php) work together to allow commands to be implemented as JS callbacks that run in the top-level JS thread.

Since these commands don't implement the `label` property, they won't be user-accessible. The handler methods can accept and provide any JS value that can be serialized to JSON, and may be `async` if necessary.

### Hack Files

This is all provided in the `alert-hack.js` file. A "hack" file should contain a single callback that accepts a single argument and **should NOT end in a semicolon.** This callback will end up concatenated into JS that runs in the page.

```javascript
config => {
    config.commands.push(
        {
            id: "hello-world.internal.alert",
            handler: text => window.alert(text)
        },
        {
            id: "hello-world.internal.prompt",
            handler: text => window.prompt(text)
        },
    );
}
```

The hack file should be added to `package.json` in an array under the `hacks` key:

```json
{
    "hacks": [ "alert-hack.js" ],
}
```

### Extension Files

The method `vscode.commands.executeCommand` is called from within the actual extension to invoke the internal command defined in the hack file:

```javascript
// Register a command to proxy calls window.prompt()
vscode.commands.registerCommand('hello-world.prompt', async () => {
    // await user input
    const userInput = await vscode.commands.executeCommand('hello-world.internal.prompt', 'Type some text:');
    
    // Do something with userInput
    // ...
});
```

## How To Build It

Follow the install instructions in the repository above then...

Navigate to vscode-static-web/extra_extensions & clone this repository:

```
cd vscode-static-web/extra_extensions
git clone https://github.com/seanmorris/hello-world-hack-example.git
```

Enter the directory & compile the extension

```
cd hello-world-hack-example
npm run compile
```

Return to the project directory, rebuild the IDE and start the server:

```
cd ../..
make all serve
```

## License

Copyright 2024 Sean Morris

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
