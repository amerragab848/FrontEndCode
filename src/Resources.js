
import Config from './Services/Config.js';

let Resources = {};

Resources = Config.getResources();
export default {
    Resources: Resources
};
export { Resources }