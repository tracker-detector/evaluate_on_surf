import "reflect-metadata";
import { AppType, IApp } from "./app";
import { createContainer } from "./container";

Promise.all([createContainer()]).then(([container]) => {
    console.info("Resource Initialized");
    console.info("Starting Event Listener");
    container.get<IApp>(AppType).start();
});