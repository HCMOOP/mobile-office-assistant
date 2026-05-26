import { HvigorPlugin, HvigorNode, HvigorContext, DefaultTasks } from '@ohos/hvigor-ohos-plugin';

export default async function buildProfile(ctx: HvigorContext): Promise<void> {
  const app = await ctx.registerNode({
    name: 'app',
    type: 'ohos-app',
    plugin: HvigorPlugin.OHOS_APP_PLUGIN,
    buildScript: './build-profile.json5',
    tasks: [DefaultTasks.ASSEMBLE_HAP]
  });

  const entry = await ctx.registerNode({
    name: 'entry',
    type: 'ohos-hap',
    plugin: HvigorPlugin.OHOS_HAP_PLUGIN,
    buildScript: './entry/build-profile.json5',
    tasks: [DefaultTasks.ASSEMBLE_HAP]
  });

  app.dependsOn(entry);
}