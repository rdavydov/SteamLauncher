import {app, webContents} from 'electron';
import log from 'electron-log';
import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import type {Buffer} from 'node:buffer';
import {join} from 'node:path';
import {pathExists, writeJson, readJson, ensureDir, copy} from 'fs-extra';
import {paths} from '../config.js';
import storage from '../storage.js';

class SteamRetriever {
  private readonly steamWebApiKey: string = storage.get('account.steamWebApiKey');
  private readonly language: string = storage.get('account.language');
  private readonly event = webContents.getFocusedWebContents();
  private readonly appId: string;
  private readonly inputs: StoreGameDataType;
  private readonly dataPath: string;
  private readonly appsPath: string;
  private readonly appIdDataPath: string;
  private readonly appIdAchievementsInfoPath: string;
  private readonly appIdAchievementsPath: string;
  private readonly appIdStatsInfoPath: string;
  private readonly appIdItemsInfoPath: string;
  private readonly appIdDlcsInfoPath: string;
  private readonly steamRetrieverPath: string;
  private readonly steamRetrieverAppIdPath: string;
  private readonly steamRetrieverAppIdInfoPath: string;
  private readonly steamRetrieverBackgroundPath: string;
  private readonly steamRetrieverStatsPath: string;
  private readonly steamRetrieverItemsPath: string;
  private readonly steamRetrieverAchievementsImagesPath: string;
  private readonly steamRetrieverAchievementsInfoPath: string;
  private readonly steamRetrieverAchievementsInfoDefaultPath: string;

  public constructor(inputs: StoreGameDataType) {
    this.inputs = inputs;
    this.appId = inputs.appId;

    this.dataPath = join(app.getPath('userData'), 'data');

    this.appsPath = join(this.dataPath, 'apps');
    this.appIdDataPath = join(this.appsPath, this.appId);
    this.appIdAchievementsInfoPath = join(this.appIdDataPath, 'achievements.json');
    this.appIdAchievementsPath = join(this.appIdDataPath, 'achievements');
    this.appIdStatsInfoPath = join(this.appIdDataPath, 'stats.txt');
    this.appIdItemsInfoPath = join(this.appIdDataPath, 'items.json');
    this.appIdDlcsInfoPath = join(this.appIdDataPath, 'DLC.txt');

    this.steamRetrieverPath = join(this.dataPath, 'steam_retriever');
    this.steamRetrieverAppIdPath = join(this.steamRetrieverPath, this.appId);
    this.steamRetrieverAppIdInfoPath = join(this.steamRetrieverAppIdPath, this.appId + '.json');
    this.steamRetrieverBackgroundPath = join(this.steamRetrieverAppIdPath, 'background.jpg');
    this.steamRetrieverStatsPath = join(this.steamRetrieverAppIdPath, 'stats.json');
    this.steamRetrieverItemsPath = join(this.steamRetrieverAppIdPath, 'db_inventory.json');

    this.steamRetrieverAchievementsImagesPath = join(
      this.steamRetrieverAppIdPath,
      'achievements_images',
    );
    this.steamRetrieverAchievementsInfoPath = join(
      this.steamRetrieverAppIdPath,
      this.language + '.db_achievements.json',
    );
    this.steamRetrieverAchievementsInfoDefaultPath = join(
      this.steamRetrieverAppIdPath,
      'english.db_achievements.json',
    );
  }

  public console(content: string) {
    log.info(content);
    this.event.send('add-to-console', content);
  }

  public consoleHide(timeout = 0) {
    this.event.send('hide-console', timeout);
  }

