import configuration from "@/app/configuration";
import modelSet from "@/app/modelSet";
import { Pages } from "@/app/Pages";
import { ConceptList } from "@/lib/components/ConceptList";
import { LabelTable } from "@/lib/components/LabelTable";
import { Layout } from "@/lib/components/Layout";
import { Section } from "@/lib/components/Section";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { MappingProperty } from "@/lib/models/MappingProperty";
import { semanticRelationProperties } from "@/lib/models/semanticRelationProperties";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";
import { defilenamify } from "@/lib/utilities/defilenamify";
import { filenamify } from "@/lib/utilities/filenamify";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { stringToIdentifier } from "@/lib/utilities/stringToIdentifier";
import { Metadata } from "next";
import { config } from "process";

interface ConceptPageParams {
  conceptIdentifier: string;
  languageTag: LanguageTag;
}

export default function ConceptPage({
  params: { conceptIdentifier, languageTag },
}: {
  params: ConceptPageParams;
}) {
  const concept = modelSet.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  return (
    <Layout
      languageTag={languageTag}
      title={`Concept: ${
        concept.prefLabel(languageTag)?.literalForm.value ??
        identifierToString(concept.identifier)
      }`}
    >
      <Section title="Labels">
        <LabelTable model={concept} />
      </Section>
      {semanticRelationProperties.map((semanticRelationProperty) => {
        let semanticRelations = concept.semanticRelations(
          semanticRelationProperty,
        );
        if (semanticRelations.length === 0) {
          return null;
        }
        if (
          semanticRelations.length > configuration.relatedConceptsPerSection
        ) {
          semanticRelations = semanticRelations.slice(
            0,
            configuration.relatedConceptsPerSection,
          );
        }
        return (
          <Section
            key={semanticRelationProperty.name}
            title={`${semanticRelationProperty.label} concepts`}
          >
            <ConceptList
              concepts={semanticRelations}
              languageTag={languageTag}
            />
          </Section>
        );
      })}
    </Layout>
  );
}

export function generateMetadata({
  params: { conceptIdentifier, languageTag },
}: {
  params: ConceptPageParams;
}): Metadata {
  const concept = modelSet.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  return Pages.concept({ concept, languageTag }).metadata;
}

export function generateStaticParams(): ConceptPageParams[] {
  const staticParams: ConceptPageParams[] = [];

  const conceptsCount = modelSet.conceptsCount;
  const limit = 100;
  let offset = 0;
  while (offset < conceptsCount) {
    for (const concept of modelSet.concepts({ limit, offset })) {
      for (const languageTag of modelSet.languageTags) {
        staticParams.push({
          conceptIdentifier: filenamify(identifierToString(concept.identifier)),
          languageTag,
        });
      }
      offset++;
    }
  }

  return staticParams;
}
