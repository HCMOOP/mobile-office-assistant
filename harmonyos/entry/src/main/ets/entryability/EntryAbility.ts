import { AbilityStage } from '@ohos.abilityKit';
import UIAbility from '@ohos.abilityKit.UIAbility';
import window from '@ohos.window';

export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
    console.info('EntryAbility onCreate');
  }

  onDestroy() {
    console.info('EntryAbility onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    console.info('EntryAbility onWindowStageCreate');
    windowStage.loadContent('pages/index/index');
  }

  onWindowStageDestroy() {
    console.info('EntryAbility onWindowStageDestroy');
  }

  onForeground() {
    console.info('EntryAbility onForeground');
  }

  onBackground() {
    console.info('EntryAbility onBackground');
  }
}