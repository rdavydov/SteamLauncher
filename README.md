# SteamLauncher (ALPHA)

**_SteamLauncher_** optimizes the setup process of each game in a simple and automatic way.

[forum cs.rin.ru support](https://cs.rin.ru/forum/viewtopic.php?f=20&t=116801)

#### Screenshots

<img src="https://raw.githubusercontent.com/Sak32009/SteamLauncher/main/screenshots/screenshot_main.png" alt="screenshot-main" width="400">

## Donate

> **Protect development and free things -- because their survival is in our hands.**
>
> **You can donate by clicking on [paypal.me](https://www.paypal.me/sak32009a).**

## Introduction

**_SteamLauncher_** is a windows application that optimizes the setup process of each game in a simple and automatic way.

Instead of manually configuring each game, **_SteamLauncher_** automatically performs all operations for **Mr. Goldberg's Steam Emulator**.

For more information on the emulator: [gitlab](https://gitlab.com/Mr_Goldberg/goldberg_emulator) [cs.rin.ru](https://cs.rin.ru/forum/viewtopic.php?f=29&t=91627)

## Installation

**_SteamLauncher_** comes in two variants:

- Portable _(to carry in your pocket)_
- Installable _(recommended for extra features that portable doesn't offer)_

Download the latest version of the _SteamLauncher_ from the [GitHub Releases](https://github.com/Sak32009/SteamLauncher/releases).

To update **_SteamLauncher_**, simply download the new version from the GitHub releases page and run the installer or wait for the update notification directly from the app.

For the portable version, replace manually files.

## Small description of usage

When the application starts, you will be asked to create the account. Once done, download the latest version of the Mr. GoldBerg emulator, extract the zip and go to the settings in the application and select the "experimental_steamclient" folder.

To add a game, simply drag the game executable to the main page of the application in the appropriate section, fill in the data and right-click on the game card to open the context menu and click "Launch".

## Supported Mr. GoldBerg Steam Emulator features

- Set items
- Set stats
- Set achievements and images
- Set enable/disable overlay
- Set online/offline mode
- Set language
- Set listen port
- DLCs

## Unsupported Mr. GoldBerg Steam Emulator features

- All those not listed.

**To solve this problem just go to the folder "%APPDATA%/SteamLauncher/data/apps/_APPID_" and enter the missing data.**

**Attention! This data is always overwritten:**

- folder achievements
- achievements.json
- stats.txt
- items.json
- DLC.txt
- steam_interfaces.txt
- force_account_name.txt
- force_language.txt
- force_listen_port.txt
- force_steamid.txt

## TODO

The first item in the list has priority.

- ~~**The SteamLauncher code is sadly worse than a child's drawing of a tree.**~~
- Integrate https://github.com/Sak32009/GetDLCInfoFromSteamDB into the launcher.

## FAQ

## Troubleshoots

## License

> _SteamLauncher_ is released under the following license: [MIT](https://github.com/Sak32009/SteamLauncher/blob/main/LICENSE)
