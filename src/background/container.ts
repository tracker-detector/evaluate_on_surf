import "reflect-metadata";
import { Container } from "inversify";
import { Classifier, ClassifierType, IClassifier } from "./classifier";
import { Extractor, ExtractorType, IExtractor } from "./extractor";
import * as tf from "@tensorflow/tfjs";
import { App, AppType, IApp } from "./app";
import { IStore, Store, StoreType } from "./store";

export async function createContainer() : Promise<Container> {
  const container = new Container();
  const model = await tf.loadLayersModel("model/model.json");
  container.bind<tf.LayersModel>("model").toConstantValue(model);

  container.bind<IClassifier>(ClassifierType).to(Classifier).inSingletonScope();
  container.bind<IExtractor>(ExtractorType).to(Extractor).inSingletonScope();
  container.bind<IStore>(StoreType).to(Store).inSingletonScope();
  container.bind<IApp>(AppType).to(App).inSingletonScope();
  return container;
}