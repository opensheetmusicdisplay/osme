export interface OSMPlugin {
    getPluginName(): string;
    getPluginType(): OSMPluginType;
}

export enum OSMPluginType {
    SOURCE_GENERATOR,
    DISPLAY_OUTPUT
}