  public async run() {
    this.event.send('show-console');

    this.console('Launch steamRetriever for ' + this.appId + '...');

    const steamRetrieverSpawn = this.spawn(
      this.appId,
      this.steamWebApiKey,
      true,
      this.steamRetrieverPath,
      this.language,
    );

    if (typeof steamRetrieverSpawn !== 'undefined') {
      const output = (chunk: Buffer) => {
        this.console(chunk.toString('utf8').trim());
      };

      steamRetrieverSpawn.stdout.on('data', output);
      steamRetrieverSpawn.stderr.on('data', output);

      steamRetrieverSpawn.on('close', async (code, signal) => {
        this.console(`steamRetriever exited with: [code ${code!}][signal ${signal!}]`);

        await ensureDir(this.appIdDataPath);

        const data: Record<string, unknown> = {};

        if (await pathExists(this.steamRetrieverAppIdInfoPath)) {
          const steamRetrieverAppIdInfoParse = (await readJson(
            this.steamRetrieverAppIdInfoPath,
          )) as Record<string, unknown>;
          data.name = steamRetrieverAppIdInfoParse.Name;
          data.header = this.steamRetrieverBackgroundPath;

          if (typeof data.Type !== 'undefined') {
            this.console(this.appId + " isn't a game!");
            this.consoleHide(5);
            return;
          }

          this.console(`${data.name as string} > name`);
          this.console(`${data.header as string} > header`);

          const outDlcs = [];
          let iii = 0;
          const dlcs = steamRetrieverAppIdInfoParse.Dlcs as Record<string, Record<string, string>>;
          if (Object.keys(dlcs).length > 0) {
            for (const dlcKey in dlcs) {
              if (Object.prototype.hasOwnProperty.call(dlcs, dlcKey)) {
                const dlc = dlcs[dlcKey];
                const dlcName = dlc.Name;

                outDlcs.push(dlcKey + '=' + dlcName);

                // eslint-disable-next-line max-depth
                if (Object.keys(dlcs).length - 1 === iii) {
                  writeFile(this.appIdDlcsInfoPath, outDlcs.join('\n'))
                    .then(() => {
                      this.console(this.appIdDlcsInfoPath + ' was written successfully!');
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

          await this.addGame(data);
        } else {
          this.console(`${this.steamRetrieverAppIdInfoPath} was not found!`);
        }
      });
    }
  }

  private async addGame(data: Record<string, unknown>) {
    const a: StoreGameDataType = Object.assign({}, this.inputs, data);

    storage.set('games.' + a.appId, a);
    this.console('Game created successfully!');
    this.consoleHide(5);
  }

  private async writeStats() {
    readJson(this.steamRetrieverStatsPath)
      .then(async (statsInfoParse: Record<string, Record<string, string>>) => {
        const out = [];
        for (const o in statsInfoParse) {
          if (Object.prototype.hasOwnProperty.call(statsInfoParse, o)) {
            const stat = statsInfoParse[o];
            const name = stat.name;
            const typeValue = 'int'; // NOTE: ..., float, avgrate but where can I find this data?
            const defaultValue = stat.defaultvalue;

            out.push(name + '=' + typeValue + '=' + defaultValue.toString());

            if ((Object.keys(statsInfoParse).length - 1).toString() === o) {
              writeFile(this.appIdStatsInfoPath, out.join('\n'))
                .then(() => {
                  this.console(this.appIdStatsInfoPath + ' was written successfully!');
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

  private async writeItems() {
    readJson(this.steamRetrieverItemsPath)
      .then(async (itemsInfoParse: Record<string, Record<string, string>>) => {
        const out: Record<string, unknown> = {};
        const outArray = [];
        for (const o in itemsInfoParse) {
          if (Object.prototype.hasOwnProperty.call(itemsInfoParse, o)) {
            const stat = itemsInfoParse[o];
            const appId = stat.appid;
            out[appId] = stat;

            outArray.push(out);

            if ((Object.keys(itemsInfoParse).length - 1).toString() === o) {
              writeJson(this.appIdItemsInfoPath, outArray, {spaces: 2})
                .then(() => {
                  this.console(this.appIdItemsInfoPath + ' was written successfully!');
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

  private async writeAchievements() {
    let achievementsInfoPath = '';

    if (await pathExists(this.steamRetrieverAchievementsInfoPath)) {
      achievementsInfoPath = this.steamRetrieverAchievementsInfoPath;
    } else {
      this.console(`${this.steamRetrieverAchievementsInfoPath} was not found!`);

      if (await pathExists(this.steamRetrieverAchievementsInfoPath)) {
        achievementsInfoPath = this.steamRetrieverAchievementsInfoPath;
      } else {
        this.console(`${this.steamRetrieverAchievementsInfoPath} was not found!`);
      }
    }

    if (achievementsInfoPath.length > 0) {
      readJson(achievementsInfoPath)
        .then(async (achievementsInfoParse: Record<string, Record<string, string>>) => {
          await ensureDir(this.appIdAchievementsPath);

          for (const o in achievementsInfoParse) {
            if (Object.prototype.hasOwnProperty.call(achievementsInfoParse, o)) {
              const achievement = achievementsInfoParse[o];
              achievement.icon = 'achievements/' + achievement.name + '.jpg';
              achievement.icongray = 'achievements/' + achievement.name + '_gray.jpg';

              achievementsInfoParse[o] = achievement;

              if ((Object.keys(achievementsInfoParse).length - 1).toString() === o) {
                writeJson(this.appIdAchievementsInfoPath, achievementsInfoParse, {spaces: 2})
                  .then(() => {
                    this.console(this.appIdAchievementsInfoPath + ' was written successfully!');
                  })
                  .catch((error) => {
                    this.console(error.message);
                  });
                copy(this.steamRetrieverAchievementsImagesPath, this.appIdAchievementsPath)
                  .then(() => {
                    this.console(
                      'The achievement images have been successfully moved to ' +
                        this.appIdAchievementsPath,
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

  // eslint-disable-next-line max-params
  private spawn(
    appId: string,
    steamWebKey: string,
    downloadImages: boolean,
    outputPath: string,
    language: string,
    force = false,
  ) {
    const filePath = paths.steamRetriever;
    const args = ['-k', steamWebKey, '-o', outputPath, '-l', language];

    if (downloadImages) {
      args.push('-i');
    }

    if (force) {
      args.push('-f');
    }

    args.push(appId);

    try {
      return spawn(filePath, args);
    } catch (error: unknown) {
      this.console(error as string);
    }
  }
}

export default SteamRetriever;
