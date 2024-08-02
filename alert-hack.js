config => {
    // These commands won't be users accessible
    // since they don't implement the `label` property.
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