
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let publicFonts = currentLanguage === "ar" ? 'cairo-sb' : 'Muli, sans-serif'

const CompanyDropdown = {
    control: (styles, { isFocused }) => ({
        ...styles,
        backgroundColor: '#fff',
        borderColor: '#fff',
        height: '48px',
        borderRadius: '4px',
        borderTopLeftRadius: currentLanguage === "ar" ? '0' : '3px',
        borderBottomLeftRadius: currentLanguage === "ar" ? '0' : '3px',
        borderTopRightRadius: currentLanguage === "ar" ? '3px' : '0',
        borderBottomRightRadius: currentLanguage === "ar" ? '3px' : '0',
        width: '271px',
        border: isFocused ? "solid 2px #83B4FC" : '2px solid #E9ECF0',
        boxShadow: 'none',
        transition: ' all 0.4s ease-in-out',
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled ? '#fff' : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'capitalize',
            fontFamily: publicFonts,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: '155'
        };
    },
    input: styles => ({ ...styles, maxWidth: '100%', marginLeft: currentLanguage === "ar" ? '0' : '22px', marginRight: currentLanguage === "ar" ? '22px' : '0'  }),
    placeholder: styles => ({ ...styles, color: '#A8B0BF', fontSize: '13px', width: '100%', fontFamily: publicFonts, left: currentLanguage === "ar" ? 'auto' : '27px', right: currentLanguage === "ar" ? '27px' : 'auto' }),
    singleValue: styles => ({ ...styles, color: '#252833', fontSize: '13px', width: '100%', fontFamily: publicFonts, left: currentLanguage === "ar" ? 'auto' : '27px', right: currentLanguage === "ar" ? '27px' : 'auto' }),
    indicatorSeparator: styles => ({ ...styles, display: 'none' }),
    menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' }),
    dropdownIndicator: styles => ({ ...styles, display: 'none' })
};

export default CompanyDropdown