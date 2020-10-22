import { BuildConfig } from "../builder/ProjectBuilder";
import * as fs from "fs";
import * as path from "path";
import { v1 } from "ask-smapi-model";
import { logger } from "../components/Logger";
import { INITIAL_ASK_RESOURCE, INITIAL_ASK_STATES, INITIAL_SKILL_MANIFEST } from "../util/util";
import fse from "fs-extra";

interface CjsMetadata {
  askStates: any;
  askResources: any;
  skillManifestEnvelope: v1.skill.Manifest.SkillManifestEnvelope;
}

const DEFAULT_CJS_METADATA: CjsMetadata = {
  askResources: INITIAL_ASK_RESOURCE,
  askStates: INITIAL_ASK_STATES,
  skillManifestEnvelope: INITIAL_SKILL_MANIFEST,
};

/**
 * Bootstrapper is a pre-build hook.
 * It runs everytime SkillBuilder is invoked.
 * It's job is to setup directories if not already present.
 */
export class ProjectInitializer {
  /**
   * Checks if project is initialized already.
   * @param buildConfig BuildConfig
   */
  isInitialized(buildConfig: BuildConfig): boolean {
    let outDir = buildConfig.outDir;
    let currDir = process.cwd();
    let targetLocation = path.join(currDir, outDir);

    logger.info(`Output directory already exists. Skipping the bootstrapping.`);
    return fs.existsSync(targetLocation);
  }

  /**
   * Initializes the project for the first time
   * @param buildConfig BuildConfig
   */
  initialize(buildConfig: BuildConfig): void {
    let outDir = buildConfig.outDir;
    let currDir = process.cwd();

    this.initializeOutDir(outDir, currDir);
  }

  /**
   * Creates an empty output directory if not already present.
   *
   * @param outDir Output directory
   * @param currDir Current directory
   */
  private initializeOutDir(outDir: string, currDir: string) {
    let targetLocation = path.join(currDir, outDir);

    fs.mkdirSync(targetLocation, { recursive: true });
    logger.info(`Created ${targetLocation}`);

    ["/skill-package", "/infrastructure/lambda-deployer", "/lambda", "/.ask"].forEach((val) => {
      let p = path.join(currDir, outDir, val);
      fse.ensureDirSync(p);
      logger.info(`Generated ${p}`);
    });
    this.initializeData(outDir, currDir);
  }

  /**
   * If CJS metadata is present, it reads from there, otherwise creates it.
   */
  private initializeData(outDir: string, currDir: string): CjsMetadata | void {
    // Save default ask-resources.json
    let askResourcesTargetLocation = path.join(currDir, outDir, "/ask-resources.json");
    logger.info(`Writing ${askResourcesTargetLocation}`);
    fs.writeFileSync(
      askResourcesTargetLocation,
      JSON.stringify(DEFAULT_CJS_METADATA.askResources, null, 2),
      "utf8"
    );

    // Save default ask-states.json
    let askStatesTargetLocation = path.join(currDir, outDir, "/.ask/ask-states.json");
    logger.info(`Writing ${askStatesTargetLocation}`);
    fs.writeFileSync(
      askStatesTargetLocation,
      JSON.stringify(DEFAULT_CJS_METADATA.askStates, null, 2),
      "utf8"
    );
  }
}
