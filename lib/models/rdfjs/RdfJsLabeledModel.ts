import { NamedNode } from "@rdfjs/types";
import { Label } from "@/lib/models/Label";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { RdfJsResource } from "@/lib/models/rdfjs/RdfJsResource";
import { RdfJsLabel } from "@/lib/models/rdfjs/RdfJsLabel";
import { skos, skosxl } from "@/lib/vocabularies";

export abstract class RdfJsLabeledModel
  extends RdfJsResource
  implements LabeledModel
{
  *altLabels(): Iterable<Label> {
    yield* this.labels(skos.altLabel, skosxl.altLabel);
  }

  *hiddenLabels(): Iterable<Label> {
    yield* this.labels(skos.hiddenLabel, skosxl.hiddenLabel);
  }

  private *labels(
    skosPredicate: NamedNode,
    skosXlPredicate: NamedNode,
  ): Iterable<Label> {
    yield* this.filterAndMapObjects(skosPredicate, (term) =>
      term.termType === "Literal"
        ? ({
            literalForm: term,
          } satisfies Label)
        : null,
    );

    // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
    yield* this.filterAndMapObjects(skosXlPredicate, (term) => {
      switch (term.termType) {
        case "BlankNode":
        case "NamedNode":
          break;
        default:
          return null;
      }

      for (const literalFormQuad of this.dataset.match(
        term,
        skosxl.literalForm,
        null,
        null,
      )) {
        if (literalFormQuad.object.termType === "Literal") {
          return new RdfJsLabel({
            dataset: this.dataset,
            identifier: term,
            literalForm: literalFormQuad.object,
          });
        }
      }

      return null;
    });
  }

  *prefLabels(): Iterable<Label> {
    yield* this.labels(skos.prefLabel, skosxl.prefLabel);
  }
}
