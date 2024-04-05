import { skos } from "@/lib/vocabularies";
import { PropertyEnum } from "./PropertyEnum";

export class MappingProperty extends PropertyEnum {
  static readonly BROAD_MATCH = new MappingProperty(
    skos.broadMatch,
    "Broad match",
  );

  static readonly CLOSE_MATCH = new MappingProperty(
    skos.closeMatch,
    "Close match",
  );

  static readonly EXACT_MATCH = new MappingProperty(
    skos.exactMatch,
    "Exact match",
  );

  static readonly NARROW_MATCH = new MappingProperty(
    skos.narrowMatch,
    "Narrow match",
  );

  static readonly RELATED_MATCH = new MappingProperty(
    skos.relatedMatch,
    "Related match",
  );

  static byName(name: string): MappingProperty | null {
    for (const mappingProperty of MappingProperty.values) {
      if (mappingProperty.name === name) {
        return mappingProperty;
      }
    }
    return null;
  }

  static readonly values: readonly MappingProperty[] = [
    MappingProperty.BROAD_MATCH,
    MappingProperty.CLOSE_MATCH,
    MappingProperty.EXACT_MATCH,
    MappingProperty.NARROW_MATCH,
    MappingProperty.RELATED_MATCH,
  ];
}
