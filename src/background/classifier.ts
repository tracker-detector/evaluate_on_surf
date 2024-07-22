import * as tf from "@tensorflow/tfjs";
import { inject, injectable } from "inversify";
export interface IClassifier {
    predict(features: number[]): number;
}
export const ClassifierType = Symbol("IClassifier");

@injectable()
export class Classifier implements IClassifier {
    private model: tf.LayersModel;
    constructor(@inject("model") model: tf.LayersModel) {
        this.model = model;
    }
    predict(features: number[]): number {
        const input = tf.tidy(() => tf.tensor(features, [203, 1]));
        const prediction = this.model.predict(input) as tf.Tensor;
        const value = prediction.dataSync()[0];
        input.dispose();
        prediction.dispose();
        return value;
    }
}