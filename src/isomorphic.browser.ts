/**
 * The `util.inspect()` functionality only applies to Node.js.
 * We return the constant `false` here so that the Node-specific code gets removed by tree-shaking.
 */
export const addInspectMethod = false;
