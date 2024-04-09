import { GlobalRef } from "@/lib/models/GlobalRef";
import { LunrSearchEngine } from "@/lib/search/LunrSearchEngine";
import modelSet from "./modelSet";
import fs from "node:fs/promises";
import path from "node:path";
import { createSearchEngineFromJson } from "@/lib/search/createSearchEngineFromJson";
import { SearchEngine } from "@/lib/search/SearchEngine";

const searchEngineGlobalRef = new GlobalRef("searchEngine");

export default async function searchEngine(): Promise<SearchEngine> {
  if (searchEngineGlobalRef.value) {
    return searchEngineGlobalRef.value as SearchEngine;
  }

  const jsonFilePath = path.resolve(
    process.cwd(),
    "data",
    "unesco-thesaurus",
    "unesco-thesaurus-index.json",
  );

  let jsonFileContents: Buffer | undefined;
  try {
    jsonFileContents = await fs.readFile(jsonFilePath);
  } catch {
    /* empty */
  }

  let searchEngine: SearchEngine;
  if (jsonFileContents) {
    console.info("recreating search engine from JSON at", jsonFilePath);
    searchEngine = createSearchEngineFromJson(
      JSON.parse(jsonFileContents.toString()),
    );
    console.info("recreated search engine from JSON at", jsonFilePath);
  } else {
    console.info("creating search engine");
    searchEngine = await LunrSearchEngine.create(modelSet);
    console.info("created search engine");
    console.info("writing search engine JSON to", jsonFilePath);
    await fs.writeFile(jsonFilePath, JSON.stringify(searchEngine.toJson()));
    console.info("wrote search engine JSON to", jsonFilePath);
  }

  searchEngineGlobalRef.value = searchEngine;
  return searchEngine;
}
