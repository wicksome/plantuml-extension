#  PlantUML Extension

> This is a Google Chrome extension that replace PlantUML code blocks into preview images.

[link-cws]: https://chrome.google.com/webstore/detail/plantuml-extension/jbdmdkcjhnceacdkahhpfpijcohplgaj "Version published on Chrome Web Store"

[<img valign="middle" src="https://img.shields.io/chrome-web-store/d/jbdmdkcjhnceacdkahhpfpijcohplgaj.svg?label=users">][link-cws]

## Install

- [**Chrome** extension][link-cws] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/jbdmdkcjhnceacdkahhpfpijcohplgaj.svg?label=%20">][link-cws]

The chrome version also works in Opera (using [this](https://addons.opera.com/en/extensions/details/download-chrome-extension-9/)) and Edge.

## Features

- Preview
  - [x] GitHub Issues
  - [x] ZenHub Issues
- [x] [Support for GitHub Enterprise](#support-for-github-enterprise)
- [x] Support environment setting for each domain.
- [ ] Support `!include` directive
- [ ] Support rendering of `.pu`/`.puml`/`.plantuml` file

## Sample contents

### Sequence diagram with lang `uml`

```uml
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml
```

### State diagram with lang `puml`

```puml
@startuml
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]
@enduml
```

### Other code blocks

These cannot preview.

#### Code block without lang `uml`

```
@startuml
hide empty description
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]
@enduml
```

#### `uml` code block does not starts with `@start`

```uml
foo
bar
baz
```
## Support for GitHub Enterprise

If you're a GitHub Enterprise user, visit your Enterprise site, right-click on _the extension’s icon in the toolbar_ and select [**Enable PlantUML Extension on this domain.**](https://raw.githubusercontent.com/wicksome/plantuml-extension/master/images/enable-github-enterprise.png)

## Using another options(PlantUML server) by domain 

<img src="images/options-page.png" align="right" width="500">

By default, this extension uses [PlantUML server](https://github.com/plantuml/plantuml-server)
deployed to `https://www.plantuml.com/plantuml`.

However, if your UML is confidential and you cannot send it to an external server, you can also use any PlantUML server.
Configuring "Base URL" on the setting page, delegates image generation to this server.

Examples.

* `https://www.plantuml.com/plantuml/img/` (default)
* `https://www.plantuml.com/plantuml/svg/`
* `https://any-plantuml-server.example.com:8080/img/`

Also you can run PlantUML server in localhost using Docker as following command:

```
$ docker run -d -p 8080:8080 plantuml/plantuml-server
```

And you can specify `http://localhost:8080/img/` as *Base URL*.

Note: To avoid mixed-content, if the *Base URL* is not HTTPS scheme,
generated image is converted to [DATA URI](https://tools.ietf.org/html/rfc2397).

## Contribution

1. Fork (wkcksome/plantuml-extension/fork)
2. Create a feature branch named like `feature/something_awesome_feature` from `develop` branch
3. Commit your changes
4. Rebase your local changes against the `develop` branch
5. Create new Pull Request

## Author

[Yeongjun Kim](https://github.com/wicksome)


## See Also

- [PlantUML Guide](http://plantuml.com/ko/guide)
- [REAL WORLD PlantUML](https://real-world-plantuml.com/): Source code of [real-world-plantuml.com](https://real-world-plantuml.com/)
- https://github.com/rabelenda/gilbarbara-plantuml-sprites
- https://github.com/Roemer/plantuml-office
- https://github.com/kkeisuke/plantuml-editor
