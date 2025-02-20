import type {
  Buffer,
} from 'node:buffer';
import {
  spawn,
} from 'node:child_process';
import {
  writeFile,
  unlink,
} from 'node:fs/promises';
import {
  join,
  parse,
} from 'node:path';
import {
  webContents,
} from 'electron';
import log from 'electron-log';
import fg from 'fast-glob';
import {
  pathExists,
  writeJson,
  readJson,
  ensureDir,
  copy,
} from 'fs-extra';
import signVerify from '../bin/signtool';
import steamApiInterfaces from '../bin/steam-api-interfaces';
import {
  paths,
} from '../config';
import generateAppIdPaths from '../functions/generate-appid-paths';
import storage from '../storage';

const environments = import.meta.env;

const globSteamApis = (runPath: string) => {
  return fg.sync([
    '**/steam_api.dll',
    '**/steam_api64.dll',
  ], {
    absolute: true,
    cwd: runPath,
    onlyFiles: true,
  });
};

class SteamRetriever {
  private readonly steamWebApiKey: string = storage.get('account.steamWebApiKey');

  private readonly language: string = storage.get('account.language');

  private readonly event = webContents.getFocusedWebContents();

  private readonly appId: string;

  private readonly paths: Record<string, string>;

  private readonly inputs: StoreGameDataType;

  public constructor (inputs: StoreGameDataType) {
    this.inputs = inputs;
    this.appId = inputs.appId;
    this.paths = generateAppIdPaths(inputs.appId, this.language);
  }

  public console (content: string) {
    log.info(content);
    this.event.send('add-to-console', content);
  }

  public consoleHide () {
    this.event.send('hide-console');
  }

  public consoleShow () {
    this.event.send('show-console');
  }

  public async run () {
    this.consoleShow();
    this.console('Launch steamRetriever for ' + this.appId + '...');

    const findSteamApis = globSteamApis(this.inputs.runPath);
    if (findSteamApis.length > 0) {
      let index = 1;
      for (const oo of findSteamApis) {
        const signed = signVerify(oo);

        if (!signed) {
          this.console(oo + ' isn\'t signed! Please use original steam_api(64).dll only!');
          return;
        }

        if (index === findSteamApis.length) {
          const steamRetrieverSpawn = this.spawn();

          if (typeof steamRetrieverSpawn !== 'undefined') {
            const output = (chunk: Buffer) => {
              this.console(chunk.toString('utf8').trim());
            };

            steamRetrieverSpawn.stdout.on('data', output);
            steamRetrieverSpawn.stderr.on('data', output);

            steamRetrieverSpawn.on('close', async (code, signal) => {
              this.console(`steamRetriever exited with: [code ${code}][signal ${signal}]`);

              await ensureDir(this.paths.appIdDataPath);

              const data: Record<string, string> = {};

              if (await pathExists(this.paths.steamRetrieverAppIdInfoPath)) {
                const steamRetrieverAppIdInfoParse = (await readJson(
                  this.paths.steamRetrieverAppIdInfoPath,
                )) as SteamRetrieverAppId;
                data.name = steamRetrieverAppIdInfoParse.Name;
                data.header = this.paths.steamRetrieverBackgroundPath;

                if (typeof steamRetrieverAppIdInfoParse.Type !== 'undefined') {
                  this.console(data.name + ' isn\'t a game!');
                  this.consoleHide();
                  return;
                }

                this.console(`${data.name} > name`);
                this.console(`${data.header} > header`);

                const outDlcs = [];
                let iii = 0;
                const dlcs = steamRetrieverAppIdInfoParse.Dlcs;
                if (Object.keys(dlcs).length > 0) {
                  for (const dlcKey in dlcs) {
                    if (Object.prototype.hasOwnProperty.call(dlcs, dlcKey)) {
                      const dlc = dlcs[dlcKey];
                      const dlcName = dlc.Name;

                      outDlcs.push(dlcKey + '=' + dlcName);

                      if (Object.keys(dlcs).length - 1 === iii) {
                        writeFile(this.paths.appIdDlcsInfoPath, outDlcs.join('\n'))
                          .then(() => {
                            this.console(
                              this.paths.appIdDlcsInfoPath + ' was written successfully!',
                            );
                          })
                          .catch((error) => {
                            this.console(error.message);
                          });
                      }

                      iii++;
                    }
                  }
                } else {
                  this.console('The game has no dlcs!');
                }

                if (this.steamWebApiKey.length > 0) {
                  await this.writeAchievements();
                  await this.writeStats();
                  await this.writeItems();
                }

                await this.writeSteamApiInterfaces(oo);
                await this.addGame(data);
              } else {
                this.console(`${this.paths.steamRetrieverAppIdInfoPath} was not found!`);
              }
            });
          }
        }

        index++;
      }
    } else {
      this.console(
        'The game does not contain any steam_api(64).dll! Please select the correct run path!',
      );
    }
  }

  private async addGame (data: Record<string, string>) {
    const inputs: StoreGameDataType = {
      ...this.inputs,
      ...data,
    };
    storage.set('games.' + inputs.appId, inputs);
    this.consoleHide();
  }

