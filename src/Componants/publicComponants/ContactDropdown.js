let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let publicFonts = currentLanguage === "ar" ? 'cairo-sb' : 'Muli, sans-serif'

const ContactDropdown = {
    control: (styles, { isFocused }) => ({
        ...styles,
        backgroundColor: '#e9ecf0',
        width: '271px',
        height: '48px',
        borderRadius: '4px',
        borderTopLeftRadius: currentLanguage === "ar" ? '3px' : '0',
        borderBottomLeftRadius: currentLanguage === "ar" ? '3px' : '0',
        borderTopRightRadius: currentLanguage === "ar" ? '0' : '3px',
        borderBottomRightRadius: currentLanguage === "ar" ? '0' : '3px',
        border: isFocused ? "solid 2px #83B4FC" : '2px solid #E9ECF0',
        boxShadow: 'none',
        transition: ' all 0.4s ease-in-out',
        cursor: 'pointer'
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled
                ? '#f2f6fa'
                : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
            opacity: isDisabled
                ? '0.5'
                : isSelected ? '1' : isFocused ? '1' : "1",
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            fontFamily: publicFonts,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            zIndex: '155'
        };
    },
    input: styles => ({ ...styles, maxWidth: '100%', marginLeft: currentLanguage === "ar" ? '0' : '22px', marginRight: currentLanguage === "ar" ? '22px' : '0' }),
    placeholder: styles => ({ ...styles, color: '#252833', fontSize: '13px', width: '100%', fontFamily: publicFonts, left: currentLanguage === "ar" ? 'auto' : '27px', right: currentLanguage === "ar" ? '27px' : 'auto' }),
    singleValue: styles => ({ ...styles, color: '#252833', fontSize: '14px', width: '100%', fontFamily: publicFonts, left: currentLanguage === "ar" ? 'auto' : '27px', right: currentLanguage === "ar" ? '27px' : 'auto' }),
    indicatorSeparator: styles => ({ ...styles, display: 'none' }),
    menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' }),
}


export default ContactDropdown