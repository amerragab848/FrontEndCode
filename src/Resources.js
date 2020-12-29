
import Config from './Services/Config.js';

import ResourcesPool from './resources.json';
let Resources = {};

let useBackResources = Config.getPublicConfiguartion().useBackResources;
if (useBackResources === false) {
    Resources = ResourcesPool;
} else {

    Resources = Config.getResources();
}
export default {
    Resources: Resources
};
export { Resources }