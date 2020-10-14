import { SkillInfoBlockBuilder } from "../../../src/blocks/builders/SkillInfoBlockBuilder";
import * as _ from "lodash";
import { expect } from "chai";
import "mocha";
import { AlexaBuilderContext, AlexaDialogContext, AlexaEvent, Locale } from "../../../src/models";
import { resource_utils, paths } from "../../../src/util/ResourceUtil";
import { context_util } from "../../../src/util/ContextUtil";

describe("SkillInfoBlockBuilder", () => {
    describe("InvocationName", () => {
        it("should do nothing if name or invocation name are not set", async () => {
            let builderContext: AlexaBuilderContext = JSON.parse("{}");
            let dialogContext: AlexaDialogContext = JSON.parse("{}");
            let event: AlexaEvent = JSON.parse("{}");

            let sib = new SkillInfoBlockBuilder();
            let b = sib.build();
            b.execute(dialogContext, event);
            b.build(builderContext);

            expect(JSON.stringify(dialogContext)).equals("{}");
            expect(JSON.stringify(builderContext)).equals("{}");
            expect(JSON.stringify(event)).equals("{}");
        });

        it("should set invocation name when passed and both locales and im are not in context", async () => {
            let builderContext: AlexaBuilderContext = {
                currentLocales: [],
                resources: { resourceMap: {} },
            };
            let invocationName = "foo";
            let sib = new SkillInfoBlockBuilder();
            let b = sib.invocationName(invocationName).build();

            b.build(builderContext);

            expect(builderContext).to.not.be.undefined;
            expect(context_util.getIMString(builderContext, Locale.en_US)).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_US).interactionModel).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_US).interactionModel?.languageModel).to.not.be
                .undefined;
            expect(
                context_util.getIM(builderContext, Locale.en_US).interactionModel?.languageModel?.invocationName
            ).equals(invocationName);
            // exactly one resource is generated i.e. IM in en_US
            expect(Object.keys(builderContext.resources.resourceMap).length).equals(1);
        });

        it("should set invocation name when passed and locales present in context, im is not", async () => {
            let builderContext: AlexaBuilderContext = {
                currentLocales: [Locale.en_US, Locale.en_CA],
                resources: { resourceMap: {} },
            };
            let invocationName = "foo";
            let sib = new SkillInfoBlockBuilder();
            let b = sib.invocationName(invocationName).build();

            b.build(builderContext);

            expect(builderContext).to.not.be.undefined;
            expect(context_util.getIMString(builderContext, Locale.en_US)).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_US).interactionModel).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_US).interactionModel?.languageModel).to.not.be
                .undefined;
            expect(
                context_util.getIM(builderContext, Locale.en_US).interactionModel?.languageModel?.invocationName
            ).equals(invocationName);

            expect(context_util.getIMString(builderContext, Locale.en_CA)).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_CA).interactionModel).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_CA).interactionModel?.languageModel).to.not.be
                .undefined;
            expect(
                context_util.getIM(builderContext, Locale.en_CA).interactionModel?.languageModel?.invocationName
            ).equals(invocationName);
        });

        it("should set invocation name when passed and locales present in context and im is also present", async () => {
            let builderContext: AlexaBuilderContext = {
                currentLocales: [Locale.en_US, Locale.en_CA],
                resources: {
                    resourceMap: {
                        [paths.getInteractionModelPath(Locale.en_US)]: JSON.stringify(
                            resource_utils.getDefaultInteractionModel()
                        ),
                    },
                },
            };
            let invocationName = "foo";
            let sib = new SkillInfoBlockBuilder();
            let b = sib.invocationName(invocationName).build();

            b.build(builderContext);

            expect(builderContext).to.not.be.undefined;
            expect(context_util.getIMString(builderContext, Locale.en_US)).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_US).interactionModel).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_US).interactionModel?.languageModel).to.not.be
                .undefined;
            expect(
                context_util.getIM(builderContext, Locale.en_US).interactionModel?.languageModel?.invocationName
            ).equals(invocationName);

            expect(context_util.getIMString(builderContext, Locale.en_CA)).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_CA).interactionModel).to.not.be.undefined;
            expect(context_util.getIM(builderContext, Locale.en_CA).interactionModel?.languageModel).to.not.be
                .undefined;
            expect(
                context_util.getIM(builderContext, Locale.en_CA).interactionModel?.languageModel?.invocationName
            ).equals(invocationName);
        });
    });

    describe("Skill Name", () => {
        it("should set skill name when passed and both locales and manifest are not in the builder context", async () => {
            let builderContext: AlexaBuilderContext = {
                currentLocales: [],
                resources: { resourceMap: {} },
            };
            let name = "foo";
            let sib = new SkillInfoBlockBuilder();
            let b = sib.name(name).build();

            b.build(builderContext);

            expect(builderContext).to.not.be.undefined;
            expect(context_util.getSkillManifestString(builderContext)).to.not.be.undefined;
            expect(context_util.getSkillManifest(builderContext).manifest).to.not.be.undefined;
            expect(context_util.getSkillManifest(builderContext).manifest?.publishingInformation).to.not.be.undefined;
            let publishInfoLocales = context_util.getSkillManifest(builderContext).manifest?.publishingInformation
                ?.locales;
            expect(publishInfoLocales).to.not.be.undefined;

            if (publishInfoLocales) {
                expect(publishInfoLocales[Locale.en_US]).to.not.be.undefined;
                expect(publishInfoLocales[Locale.en_US].name).equals(name);

                // exactly one locale is present in the skill manifest i.e. en_US
                expect(Object.keys(publishInfoLocales).length).equals(1);
            }
        });

        it("should set skill name when passed and locales present in context, manifest is not", async () => {
            let builderContext: AlexaBuilderContext = {
                currentLocales: [Locale.en_US, Locale.en_CA],
                resources: { resourceMap: {} },
            };
            let name = "foo";
            let sib = new SkillInfoBlockBuilder();
            let b = sib.name(name).build();

            b.build(builderContext);

            expect(builderContext).to.not.be.undefined;
            expect(context_util.getSkillManifestString(builderContext)).to.not.be.undefined;
            expect(context_util.getSkillManifest(builderContext).manifest).to.not.be.undefined;
            expect(context_util.getSkillManifest(builderContext).manifest?.publishingInformation).to.not.be.undefined;
            let publishInfoLocales = context_util.getSkillManifest(builderContext).manifest?.publishingInformation
                ?.locales;
            expect(publishInfoLocales).to.not.be.undefined;

            if (publishInfoLocales) {
                expect(publishInfoLocales[Locale.en_US]).to.not.be.undefined;
                expect(publishInfoLocales[Locale.en_US].name).equals(name);
                expect(publishInfoLocales[Locale.en_CA]).to.not.be.undefined;
                expect(publishInfoLocales[Locale.en_CA].name).equals(name);
            }
        });

        it("should set skill name when passed and locales present in context, manifest is present", async () => {
            let builderContext: AlexaBuilderContext = {
                currentLocales: [Locale.en_US, Locale.en_CA],
                resources: {
                    resourceMap: {
                        [paths.getSkillManifestPath()]: JSON.stringify(resource_utils.getDefaultSkillManifest()),
                    },
                },
            };
            let name = "foo";
            let sib = new SkillInfoBlockBuilder();
            let b = sib.name(name).build();

            b.build(builderContext);

            expect(builderContext).to.not.be.undefined;
            expect(context_util.getSkillManifestString(builderContext)).to.not.be.undefined;
            expect(context_util.getSkillManifest(builderContext).manifest).to.not.be.undefined;
            expect(context_util.getSkillManifest(builderContext).manifest?.publishingInformation).to.not.be.undefined;
            let publishInfoLocales = context_util.getSkillManifest(builderContext).manifest?.publishingInformation
                ?.locales;
            expect(publishInfoLocales).to.not.be.undefined;

            if (publishInfoLocales) {
                expect(publishInfoLocales[Locale.en_US]).to.not.be.undefined;
                expect(publishInfoLocales[Locale.en_US].name).equals(name);
                expect(publishInfoLocales[Locale.en_CA]).to.not.be.undefined;
                expect(publishInfoLocales[Locale.en_CA].name).equals(name);
            }
        });
    });
});