  private async writeSteamApiInterfaces (dll: string) {
    if (await pathExists(this.paths.appIdSteamInterfacesPath)) {
      this.console('Skip, steam_interfaces.txt already exists!');
      return;
    }

    const steamApiDll = join(paths.steamApiInterfacesPath, parse(dll).base);
    const steamInterfacesTxt = join(paths.steamApiInterfacesPath, 'steam_interfaces.txt');
    copy(dll, steamApiDll)
      .then(() => {
        this.console('The steam_api(64).dll have been successfully moved to ' + steamApiDll);
        const generateSteamApiInterfaces = steamApiInterfaces(dll);
        if (generateSteamApiInterfaces) {
          copy(steamInterfacesTxt, this.paths.appIdSteamInterfacesPath)
            .then(async () => {
              this.console(
                'The steam_interfaces have been successfully moved to ' +
                  this.paths.appIdSteamInterfacesPath,
              );
              await unlink(steamApiDll);
              await unlink(steamInterfacesTxt);
            })
            .catch((error) => {
              this.console(error.message);
            });
        } else {
          this.console('Unknown error with generating the steam_api(64).dll interfaces!');
        }
      })
      .catch((error) => {
        this.console(error.message);
      });
  }

  private async writeStats () {
    readJson(this.paths.steamRetrieverStatsPath)
      .then(async (statsInfoParse: SteamRetrieverStats) => {
        const out = [];
        for (const oo in statsInfoParse) {
          if (Object.prototype.hasOwnProperty.call(statsInfoParse, oo)) {
            const stat = statsInfoParse[oo];
            const {
              name,
            } = stat;
            // NOTE: ..., float, avgrate but where can I find this data?
            const typeValue = 'int';
            const defaultValue = stat.defaultvalue;

            out.push(name + '=' + typeValue + '=' + defaultValue.toString());

            if ((Object.keys(statsInfoParse).length - 1).toString() === oo) {
              writeFile(this.paths.appIdStatsInfoPath, out.join('\n'))
                .then(() => {
                  this.console(this.paths.appIdStatsInfoPath + ' was written successfully!');
                })
                .catch((error) => {
                  this.console(error.message);
                });
            }
          }
        }
      })
      .catch((error) => {
        this.console(error.message);
      });
  }

  private async writeItems () {
    readJson(this.paths.steamRetrieverItemsPath)
      .then(async (itemsInfoParse: SteamRetrieverItems) => {
        const out: SteamRetrieverItems = {};
        const outArray = [];
        for (const oo in itemsInfoParse) {
          if (Object.prototype.hasOwnProperty.call(itemsInfoParse, oo)) {
            const stat = itemsInfoParse[oo];
            const appId = stat.appid;
            out[appId] = stat;

            outArray.push(out);

            if ((Object.keys(itemsInfoParse).length - 1).toString() === oo) {
              writeJson(this.paths.appIdItemsInfoPath, outArray, {
                spaces: 2,
              })
                .then(() => {
                  this.console(this.paths.appIdItemsInfoPath + ' was written successfully!');
                })
                .catch((error) => {
                  this.console(error.message);
                });
            }
          }
        }
      })
      .catch((error) => {
        this.console(error.message);
      });
  }

  private async writeAchievements () {
    let achievementsInfoPath = '';

    if (await pathExists(this.paths.steamRetrieverAchievementsInfoPath)) {
      achievementsInfoPath = this.paths.steamRetrieverAchievementsInfoPath;
    } else {
      this.console(`${this.paths.steamRetrieverAchievementsInfoPath} was not found!`);

      if (await pathExists(this.paths.steamRetrieverAchievementsInfoDefaultPath)) {
        achievementsInfoPath = this.paths.steamRetrieverAchievementsInfoDefaultPath;
      } else {
        this.console(`${this.paths.steamRetrieverAchievementsInfoDefaultPath} was not found!`);
      }
    }

    if (achievementsInfoPath.length > 0) {
      readJson(achievementsInfoPath)
        .then(async (achievementsInfoParse: SteamRetrieverAchievements) => {
          await ensureDir(this.paths.appIdAchievementsPath);

          for (const oo in achievementsInfoParse) {
            if (Object.prototype.hasOwnProperty.call(achievementsInfoParse, oo)) {
              const achievement = achievementsInfoParse[oo];
              achievement.icon = 'achievements/' + achievement.name + '.jpg';
              achievement.icongray = 'achievements/' + achievement.name + '_gray.jpg';

              achievementsInfoParse[oo] = achievement;

              if ((Object.keys(achievementsInfoParse).length - 1).toString() === oo) {
                writeJson(this.paths.appIdAchievementsInfoPath, achievementsInfoParse, {
                  spaces: 2,
                })
                  .then(() => {
                    this.console(
                      this.paths.appIdAchievementsInfoPath + ' was written successfully!',
                    );
                  })
                  .catch((error) => {
                    this.console(error.message);
                  });
                copy(
                  this.paths.steamRetrieverAchievementsImagesPath,
                  this.paths.appIdAchievementsPath,
                )
                  .then(() => {
                    this.console(
                      'The achievement images have been successfully moved to ' +
                        this.paths.appIdAchievementsPath,
                    );
                  })
                  .catch((error) => {
                    this.console(error.message);
                  });
              }
            }
          }
        })
        .catch((error) => {
          this.console(error.message);
        });
    }
  }

  private spawn () {
    const filePath = paths.steamRetrieverBin;
    const args = [
      // SteamApi web key
      '-k',
      this.steamWebApiKey,
      // OutputPath
      '-o',
      this.paths.steamRetrieverPath,
      // Language
      '-l',
      this.language,
      // Download images
      '-i',
    ];

    // Force only in production mode
    if (environments.PROD) {
      args.push('-f');
    }

    args.push(this.appId);

    try {
      return spawn(filePath, args);
    } catch (error: unknown) {
      this.console(error as string);
    }

    return false;
  }
}

export default SteamRetriever;
