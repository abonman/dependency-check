export interface Repository {
  lookupVersion(dependencyName: string): Promise<any>;
}
