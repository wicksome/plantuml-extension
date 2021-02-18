# Contributing Intructions

TODO

1. Fork (wkcksome/plantuml-extension/fork)
2. Create a feature branch named like `feature/something_awesome_feature` from `develop` branch
3. Commit your changes
4. Rebase your local changes against the `develop` branch
5. Create new Pull Request


## Installation

1. Clone the repository `git clone https://github.com/wicksome/plantuml-extension.git`
2. Run `npm install`
3. Run `npm run build`

### Load the extension in Chrome & Opera

1. Open Chrome/Opera browser and navigate to chrome://extensions
2. Select "Developer Mode" and then click "Load unpacked extension..."
3. From the file browser, choose to `extension-boilerplate/build/chrome` or (`extension-boilerplate/build/opera`)

### Load the extension in Firefox

1. Open Firefox browser and navigate to about:debugging
2. Click "Load Temporary Add-on" and from the file browser, choose `extension-boilerplate/build/firefox`

## Developing

The following tasks can be used when you want to start developing the extension and want to enable live reload - 

- `npm run watch`

## Packaging

Run `yarn dist` to create a zipped, production-ready extension for each browser. You can then upload that to the appstore.
