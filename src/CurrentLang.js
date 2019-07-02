let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

currentLanguage === "ar" ? require('./ArStyles') : require('./EnStyles');

// export const layout = currentLanguage == "en" ? "./Styles/scss/en-us/layout.css" : "./Styles/scss/ar-eg/layout-ar.css";
// export const reactCss = currentLanguage == "en" ? "./Styles/scss/en-us/reactCss.css" : "./Styles/scss/ar-eg/reactCss-ar.css";

export default {};
 
