
import ip_public from "../IP_Configrations.json";

import CryptoJS from 'crypto-js';
//import JSZip from 'JSZip'; 

let userPermissions = window.localStorage.getItem("permissions") ? CryptoJS.enc.Base64.parse(window.localStorage.getItem("permissions")).toString(CryptoJS.enc.Utf8) : [];
// let contactName="Admin";
// let iscompnay=false; 
// let authorize=false; 
// let wfSettings={};

export default class Config {

	static getPublicConfiguartion() {
		return ip_public;
	}

	static getPermissions() {
		var permissions = userPermissions;
		userPermissions = permissions;
		return permissions;
	}

	static IsAllow(code) {

		let isCompany = this.getPayload().uty == 'company' ? true : false;

		if (isCompany === false) {
			let isAllowed = userPermissions.indexOf(code);
			if (isAllowed > -1) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}

	static getPayload() {
		var payload = window.localStorage.getItem("claims") ? CryptoJS.enc.Base64.parse(window.localStorage.getItem("claims")).toString(CryptoJS.enc.Utf8) : "";
		return payload ? JSON.parse(payload) : {};
	}


	static	StringBuilder = function (value) {
		var self = this;

		self.strings = new Array("");
		self.append(value);
	};

	// StringBuilder.prototype.append = function (value) {
	// 	var self = this;

	// 	if (value) {
	// 		self.strings.push(value);
	// 	}
	// };

	// StringBuilder.prototype.clear = function () {
	// 	var self = this;

	// 	self.strings.length = 1;
	// };

	// StringBuilder.prototype.toString = function () {
	// 	var self = this;

	// 	return self.strings.join("");
	// };

	// static all(arrayOfPromises) {
	// 	return $.when.apply($, arrayOfPromises).then(function () {
	// 		return Array.prototype.slice.call(arguments, 0);
	// 	});
	// };

	// static base64Encode = function (str) {
	// 	var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	// 	var out = "",
	// 		i = 0,
	// 		len = str.length,
	// 		c1, c2, c3;
	// 	while (i < len) {
	// 		c1 = str.charCodeAt(i++) & 0xff;
	// 		if (i == len) {
	// 			out += CHARS.charAt(c1 >> 2);
	// 			out += CHARS.charAt((c1 & 0x3) << 4);
	// 			out += "==";
	// 			break;
	// 		}
	// 		c2 = str.charCodeAt(i++);
	// 		if (i == len) {
	// 			out += CHARS.charAt(c1 >> 2);
	// 			out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	// 			out += CHARS.charAt((c2 & 0xF) << 2);
	// 			out += "=";
	// 			break;
	// 		}
	// 		c3 = str.charCodeAt(i++);
	// 		out += CHARS.charAt(c1 >> 2);
	// 		out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	// 		out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	// 		out += CHARS.charAt(c3 & 0x3F);
	// 	}
	// 	return out;
	// };

	// static 	excelExportingServiceForDocs = function (attachments, fieldsArray, fileName, headerImage, itemsArray, itemsColumnDefenition, workFlows, itemsArray1, itemsColumnDefenition1) {
	// 	var zip = new JSZip();

	// 	fileName = fileName ? fileName.replace('.pdf', '') : ' Excel File';

	// 	var contentType = new StringBuilder();

	// 	contentType.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	contentType.append(
	// 		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
	// 		+ '<Default Extension="bin" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings"/>'
	// 		+ '<Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
	// 		+ '<Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml"'
	// 		+ ' ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
	// 		+ ((workFlows && workFlows.length) ? '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>' : '')
	// 		+ ((itemsArray && itemsArray.length) ? '<Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>' : '')
	// 		+ ((itemsArray1 && itemsArray1.length) ? '<Override PartName="/xl/tables/table2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>' : '')
	// 		+ '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>'
	// 	);

	// 	zip.file("[Content_Types].xml", contentType.toString());

	// 	var rels = new StringBuilder();

	// 	rels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	rels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" '
	// 		+ 'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
	// 		+ '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
	// 		+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
	// 		+ '</Relationships>'
	// 	);

	// 	var relsFolder = zip.folder("_rels");

	// 	relsFolder.file(".rels", rels.toString());

	// 	var appProp = new StringBuilder();

	// 	appProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	appProp.append(
	// 		'<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
	// 		+ '<Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant">'
	// 		+ '<vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts>'
	// 		+ '<vt:vector size="1" baseType="lpstr"><vt:lpstr>Sheet1</vt:lpstr></vt:vector></TitlesOfParts><Company></Company><LinksUpToDate>false</LinksUpToDate>'
	// 		+ '<SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>'
	// 	);

	// 	var coreProp = new StringBuilder();

	// 	coreProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	coreProp.append(
	// 		'<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"'
	// 		+ ' xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/"'
	// 		+ ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Ibrahim Amin</dc:creator>'
	// 		+ '<cp:lastModifiedBy>Ibrahim Amin</cp:lastModifiedBy>'
	// 		+ '<cp:lastPrinted>2016-03-29T15:52:14Z</cp:lastPrinted><dcterms:created xsi:type="dcterms:W3CDTF">2016-03-29T14:59:53Z</dcterms:created><dcterms:modified'
	// 		+ ' xsi:type="dcterms:W3CDTF">2016-03-29T15:52:25Z</dcterms:modified></cp:coreProperties>'
	// 	);

	// 	var customProp = new StringBuilder();

	// 	customProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	customProp.append(
	// 		'<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="4" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant><vt:variant><vt:lpstr>Named Ranges</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="2" baseType="lpstr"><vt:lpstr>Procoor Exporting System</vt:lpstr></vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>'
	// 	);

	// 	var docPropsFolder = zip.folder("docProps");

	// 	docPropsFolder.file("app.xml", appProp.toString());
	// 	docPropsFolder.file("core.xml", coreProp.toString());
	// 	docPropsFolder.file("custom.xml", customProp.toString());

	// 	var emptyLine = '<row spans="1:8" x14ac:dyDescent="0.25"></row>';

	// 	var xlFolder = zip.folder("xl");

	// 	var xlRelsFolder = xlFolder.folder("_rels");

	// 	var workbookRels = new StringBuilder();

	// 	workbookRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookRels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
	// 		+ '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
	// 		+ '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>'
	// 		+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
	// 		+ '<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
	// 		+ '</Relationships>'
	// 	);

	// 	xlRelsFolder.file("workbook.xml.rels", workbookRels.toString());

	// 	var availableColumns = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(' ');

	// 	var rowsTillTable2 = 0;

	// 	rowsTillTable2 = fieldsArray.length > 0 ? rowsTillTable2 : 3;

	// 	var sharedStrings = new StringBuilder();

	// 	var sharedStringsCount = 5;

	// 	sharedStrings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	sharedStrings.append('<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>' + fileName + '</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>' + itemsColumnDefenition.name + '</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>' + itemsColumnDefenition1.name + '</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>Attachments</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>Workflow</t>');
	// 	sharedStrings.append('</si>');

	// 	fieldsArray.forEach(function (item, index) {
	// 		var itemName = item.name;

	// 		rowsTillTable2 = 3 + Math.ceil((fieldsArray.length / 2));

	// 		if (typeof itemName === 'string' && itemName.indexOf("&") !== -1) {
	// 			itemName = itemName.replace(/&/g, "&amp;");
	// 		}

	// 		if (typeof itemName === 'string' && itemName.indexOf("<") !== -1) {
	// 			itemName = itemName.replace(/</g, "&lt;");
	// 		}

	// 		if (typeof itemName === 'string' && itemName.indexOf(">") !== -1) {
	// 			itemName = itemName.replace(/>/g, "&gt;");
	// 		}

	// 		sharedStrings.append('<si>');
	// 		sharedStrings.append('<t>' + itemName + '</t>');
	// 		sharedStrings.append('</si>');
	// 		sharedStringsCount++;

	// 		var itemValue = item.value;

	// 		if (typeof itemValue === 'string' && itemValue.indexOf("&") !== -1) {
	// 			itemValue = itemValue.replace(/&/g, "&amp;");
	// 		}

	// 		if (typeof itemValue === 'string' && itemValue.indexOf("<") !== -1) {
	// 			itemValue = itemValue.replace(/</g, "&lt;");
	// 		}

	// 		if (typeof itemValue === 'string' && itemValue.indexOf(">") !== -1) {
	// 			itemValue = itemValue.replace(/>/g, "&gt;");
	// 		}

	// 		sharedStrings.append('<si>');
	// 		sharedStrings.append('<t>' + itemValue + '</t>');
	// 		sharedStrings.append('</si>');
	// 		sharedStringsCount++;
	// 	});

	// 	var styles = new StringBuilder();

	// 	styles.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	styles.append(
	// 		'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"> '//xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main">
	// 		+ '<fonts count="4" >'
	// 		+ '<font><sz val="11"/><color theme="1"/>'
	// 		+ '<name val="Calibri"/><family val="2"/>'
	// 		+ '<scheme val="minor"/></font><font><b/>'
	// 		+ '<sz val="14"/><color theme="1"/>'
	// 		+ '<name val="Calibri"/><family val="2"/>'
	// 		+ '<scheme val="minor"/></font><font><b/>'
	// 		+ '<sz val="10.5"/><color theme="1"/>'
	// 		+ '<name val="Calibri Light"/>'
	// 		+ '<family val="2"/><scheme val="major"/>'
	// 		+ '</font>'
	// 		+ '<font><b/><sz val="12"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts>'
	// 		+ '<fills count="6"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'
	// 		+ '<fill><patternFill patternType="solid"><fgColor theme="8" tint="0.39997558519241921"/><bgColor indexed="64"/></patternFill></fill>'
	// 		+ '<fill><patternFill patternType="solid"><fgColor theme="9" tint="0.79998168889431442"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor theme="1" tint="0.249977111117893"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor theme="9" tint="0.39997558519241921"/><bgColor indexed="64"/></patternFill></fill></fills>'
	// 		+ '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
	// 		+ '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
	// 		+ '<cellXfs count="10">'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="3" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyBorder="1"/></cellXfs>'
	// 		+ '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="10"><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="1" tint="0.249977111117893"/></patternFill></fill></dxf></dxfs>'
	// 		+ '<tableStyles count="0" defaultPivotStyle="PivotStyleLight16" defaultTableStyle="TableStyleMedium2"/>'
	// 		+ '<extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">'
	// 		+ '<x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext>'
	// 		+ '<ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">'
	// 		+ '<x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>'
	// 	);

	// 	xlFolder.file("styles.xml", styles.toString());

	// 	var workbook = new StringBuilder();

	// 	workbook.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbook.append(
	// 		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
	// 		+ ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
	// 		+ ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">'
	// 		+ '<fileVersion appName="xl" lastEdited="6" lowestEdited="6" rupBuild="14420"/><workbookPr/>'
	// 		+ '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
	// 		+ '<mc:Choice Requires="x15"><x15ac:absPath url="C:\Users\ibrahim.EGEC-PM\Desktop\" xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"/></mc:Choice></mc:AlternateContent>'
	// 		+ '<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="20490" windowHeight="7665"/></bookViews>'
	// 		+ '<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="162913"/>'
	// 		+ '<extLst><ext uri="{140A7094-0E35-4892-8432-C4D2E57EDEB5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">'
	// 		+ '<x15:workbookPr chartTrackingRefBase="1"/></ext></extLst></workbook>'
	// 	);

	// 	xlFolder.file("workbook.xml", workbook.toString());

	// 	var xlWorksheetsFolder = xlFolder.folder("worksheets");

	// 	var xlRelsWorksheetsFolder = xlWorksheetsFolder.folder("_rels");

	// 	var workbookWorkSheetsRels = new StringBuilder();

	// 	workbookWorkSheetsRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookWorkSheetsRels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
	// 		+ ((itemsArray && itemsArray.length) ? '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table1.xml"/>' : '')
	// 		+ ((itemsArray1 && itemsArray1.length) ? '<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table2.xml"/>' : '')
	// 		+ ((workFlows && workFlows.length) ? '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>' : '')
	// 		+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/printerSettings" Target="../printerSettings/printerSettings1.bin"/></Relationships>'
	// 	);

	// 	xlRelsWorksheetsFolder.file("sheet1.xml.rels", workbookWorkSheetsRels.toString());

	// 	var sheet = new StringBuilder();

	// 	sheet.append(
	// 		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
	// 		+ ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" '
	// 		+ ' xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><sheetPr>'
	// 		+ ' <pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView showGridLines="0" tabSelected="1" workbookViewId="0">'
	// 		+ ' <selection activeCell="I20" sqref="I20"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/>'
	// 		+ '<cols><col min="2" max="8" width="17.5703125" bestFit="1" customWidth="1"/></cols><sheetData>'
	// 		+ '<row r="2" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25">'
	// 		+ '<c r="B2" s="4" t="s"><v>0</v></c>'
	// 		+ '<c r="C2" s="4"/>'
	// 		+ '<c r="D2" s="4"/><c r="E2" s="4"/>'
	// 		+ '<c r="F2" s="4"/><c r="G2" s="4"/><c r="H2" s="4"/>'
	// 		+ '</row>'
	// 		+ '<row r="3" spans="1:8" x14ac:dyDescent="0.25"></row>'
	// 	);

	// 	var rows = Math.ceil((fieldsArray.length / 2));

	// 	var index = 0;

	// 	for (var count = 0; count < rows; count++) {
	// 		var sharedIndex = index + 5 + (count * 2);

	// 		if (((index + 1) < fieldsArray.length) && (index < fieldsArray.length)) {
	// 			sheet.append('<row r="' + (count + 4) + '" spans="1:8" ht="15" customHeight="1" x14ac:dyDescent="0.25"><c r="B' + (count + 4) + '" s="2" t="s"><v>' + sharedIndex + '</v></c><c r="C' + (count + 4) + '" s="6" t="s"><v>' + (sharedIndex + 1) +
	// 				'</v></c><c r="G' + (count + 4) + '" s="2" t="s"><v>' + (sharedIndex + 2) + '</v></c><c r="H' + (count + 4) + '" s="6" t="s"><v>' + (sharedIndex + 3) + '</v></c></row>');
	// 		} else if (index < fieldsArray.length) {
	// 			sheet.append('<row r="' + (count + 4) + '" spans="1:8" ht="15" customHeight="1" x14ac:dyDescent="0.25"><c r="B' + (count + 4) + '" s="2" t="s"><v>' + sharedIndex + '</v></c><c r="C' + (count + 4) + '" s="6" t="s"><v>' + (sharedIndex + 1) +
	// 				'</v></c></row>');
	// 		}

	// 		index += 2;
	// 	}

	// 	var mergedCells = [];

	// 	sheet.append(emptyLine.replace('<row ', '<row r="' + (rows + 4) + '" '));

	// 	mergedCells.push((rows + 4));

	// 	var rowCountAfterTable = rows + 5;
	// 	var currentRow = 0;
	// 	if (itemsArray && itemsArray.length) {

	// 		rowsTillTable2 = rowsTillTable2 + itemsArray.length + 3;

	// 		sheet.append('<row r="'
	// 			+ rowCountAfterTable + '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B'
	// 			+ rowCountAfterTable + '" s="5" t="s"><v>1</v></c></row>');

	// 		mergedCells.push(rowCountAfterTable);

	// 		currentRow = rows + 6;

	// 		var sharedCurrentIndex = sharedStringsCount;

	// 		if (itemsColumnDefenition && itemsColumnDefenition.friendlyNames && itemsColumnDefenition.friendlyNames.length) {
	// 			itemsColumnDefenition.friendlyNames.forEach(function (item, index) {
	// 				sharedStrings.append('<si>');
	// 				sharedStrings.append('<t>' + item + '</t>');
	// 				sharedStrings.append('</si>');
	// 				sharedStringsCount++;
	// 			});

	// 			sheet.append('<row r="' + currentRow + '">');
	// 			itemsColumnDefenition.friendlyNames.forEach(function (item, index) {
	// 				sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 				sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 				sheet.append('</c>');

	// 				sharedCurrentIndex++;
	// 			});
	// 			sheet.append('</row>');

	// 			currentRow++;

	// 			sharedCurrentIndex = sharedStringsCount;

	// 			if (itemsColumnDefenition.fields && itemsColumnDefenition.fields.length) {
	// 				itemsArray.forEach(function (item, index) {
	// 					sheet.append('<row r="' + currentRow + '" spans="1:8" x14ac:dyDescent="0.25">');
	// 					itemsColumnDefenition.fields.forEach(function (field, index) {
	// 						var fieldValue = item[field];

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("&") !== -1) {
	// 							fieldValue = fieldValue.replace(/&/g, "&amp;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("<") !== -1) {
	// 							fieldValue = fieldValue.replace(/</g, "&lt;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf(">") !== -1) {
	// 							fieldValue = fieldValue.replace(/>/g, "&gt;");
	// 						}

	// 						sharedStrings.append('<si>');
	// 						sharedStrings.append('<t>' + fieldValue + '</t>');
	// 						sharedStrings.append('</si>');
	// 						sharedStringsCount++;

	// 						sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 						sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 						sheet.append('</c>');

	// 						sharedCurrentIndex++;
	// 					});
	// 					sheet.append('</row>');

	// 					currentRow++;
	// 				});
	// 			}

	// 			sheet.append(emptyLine.replace('<row ', '<row r="' + currentRow + '" '));

	// 			mergedCells.push(currentRow);

	// 			rowCountAfterTable = currentRow + 1;

	// 			currentRow = currentRow + 1;
	// 		}
	// 	}

	// 	sheet.append(emptyLine.replace('<row ', '<row r="' + (currentRow + 1) + '" '));

	// 	mergedCells.push((currentRow + 1));

	// 	rowCountAfterTable = rowCountAfterTable + 1;
	// 	currentRow = currentRow + 1;

	// 	if (itemsArray1 && itemsArray1.length) {

	// 		sheet.append('<row r="'
	// 			+ rowCountAfterTable + '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B'
	// 			+ rowCountAfterTable + '" s="5" t="s"><v>2</v></c></row>');

	// 		if (itemsColumnDefenition1 && itemsColumnDefenition1.friendlyNames && itemsColumnDefenition1.friendlyNames.length) {
	// 			itemsColumnDefenition1.friendlyNames.forEach(function (item, index) {
	// 				sharedStrings.append('<si>');
	// 				sharedStrings.append('<t>' + item + '</t>');
	// 				sharedStrings.append('</si>');
	// 				sharedStringsCount++;
	// 			});
	// 			currentRow++;
	// 			sheet.append('<row r="' + currentRow + '">');

	// 			itemsColumnDefenition1.friendlyNames.forEach(function (item, index) {
	// 				sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 				sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 				sheet.append('</c>');

	// 				sharedCurrentIndex++;
	// 			});
	// 			sheet.append('</row>');

	// 			currentRow++;

	// 			sharedCurrentIndex = sharedStringsCount;

	// 			if (itemsColumnDefenition1.fields && itemsColumnDefenition1.fields.length) {
	// 				itemsArray1.forEach(function (item, index) {
	// 					sheet.append('<row r="' + currentRow + '" spans="1:8" x14ac:dyDescent="0.25">');
	// 					itemsColumnDefenition1.fields.forEach(function (field, index) {
	// 						var fieldValue = item[field];

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("&") !== -1) {
	// 							fieldValue = fieldValue.replace(/&/g, "&amp;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("<") !== -1) {
	// 							fieldValue = fieldValue.replace(/</g, "&lt;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf(">") !== -1) {
	// 							fieldValue = fieldValue.replace(/>/g, "&gt;");
	// 						}

	// 						sharedStrings.append('<si>');
	// 						sharedStrings.append('<t>' + fieldValue + '</t>');
	// 						sharedStrings.append('</si>');
	// 						sharedStringsCount++;

	// 						sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 						sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 						sheet.append('</c>');

	// 						sharedCurrentIndex++;
	// 					});
	// 					sheet.append('</row>');

	// 					currentRow++;
	// 				});
	// 			}

	// 			sheet.append(emptyLine.replace('<row ', '<row r="' + (currentRow + 1) + '" '));

	// 			rowCountAfterTable = currentRow + 1;
	// 			currentRow = currentRow + 1;
	// 		}
	// 	}

	// 	if (attachments && attachments.length) {

	// 		sheet.append('<row r="' + rowCountAfterTable
	// 			+ '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B'
	// 			+ rowCountAfterTable + '" s="5" t="s"><v>3</v></c></row>');
	// 		mergedCells.push(rowCountAfterTable);

	// 		rowCountAfterTable++;

	// 		var attachmentString = "";
	// 		attachments.forEach(function (item, index) {
	// 			if (index < (attachments.length - 1)) {
	// 				attachmentString += (item.fileName + ' - ');
	// 			} else {
	// 				attachmentString += item.fileName;
	// 			}
	// 		});

	// 		if (typeof attachmentString === 'string' && attachmentString.indexOf("&") !== -1) {
	// 			attachmentString = attachmentString.replace(/&/g, "&amp;");
	// 		}

	// 		if (typeof attachmentString === 'string' && attachmentString.indexOf("<") !== -1) {
	// 			attachmentString = attachmentString.replace(/</g, "&lt;");
	// 		}

	// 		if (typeof attachmentString === 'string' && attachmentString.indexOf(">") !== -1) {
	// 			attachmentString = attachmentString.replace(/>/g, "&gt;");
	// 		}

	// 		sharedStrings.append('<si>');
	// 		sharedStrings.append('<t>' + attachmentString + '</t>');
	// 		sharedStrings.append('</si>');
	// 		sharedStringsCount++;

	// 		sheet.append('<row r="' + rowCountAfterTable + '" spans="1:8" x14ac:dyDescent="0.25"><c r="B' + rowCountAfterTable + '" s="3" t="s"><v>' + (sharedStringsCount - 1) + '</v></c></row>');
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;

	// 		sheet.append(emptyLine.replace('<row ', '<row r="' + rowCountAfterTable + '" '));
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;
	// 	}

	// 	if (workFlows && workFlows.length) {

	// 		sheet.append('<row r="' + rowCountAfterTable
	// 			+ '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B' + rowCountAfterTable
	// 			+ '" s="5" t="s"><v>4</v></c></row>');
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;

	// 		sheet.append('<row r="' + rowCountAfterTable + '" spans="1:8" ht="106.5" customHeight="1" x14ac:dyDescent="0.25"></row>');
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;

	// 		sheet.append(emptyLine.replace('<row ', '<row r="' + rowCountAfterTable + '" '));
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;
	// 	}

	// 	sheet.append('</sheetData>');
	// 	sheet.append('<mergeCells count="' + (mergedCells.length + 1) + '">');

	// 	sheet.append('<mergeCell ref="B2:H2"/>');

	// 	mergedCells.forEach(function (item) {
	// 		sheet.append('<mergeCell  ref="B' + item + ':H' + item + '"/>');
	// 	});

	// 	sheet.append(
	// 		'</mergeCells><pageMargins left="0.25" right="0.25" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>'
	// 		+ ' <pageSetup paperSize="9" orientation="landscape" r:id="rId1"/>'
	// 		+ ((workFlows && workFlows.length) ? '<drawing r:id="rId2"/>' : '')
	// 		+ '<tableParts count="2">'
	// 		+ ((itemsArray && itemsArray.length) ? '<tablePart r:id="rId3"/>' : '')
	// 		+ ((itemsArray1 && itemsArray1.length) ? '<tablePart r:id="rId5"/>' : '')
	// 		+ '</tableParts>'
	// 		+ '</worksheet>'
	// 	);

	// 	sharedStrings.append('</sst>');

	// 	xlFolder.file("sharedStrings.xml", sharedStrings.toString());

	// 	if (workFlows && workFlows.length) {
	// 		var workbookDrawings = new StringBuilder();

	// 		workbookDrawings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 		workbookDrawings.append('<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">');

	// 		var fullTenSignaturePictures = [
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>1</xdr:col><xdr:colOff>57150</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>57151</xdr:rowOff></xdr:from><xdr:to><xdr:col>1</xdr:col><xdr:colOff>762000</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>781051</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="2" name="Picture 1"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="666750" y="3676651"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>1</xdr:col><xdr:colOff>847725</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>57151</xdr:rowOff></xdr:from><xdr:to><xdr:col>2</xdr:col><xdr:colOff>381000</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>781051</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="12" name="Picture 11"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="1457325" y="3676651"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>2</xdr:col><xdr:colOff>466725</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>57151</xdr:rowOff></xdr:from><xdr:to><xdr:col>3</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>781051</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="13" name="Picture 12"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="2247900" y="3676651"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>3</xdr:col><xdr:colOff>76200</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>3</xdr:col><xdr:colOff>781050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="14" name="Picture 13"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="3028950" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>3</xdr:col><xdr:colOff>866775</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>4</xdr:col><xdr:colOff>400050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="15" name="Picture 14"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="3819525" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>4</xdr:col><xdr:colOff>476250</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>5</xdr:col><xdr:colOff>9525</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="16" name="Picture 15"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="4600575" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>5</xdr:col><xdr:colOff>95250</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>5</xdr:col><xdr:colOff>800100</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="17" name="Picture 16"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="5391150" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>5</xdr:col><xdr:colOff>885825</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>6</xdr:col><xdr:colOff>419100</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="18" name="Picture 17"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="6181725" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>6</xdr:col><xdr:colOff>495300</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>76201</xdr:rowOff></xdr:from><xdr:to><xdr:col>7</xdr:col><xdr:colOff>28575</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>800101</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="19" name="Picture 18"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="6962775" y="3695701"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>7</xdr:col><xdr:colOff>114300</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>76201</xdr:rowOff></xdr:from><xdr:to><xdr:col>7</xdr:col><xdr:colOff>819150</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>800101</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="20" name="Picture 19"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="7753350" y="3695701"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>')
	// 		];

	// 		var fullTenSignatureText = [
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>0</xdr:col><xdr:colOff>590550</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>800645</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="21" name="TextBox 20"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="590550" y="4420145"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>1</xdr:col><xdr:colOff>752475</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>810170</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="24" name="TextBox 23"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="1362075" y="4429670"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>2</xdr:col><xdr:colOff>381000</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>819695</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="25" name="TextBox 24"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="2162175" y="4439195"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>2</xdr:col><xdr:colOff>1162050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>819695</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="26" name="TextBox 25"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="2943225" y="4439195"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>3</xdr:col><xdr:colOff>781050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>829220</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="27" name="TextBox 26"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="3733800" y="4448720"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>4</xdr:col><xdr:colOff>390525</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>838745</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="28" name="TextBox 27"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="4514850" y="4458245"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>4</xdr:col><xdr:colOff>1162050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>848270</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="29" name="TextBox 28"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="5286375" y="4467770"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>5</xdr:col><xdr:colOff>790575</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>857795</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="30" name="TextBox 29"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="6086475" y="4477295"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>6</xdr:col><xdr:colOff>400050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>857795</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="31" name="TextBox 30"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="6867525" y="4477295"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>7</xdr:col><xdr:colOff>19050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>867320</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="32" name="TextBox 31"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="7658100" y="4486820"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>')
	// 		];

	// 		var xlDrawingsFolder = xlFolder.folder("drawings");

	// 		var xlRelsDrawingsFolder = xlDrawingsFolder.folder("_rels");

	// 		var workbookDrawingsRels = new StringBuilder();

	// 		workbookDrawingsRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 		workbookDrawingsRels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">');
	// 		workbookDrawingsRels.append('<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"'
	// 			+ 'Target="../media/signature.jpeg"/>');
	// 		workFlows[0].workflow.forEach(function (item, index) {
	// 			if (item.signature) {
	// 				workbookDrawingsRels.append('<Relationship Id="rId' + (index + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/' + item.signature + '"/>');
	// 				workbookDrawings.append(fullTenSignaturePictures[index].replace('r:embed="rId1"', 'r:embed="rId' + (index + 2) + '"'));
	// 			} else {
	// 				workbookDrawings.append(fullTenSignaturePictures[index]);
	// 			}
	// 		});
	// 		workbookDrawingsRels.append('</Relationships>');

	// 		xlRelsDrawingsFolder.file("drawing1.xml.rels", workbookDrawingsRels.toString());

	// 		workFlows[0].workflow.forEach(function (item, index) {
	// 			workbookDrawings.append(fullTenSignatureText[index].replace('status', item.status).replace('date', item.approvalDate).replace('contactName', item.contactName));
	// 		});

	// 		workbookDrawings.append('</xdr:wsDr>');

	// 		xlDrawingsFolder.file("drawing1.xml", workbookDrawings.toString());
	// 	}

	// 	var xlThemeFolder = xlFolder.folder("theme");

	// 	var xlRelsThemeFolder = xlThemeFolder.folder("_rels");

	// 	var workbookThemeRels = new StringBuilder();

	// 	workbookThemeRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookThemeRels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
	// 	);

	// 	xlRelsThemeFolder.file("theme1.xml.rels", workbookThemeRels.toString());

	// 	var workbookTheme = new StringBuilder();

	// 	workbookTheme.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookTheme.append(
	// 		'<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements>'
	// 		+ '<a:clrScheme name="Violet"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1>'
	// 		+ '<a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="373545"/></a:dk2><a:lt2>'
	// 		+ '<a:srgbClr val="DCD8DC"/></a:lt2><a:accent1><a:srgbClr val="AD84C6"/></a:accent1><a:accent2>'
	// 		+ '<a:srgbClr val="8784C7"/></a:accent2><a:accent3><a:srgbClr val="5D739A"/></a:accent3>'
	// 		+ '<a:accent4><a:srgbClr val="6997AF"/></a:accent4><a:accent5><a:srgbClr val="84ACB6"/></a:accent5>'
	// 		+ '<a:accent6><a:srgbClr val="6F8183"/></a:accent6><a:hlink><a:srgbClr val="69A020"/></a:hlink>'
	// 		+ '<a:folHlink><a:srgbClr val="8C8C8C"/></a:folHlink></a:clrScheme><a:fontScheme name="Office">'
	// 		+ '<a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/>'
	// 		+ '<a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/>'
	// 		+ '<a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线 Light"/>'
	// 		+ '<a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/>'
	// 		+ '<a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/>'
	// 		+ '<a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/>'
	// 		+ '<a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/>'
	// 		+ '<a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/>'
	// 		+ '<a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/>'
	// 		+ '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/>'
	// 		+ '<a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/>'
	// 		+ '<a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/>'
	// 		+ '<a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/>'
	// 		+ '<a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/>'
	// 		+ '<a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont>'
	// 		+ '<a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/>'
	// 		+ '<a:font script="Jpan" typeface="游ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/>'
	// 		+ '<a:font script="Hans" typeface="等线"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/>'
	// 		+ '<a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/>'
	// 		+ '<a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/>'
	// 		+ '<a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/>'
	// 		+ '<a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/>'
	// 		+ '<a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/>'
	// 		+ '<a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/>'
	// 		+ '<a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>'
	// 	);

	// 	xlThemeFolder.file("theme1.xml", workbookTheme.toString());

	// 	var xlTablesFolder = xlFolder.folder("tables");

	// 	var startTables = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

	// 	if (itemsArray && itemsArray.length) {

	// 		var workbookTables = new StringBuilder();

	// 		var lastLetter = availableColumns[itemsColumnDefenition.friendlyNames.length];

	// 		workbookTables.append('<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="Table1" displayName="Table1" ref="B' + (mergedCells[1] + 1) + ':' + (lastLetter + (mergedCells[1] + 1 + itemsArray.length)) +
	// 			'" totalsRowShown="0">');
	// 		workbookTables.append('<autoFilter ref="B' + (mergedCells[1] + 1) + ':' + (lastLetter + (mergedCells[1] + 1 + itemsArray.length)) + '"/>');
	// 		workbookTables.append('<tableColumns count="' + itemsColumnDefenition.friendlyNames.length + '">');
	// 		for (var j = 0; j < itemsColumnDefenition.friendlyNames.length; j++) {
	// 			workbookTables.append('<tableColumn id="' + (j + 1) + '" name="' + itemsColumnDefenition.friendlyNames[j] + '"/>');
	// 		}

	// 		workbookTables.append('</tableColumns><tableStyleInfo name="TableStyleMedium4" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>');

	// 		xlTablesFolder.file("table1.xml", startTables.toString() + workbookTables.toString());
	// 	}
	// 	if (itemsArray1 && itemsArray1.length) {
	// 		var workbookTables2 = new StringBuilder();

	// 		var lastMerge = mergedCells.length - 1;

	// 		var lastLetter = availableColumns[itemsColumnDefenition1.friendlyNames.length];
	// 		workbookTables2.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 		workbookTables2.append('<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="2" headerRowDxfId="0" headerRowBorderDxfId="1" tableBorderDxfId="2" dataDxfId="0" name="Table2" displayName="Table2" ref="B' + (rowsTillTable2 + 4)
	// 			+ ':' + (lastLetter + (rowsTillTable2 + 4 + itemsArray1.length)) + '" totalsRowShown="0">');
	// 		workbookTables2.append('<autoFilter ref="B' + (rowsTillTable2 + 4) + ':' + (lastLetter + (rowsTillTable2 + 4 + itemsArray1.length)) + '"/>');
	// 		workbookTables2.append('<tableColumns count="' + itemsColumnDefenition1.friendlyNames.length + '">');
	// 		for (var j = 0; j < itemsColumnDefenition1.friendlyNames.length; j++) {
	// 			workbookTables2.append('<tableColumn  dataDxfId="' + (itemsColumnDefenition1.friendlyNames.length - j) + '" id="' + (j + 1) + '" name="' + itemsColumnDefenition1.friendlyNames[j] + '"/>');
	// 		}

	// 		workbookTables2.append('</tableColumns><tableStyleInfo name="TableStyleMedium4" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>');

	// 		xlTablesFolder.file("table2.xml", workbookTables2.toString());
	// 	}

	// 	xlWorksheetsFolder.file('sheet1.xml', sheet.toString());

	// 	var printerSettings = xlFolder.folder("printerSettings");

	// 	$.ajax({
	// 		url: "/public/printerSettings/printerSettings1.bin",
	// 		type: "GET",
	// 		mimeType: "text/plain; charset=x-user-defined"
	// 	}).then(function (data) {
	// 		printerSettings.file("printerSettings1.bin", base64Encode(data), {
	// 			base64: true
	// 		});

	// 		var xlMediaFolder = xlFolder.folder("media");

	// 		var arrayOfPictures = ['/public/img/white.jpeg'];

	// 		if (workFlows && workFlows.length) {
	// 			workFlows[0].workflow.forEach(function (item, index) {
	// 				if (item.signature) { 
	// 					arrayOfPictures.push('/public/img/white.jpeg');
	// 				}
	// 			});
	// 		}

	// 		var arrayOfPromisesToPictures = arrayOfPictures.map(getPicture);

	// 		var promiseToArrayOfPictures = all(arrayOfPromisesToPictures);

	// 		promiseToArrayOfPictures.then(function (pictures) {
	// 			xlMediaFolder.file("signature.jpeg", base64Encode(pictures[0][0]), {
	// 				base64: true
	// 			});

	// 			if (arrayOfPictures.length > 1) {
	// 				pictures.forEach(function (picture, index) {
	// 					if (index > 0) {
	// 						xlMediaFolder.file("sig" + (index - 1) + ".jpeg", base64Encode(picture[0]), {
	// 							base64: true
	// 						});
	// 					}
	// 				});
	// 			}

	// 			var excelFile = zip.generate({
	// 				type: "blob"
	// 			});

	// 			saveAs(excelFile, (fileName || 'Procoor Generated Excel File') + '.xlsx');
	// 		}).fail(function (err) {
	// 			console.log(err);
	// 		});
	// 	});
	// };

	// static 	excelExportingServiceForDocsPayments = function (attachments, fieldsArray, fileName, headerImage, itemsArray, itemsColumnDefenition, workFlows, itemsArray1, itemsColumnDefenition1, itemsArray2, itemsColumnDefenition2) {
	// 	var zip = new JSZip();

	// 	var totals = itemsColumnDefenition1.friendlyNames;

	// 	fileName = fileName ? fileName.replace('.pdf', '') : ' Excel File';

	// 	var contentType = new StringBuilder();

	// 	contentType.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	contentType.append(
	// 		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
	// 		+ '<Default Extension="bin" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings"/>'
	// 		+ '<Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
	// 		+ '<Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml"'
	// 		+ ' ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
	// 		+ ((itemsArray && itemsArray.length) ? '<Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>' : '')
	// 		+ ((itemsArray1 && itemsArray1.length) ? '<Override PartName="/xl/tables/table2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>' : '')
	// 		+ ((itemsArray2 && itemsArray2.length) ? '<Override PartName="/xl/tables/table3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>' : '')
	// 		+ ((workFlows && workFlows.length) ? '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>' : '')
	// 		+ '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>'
	// 	);

	// 	zip.file("[Content_Types].xml", contentType.toString());

	// 	var rels = new StringBuilder();

	// 	rels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	rels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" '
	// 		+ 'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
	// 		+ '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
	// 		+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
	// 		+ '</Relationships>'
	// 	);

	// 	var relsFolder = zip.folder("_rels");

	// 	relsFolder.file(".rels", rels.toString());

	// 	var appProp = new StringBuilder();

	// 	appProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	appProp.append(
	// 		'<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
	// 		+ '<Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant">'
	// 		+ '<vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts>'
	// 		+ '<vt:vector size="1" baseType="lpstr"><vt:lpstr>Sheet1</vt:lpstr></vt:vector></TitlesOfParts><Company></Company><LinksUpToDate>false</LinksUpToDate>'
	// 		+ '<SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>'
	// 	);

	// 	var coreProp = new StringBuilder();

	// 	coreProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	coreProp.append(
	// 		'<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"'
	// 		+ ' xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/"'
	// 		+ ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Ibrahim Amin</dc:creator>'
	// 		+ '<cp:lastModifiedBy>Ibrahim Amin</cp:lastModifiedBy>'
	// 		+ '<cp:lastPrinted>2016-03-29T15:52:14Z</cp:lastPrinted><dcterms:created xsi:type="dcterms:W3CDTF">2016-03-29T14:59:53Z</dcterms:created><dcterms:modified'
	// 		+ ' xsi:type="dcterms:W3CDTF">2016-03-29T15:52:25Z</dcterms:modified></cp:coreProperties>'
	// 	);

	// 	var customProp = new StringBuilder();

	// 	customProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	customProp.append(
	// 		'<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="4" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant><vt:variant><vt:lpstr>Named Ranges</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="2" baseType="lpstr"><vt:lpstr>Procoor Exporting System</vt:lpstr></vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>'
	// 	);

	// 	var docPropsFolder = zip.folder("docProps");

	// 	docPropsFolder.file("app.xml", appProp.toString());
	// 	docPropsFolder.file("core.xml", coreProp.toString());
	// 	docPropsFolder.file("custom.xml", customProp.toString());

	// 	var emptyLine = '<row spans="1:8" x14ac:dyDescent="0.25"></row>';

	// 	var xlFolder = zip.folder("xl");

	// 	var xlRelsFolder = xlFolder.folder("_rels");

	// 	var workbookRels = new StringBuilder();

	// 	workbookRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookRels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
	// 		+ '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
	// 		+ '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>'
	// 		+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
	// 		+ '<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
	// 		+ '</Relationships>'
	// 	);

	// 	xlRelsFolder.file("workbook.xml.rels", workbookRels.toString());

	// 	var availableColumns = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(' ');

	// 	var rowsTillTable2 = 0;

	// 	rowsTillTable2 = fieldsArray.length > 0 ? rowsTillTable2 : 3;
	// 	var rowsTillTable3 = 0;

	// 	rowsTillTable3 = fieldsArray.length > 0 ? rowsTillTable3 : 3;

	// 	var sharedStrings = new StringBuilder();

	// 	var sharedStringsCount = 6;

	// 	sharedStrings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	sharedStrings.append('<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>' + fileName + '</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>' + itemsColumnDefenition.name + '</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>' + itemsColumnDefenition1.name + '</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>' + itemsColumnDefenition2.name + '</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>Attachments</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>Workflow</t>');
	// 	sharedStrings.append('</si>');

	// 	fieldsArray.forEach(function (item, index) {
	// 		var itemName = item.name;

	// 		rowsTillTable2 = 3 + Math.ceil((fieldsArray.length / 2));
	// 		rowsTillTable3 = 3 + (rowsTillTable2);

	// 		if (typeof itemName === 'string' && itemName.indexOf("&") !== -1) {
	// 			itemName = itemName.replace(/&/g, "&amp;");
	// 		}

	// 		if (typeof itemName === 'string' && itemName.indexOf("<") !== -1) {
	// 			itemName = itemName.replace(/</g, "&lt;");
	// 		}

	// 		if (typeof itemName === 'string' && itemName.indexOf(">") !== -1) {
	// 			itemName = itemName.replace(/>/g, "&gt;");
	// 		}

	// 		sharedStrings.append('<si>');
	// 		sharedStrings.append('<t>' + itemName + '</t>');
	// 		sharedStrings.append('</si>');
	// 		sharedStringsCount++;

	// 		var itemValue = item.value;

	// 		if (typeof itemValue === 'string' && itemValue.indexOf("&") !== -1) {
	// 			itemValue = itemValue.replace(/&/g, "&amp;");
	// 		}

	// 		if (typeof itemValue === 'string' && itemValue.indexOf("<") !== -1) {
	// 			itemValue = itemValue.replace(/</g, "&lt;");
	// 		}

	// 		if (typeof itemValue === 'string' && itemValue.indexOf(">") !== -1) {
	// 			itemValue = itemValue.replace(/>/g, "&gt;");
	// 		}

	// 		sharedStrings.append('<si>');
	// 		sharedStrings.append('<t>' + itemValue + '</t>');
	// 		sharedStrings.append('</si>');
	// 		sharedStringsCount++;
	// 	});

	// 	var styles = new StringBuilder();

	// 	styles.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	styles.append(
	// 		'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"> '//xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main">
	// 		+ '<fonts count="4" >'
	// 		+ '<font><sz val="11"/><color theme="1"/>'
	// 		+ '<name val="Calibri"/><family val="2"/>'
	// 		+ '<scheme val="minor"/></font><font><b/>'
	// 		+ '<sz val="14"/><color theme="1"/>'
	// 		+ '<name val="Calibri"/><family val="2"/>'
	// 		+ '<scheme val="minor"/></font><font><b/>'
	// 		+ '<sz val="10.5"/><color theme="1"/>'
	// 		+ '<name val="Calibri Light"/>'
	// 		+ '<family val="2"/><scheme val="major"/>'
	// 		+ '</font>'
	// 		+ '<font><b/><sz val="12"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts>'
	// 		+ '<fills count="6"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'
	// 		+ '<fill><patternFill patternType="solid"><fgColor theme="8" tint="0.39997558519241921"/><bgColor indexed="64"/></patternFill></fill>'
	// 		+ '<fill><patternFill patternType="solid"><fgColor theme="9" tint="0.79998168889431442"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor theme="1" tint="0.249977111117893"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor theme="9" tint="0.39997558519241921"/><bgColor indexed="64"/></patternFill></fill></fills>'
	// 		+ '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
	// 		+ '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
	// 		+ '<cellXfs count="10">'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="3" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>'
	// 		+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyBorder="1"/></cellXfs>'
	// 		+ '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="10"><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="9" tint="0.39997558519241921"/></patternFill></fill></dxf><dxf><fill><patternFill patternType="solid"><fgColor indexed="64"/><bgColor theme="1" tint="0.249977111117893"/></patternFill></fill></dxf></dxfs>'
	// 		+ '<tableStyles count="0" defaultPivotStyle="PivotStyleLight16" defaultTableStyle="TableStyleMedium2"/>'
	// 		+ '<extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">'
	// 		+ '<x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext>'
	// 		+ '<ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">'
	// 		+ '<x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>'
	// 	);

	// 	xlFolder.file("styles.xml", styles.toString());

	// 	var workbook = new StringBuilder();

	// 	workbook.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbook.append(
	// 		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
	// 		+ ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
	// 		+ ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">'
	// 		+ '<fileVersion appName="xl" lastEdited="6" lowestEdited="6" rupBuild="14420"/><workbookPr/>'
	// 		+ '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
	// 		+ '<mc:Choice Requires="x15"><x15ac:absPath url="C:\Users\ibrahim.EGEC-PM\Desktop\" xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"/></mc:Choice></mc:AlternateContent>'
	// 		+ '<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="20490" windowHeight="7665"/></bookViews>'
	// 		+ '<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="162913"/>'
	// 		+ '<extLst><ext uri="{140A7094-0E35-4892-8432-C4D2E57EDEB5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">'
	// 		+ '<x15:workbookPr chartTrackingRefBase="1"/></ext></extLst></workbook>'
	// 	);

	// 	xlFolder.file("workbook.xml", workbook.toString());

	// 	var xlWorksheetsFolder = xlFolder.folder("worksheets");

	// 	var xlRelsWorksheetsFolder = xlWorksheetsFolder.folder("_rels");

	// 	var workbookWorkSheetsRels = new StringBuilder();

	// 	workbookWorkSheetsRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookWorkSheetsRels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
	// 		+ ((itemsArray && itemsArray.length) ? '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table1.xml"/>' : '')
	// 		+ ((itemsArray1 && itemsArray1.length) ? '<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table2.xml"/>' : '')
	// 		+ ((itemsArray2 && itemsArray2.length) ? '<Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table3.xml"/>' : '')
	// 		+ ((workFlows && workFlows.length) ? '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>' : '')
	// 		+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/printerSettings" Target="../printerSettings/printerSettings1.bin"/></Relationships>'
	// 	);

	// 	xlRelsWorksheetsFolder.file("sheet1.xml.rels", workbookWorkSheetsRels.toString());

	// 	var sheet = new StringBuilder();

	// 	sheet.append(
	// 		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
	// 		+ ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" '
	// 		+ ' xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><sheetPr>'
	// 		+ ' <pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView showGridLines="0" tabSelected="1" workbookViewId="0">'
	// 		+ ' <selection activeCell="I20" sqref="I20"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/>'
	// 		+ '<cols><col min="2" max="8" width="17.5703125" bestFit="1" customWidth="1"/></cols><sheetData>'
	// 		+ '<row r="2" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25">'
	// 		+ '<c r="B2" s="4" t="s"><v>0</v></c>'
	// 		+ '<c r="C2" s="4"/>'
	// 		+ '<c r="D2" s="4"/><c r="E2" s="4"/>'
	// 		+ '<c r="F2" s="4"/><c r="G2" s="4"/><c r="H2" s="4"/>'
	// 		+ '</row>'
	// 		+ '<row r="3" spans="1:8" x14ac:dyDescent="0.25"></row>'
	// 	);

	// 	var rows = Math.ceil((fieldsArray.length / 2));

	// 	var index = 0;

	// 	for (var count = 0; count < rows; count++) {
	// 		var sharedIndex = index + 6 + (count * 2);

	// 		if (((index + 1) < fieldsArray.length) && (index < fieldsArray.length)) {
	// 			sheet.append('<row r="' + (count + 4) + '" spans="1:8" ht="15" customHeight="1" x14ac:dyDescent="0.25"><c r="B' + (count + 4) + '" s="2" t="s"><v>' + sharedIndex + '</v></c><c r="C' + (count + 4) + '" s="6" t="s"><v>' + (sharedIndex + 1) +
	// 				'</v></c><c r="G' + (count + 4) + '" s="2" t="s"><v>' + (sharedIndex + 2) + '</v></c><c r="H' + (count + 4) + '" s="6" t="s"><v>' + (sharedIndex + 3) + '</v></c></row>');
	// 		} else if (index < fieldsArray.length) {
	// 			sheet.append('<row r="' + (count + 4) + '" spans="1:8" ht="15" customHeight="1" x14ac:dyDescent="0.25"><c r="B' + (count + 4) + '" s="2" t="s"><v>' + sharedIndex + '</v></c><c r="C' + (count + 4) + '" s="6" t="s"><v>' + (sharedIndex + 1) +
	// 				'</v></c></row>');
	// 		}

	// 		index += 2;
	// 	}

	// 	var mergedCells = [];

	// 	sheet.append(emptyLine.replace('<row ', '<row r="' + (rows + 4) + '" '));

	// 	mergedCells.push((rows + 4));

	// 	var rowCountAfterTable = rows + 5;
	// 	var currentRow = 0;
	// 	if (itemsArray && itemsArray.length) {

	// 		rowsTillTable2 = rowsTillTable2 + itemsArray.length + 3;

	// 		sheet.append('<row r="'
	// 			+ rowCountAfterTable + '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B'
	// 			+ rowCountAfterTable + '" s="5" t="s"><v>1</v></c></row>');

	// 		mergedCells.push(rowCountAfterTable);

	// 		currentRow = rows + 6;

	// 		var sharedCurrentIndex = sharedStringsCount;

	// 		if (itemsColumnDefenition && itemsColumnDefenition.friendlyNames && itemsColumnDefenition.friendlyNames.length) {
	// 			itemsColumnDefenition.friendlyNames.forEach(function (item, index) {
	// 				sharedStrings.append('<si>');
	// 				sharedStrings.append('<t>' + item + '</t>');
	// 				sharedStrings.append('</si>');
	// 				sharedStringsCount++;
	// 			});

	// 			sheet.append('<row r="' + currentRow + '">');
	// 			itemsColumnDefenition.friendlyNames.forEach(function (item, index) {
	// 				sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 				sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 				sheet.append('</c>');

	// 				sharedCurrentIndex++;
	// 			});
	// 			sheet.append('</row>');

	// 			currentRow++;

	// 			sharedCurrentIndex = sharedStringsCount;

	// 			if (itemsColumnDefenition.fields && itemsColumnDefenition.fields.length) {
	// 				itemsArray.forEach(function (item, index) {
	// 					sheet.append('<row r="' + currentRow + '" spans="1:8" x14ac:dyDescent="0.25">');
	// 					itemsColumnDefenition.fields.forEach(function (field, index) {
	// 						var fieldValue = item[field];

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("&") !== -1) {
	// 							fieldValue = fieldValue.replace(/&/g, "&amp;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("<") !== -1) {
	// 							fieldValue = fieldValue.replace(/</g, "&lt;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf(">") !== -1) {
	// 							fieldValue = fieldValue.replace(/>/g, "&gt;");
	// 						}

	// 						sharedStrings.append('<si>');
	// 						sharedStrings.append('<t>' + fieldValue + '</t>');
	// 						sharedStrings.append('</si>');
	// 						sharedStringsCount++;

	// 						sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 						sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 						sheet.append('</c>');

	// 						sharedCurrentIndex++;
	// 					});
	// 					sheet.append('</row>');

	// 					currentRow++;
	// 				});
	// 			}

	// 			sheet.append(emptyLine.replace('<row ', '<row r="' + currentRow + '" '));

	// 			mergedCells.push(currentRow);

	// 			rowCountAfterTable = currentRow + 1;

	// 			currentRow = currentRow + 1;
	// 		}
	// 	} else {
	// 		var sharedCurrentIndex = sharedStringsCount;

	// 		sheet.append('<row r="' + currentRow + '">');

	// 		sheet.append('</row>');

	// 		rowsTillTable2 = rowsTillTable2 + 2;

	// 		mergedCells.push(rowCountAfterTable);

	// 		currentRow = rows + 6;

	// 		sheet.append(emptyLine.replace('<row ', '<row r="' + currentRow + '" '));

	// 		mergedCells.push(currentRow);

	// 		rowCountAfterTable = currentRow + 1;

	// 		currentRow = currentRow + 1;

	// 	}

	// 	sheet.append(emptyLine.replace('<row ', '<row r="' + (currentRow + 1) + '" '));

	// 	mergedCells.push((currentRow + 1));

	// 	rowCountAfterTable = rowCountAfterTable + 1;
	// 	currentRow = currentRow + 1;

	// 	if (itemsArray1 && itemsArray1.length) {
	// 		rowsTillTable3 = rowsTillTable3 + itemsArray1.length + (itemsArray ? itemsArray.length : 0) + 2;

	// 		sheet.append('<row r="'
	// 			+ rowCountAfterTable + '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B'
	// 			+ rowCountAfterTable + '" s="5" t="s"><v>2</v></c></row>');

	// 		if (itemsColumnDefenition1 && itemsColumnDefenition1.friendlyNames && itemsColumnDefenition1.friendlyNames.length) {
	// 			itemsColumnDefenition1.friendlyNames.unshift("building");
	// 			itemsColumnDefenition1.friendlyNames.forEach(function (item, index) {
	// 				sharedStrings.append('<si>');
	// 				sharedStrings.append('<t>' + item + '</t>');
	// 				sharedStrings.append('</si>');
	// 				sharedStringsCount++;
	// 			});
	// 			currentRow++;
	// 			sheet.append('<row r="' + currentRow + '">');

	// 			itemsColumnDefenition1.friendlyNames.forEach(function (item, index) {
	// 				sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 				sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 				sheet.append('</c>');

	// 				sharedCurrentIndex++;
	// 			});
	// 			sheet.append('</row>');

	// 			currentRow++;

	// 			sharedCurrentIndex = sharedStringsCount;

	// 			if (itemsColumnDefenition1.fields && itemsColumnDefenition1.fields.length) {

	// 				itemsArray1.forEach(function (item, index) {
	// 					sheet.append('<row r="' + currentRow + '" spans="1:8" x14ac:dyDescent="0.25">');
	// 					itemsColumnDefenition1.friendlyNames.forEach(function (field, index) {
	// 						var fieldValue = item[field];

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("&") !== -1) {
	// 							fieldValue = fieldValue.replace(/&/g, "&amp;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("<") !== -1) {
	// 							fieldValue = fieldValue.replace(/</g, "&lt;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf(">") !== -1) {
	// 							fieldValue = fieldValue.replace(/>/g, "&gt;");
	// 						}

	// 						sharedStrings.append('<si>');
	// 						sharedStrings.append('<t>' + fieldValue + '</t>');
	// 						sharedStrings.append('</si>');
	// 						sharedStringsCount++;

	// 						sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 						sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 						sheet.append('</c>');

	// 						sharedCurrentIndex++;
	// 					});
	// 					sheet.append('</row>');

	// 					currentRow++;
	// 				});
	// 			}

	// 			sheet.append(emptyLine.replace('<row ', '<row r="' + (currentRow + 1) + '" '));

	// 			rowCountAfterTable = currentRow + 1;
	// 			currentRow = currentRow + 1;
	// 		}
	// 	}
	// 	if (itemsArray2 && itemsArray2.length) {

	// 		sheet.append('<row r="'
	// 			+ rowCountAfterTable + '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B'
	// 			+ rowCountAfterTable + '" s="5" t="s"><v>3</v></c></row>');

	// 		if (itemsColumnDefenition2 && itemsColumnDefenition2.friendlyNames && itemsColumnDefenition2.friendlyNames.length) {
	// 			itemsColumnDefenition2.friendlyNames.forEach(function (item, index) {
	// 				sharedStrings.append('<si>');
	// 				sharedStrings.append('<t>' + item + '</t>');
	// 				sharedStrings.append('</si>');
	// 				sharedStringsCount++;
	// 			});
	// 			currentRow++;
	// 			sheet.append('<row r="' + currentRow + '">');

	// 			itemsColumnDefenition2.friendlyNames.forEach(function (item, index) {
	// 				sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 				sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 				sheet.append('</c>');

	// 				sharedCurrentIndex++;
	// 			});
	// 			sheet.append('</row>');

	// 			currentRow++;

	// 			sharedCurrentIndex = sharedStringsCount;

	// 			if (itemsColumnDefenition2.fields && itemsColumnDefenition2.fields.length) {

	// 				itemsArray2.forEach(function (item, index) {
	// 					sheet.append('<row r="' + currentRow + '" spans="1:8" x14ac:dyDescent="0.25">');
	// 					itemsColumnDefenition2.fields.forEach(function (field, index) {
	// 						var fieldValue = item[field] != "True" ? item[field] : "";

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("&") !== -1) {
	// 							fieldValue = fieldValue.replace(/&/g, "&amp;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("<") !== -1) {
	// 							fieldValue = fieldValue.replace(/</g, "&lt;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf(">") !== -1) {
	// 							fieldValue = fieldValue.replace(/>/g, "&gt;");
	// 						}

	// 						sharedStrings.append('<si>');
	// 						sharedStrings.append('<t>' + fieldValue + '</t>');
	// 						sharedStrings.append('</si>');
	// 						sharedStringsCount++;

	// 						sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 						sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 						sheet.append('</c>');

	// 						sharedCurrentIndex++;
	// 					});
	// 					sheet.append('</row>');

	// 					currentRow++;
	// 				});
	// 			}

	// 			sheet.append(emptyLine.replace('<row ', '<row r="' + (currentRow + 1) + '" '));

	// 			rowCountAfterTable = currentRow + 1;
	// 			currentRow = currentRow + 1;
	// 		}
	// 	}
	// 	if (attachments && attachments.length) {

	// 		sheet.append('<row r="' + rowCountAfterTable
	// 			+ '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B'
	// 			+ rowCountAfterTable + '" s="5" t="s"><v>4</v></c></row>');
	// 		mergedCells.push(rowCountAfterTable);

	// 		rowCountAfterTable++;

	// 		var attachmentString = "";
	// 		attachments.forEach(function (item, index) {
	// 			if (index < (attachments.length - 1)) {
	// 				attachmentString += (item.fileName + ' - ');
	// 			} else {
	// 				attachmentString += item.fileName;
	// 			}
	// 		});

	// 		if (typeof attachmentString === 'string' && attachmentString.indexOf("&") !== -1) {
	// 			attachmentString = attachmentString.replace(/&/g, "&amp;");
	// 		}

	// 		if (typeof attachmentString === 'string' && attachmentString.indexOf("<") !== -1) {
	// 			attachmentString = attachmentString.replace(/</g, "&lt;");
	// 		}

	// 		if (typeof attachmentString === 'string' && attachmentString.indexOf(">") !== -1) {
	// 			attachmentString = attachmentString.replace(/>/g, "&gt;");
	// 		}

	// 		sharedStrings.append('<si>');
	// 		sharedStrings.append('<t>' + attachmentString + '</t>');
	// 		sharedStrings.append('</si>');
	// 		sharedStringsCount++;

	// 		sheet.append('<row r="' + rowCountAfterTable + '" spans="1:8" x14ac:dyDescent="0.25"><c r="B' + rowCountAfterTable + '" s="3" t="s"><v>' + (sharedStringsCount - 1) + '</v></c></row>');
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;

	// 		sheet.append(emptyLine.replace('<row ', '<row r="' + rowCountAfterTable + '" '));
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;
	// 	}

	// 	if (workFlows && workFlows.length) {

	// 		sheet.append('<row r="' + rowCountAfterTable
	// 			+ '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B' + rowCountAfterTable
	// 			+ '" s="5" t="s"><v>5</v></c></row>');
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;

	// 		sheet.append('<row r="' + rowCountAfterTable + '" spans="1:8" ht="106.5" customHeight="1" x14ac:dyDescent="0.25"></row>');
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;

	// 		sheet.append(emptyLine.replace('<row ', '<row r="' + rowCountAfterTable + '" '));
	// 		mergedCells.push(rowCountAfterTable);
	// 		rowCountAfterTable++;
	// 	}

	// 	sheet.append('</sheetData>');
	// 	sheet.append('<mergeCells count="' + (mergedCells.length + 1) + '">');

	// 	sheet.append('<mergeCell ref="B2:H2"/>');

	// 	mergedCells.forEach(function (item) {
	// 		sheet.append('<mergeCell  ref="B' + item + ':H' + item + '"/>');
	// 	});

	// 	sheet.append(
	// 		'</mergeCells><pageMargins left="0.25" right="0.25" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>'
	// 		+ ' <pageSetup paperSize="9" orientation="landscape" r:id="rId1"/>'
	// 		+ ((workFlows && workFlows.length) ? '<drawing r:id="rId2"/>' : '')
	// 		+ '<tableParts count="3">'
	// 		+ ((itemsArray && itemsArray.length) ? '<tablePart r:id="rId3"/>' : '')
	// 		+ ((itemsArray1 && itemsArray1.length) ? '<tablePart r:id="rId5"/>' : '')
	// 		+ ((itemsArray2 && itemsArray2.length) ? '<tablePart r:id="rId7"/>' : '')
	// 		+ '</tableParts>'
	// 		+ '</worksheet>'
	// 	);

	// 	sharedStrings.append('</sst>');

	// 	xlFolder.file("sharedStrings.xml", sharedStrings.toString());

	// 	if (workFlows && workFlows.length) {
	// 		var workbookDrawings = new StringBuilder();

	// 		workbookDrawings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 		workbookDrawings.append('<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">');

	// 		var fullTenSignaturePictures = [
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>1</xdr:col><xdr:colOff>57150</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>57151</xdr:rowOff></xdr:from><xdr:to><xdr:col>1</xdr:col><xdr:colOff>762000</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>781051</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="2" name="Picture 1"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="666750" y="3676651"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>1</xdr:col><xdr:colOff>847725</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>57151</xdr:rowOff></xdr:from><xdr:to><xdr:col>2</xdr:col><xdr:colOff>381000</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>781051</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="12" name="Picture 11"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="1457325" y="3676651"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>2</xdr:col><xdr:colOff>466725</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>57151</xdr:rowOff></xdr:from><xdr:to><xdr:col>3</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>781051</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="13" name="Picture 12"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="2247900" y="3676651"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>3</xdr:col><xdr:colOff>76200</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>3</xdr:col><xdr:colOff>781050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="14" name="Picture 13"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="3028950" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>3</xdr:col><xdr:colOff>866775</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>4</xdr:col><xdr:colOff>400050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="15" name="Picture 14"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="3819525" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>4</xdr:col><xdr:colOff>476250</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>5</xdr:col><xdr:colOff>9525</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="16" name="Picture 15"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="4600575" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>5</xdr:col><xdr:colOff>95250</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>5</xdr:col><xdr:colOff>800100</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="17" name="Picture 16"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="5391150" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>5</xdr:col><xdr:colOff>885825</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>66676</xdr:rowOff></xdr:from><xdr:to><xdr:col>6</xdr:col><xdr:colOff>419100</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>790576</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="18" name="Picture 17"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="6181725" y="3686176"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>6</xdr:col><xdr:colOff>495300</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>76201</xdr:rowOff></xdr:from><xdr:to><xdr:col>7</xdr:col><xdr:colOff>28575</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>800101</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="19" name="Picture 18"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="6962775" y="3695701"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:twoCellAnchor editAs="absolute"><xdr:from><xdr:col>7</xdr:col><xdr:colOff>114300</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>76201</xdr:rowOff></xdr:from><xdr:to><xdr:col>7</xdr:col><xdr:colOff>819150</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>800101</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="20" name="Picture 19"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:duotone><a:prstClr val="black"/><a:srgbClr val="D9C3A5"><a:tint val="50000"/><a:satMod val="180000"/></a:srgbClr></a:duotone><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="7753350" y="3695701"/><a:ext cx="704850" cy="723900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>').replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>')
	// 		];

	// 		var fullTenSignatureText = [
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>0</xdr:col><xdr:colOff>590550</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>800645</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="21" name="TextBox 20"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="590550" y="4420145"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>1</xdr:col><xdr:colOff>752475</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>810170</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="24" name="TextBox 23"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="1362075" y="4429670"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>2</xdr:col><xdr:colOff>381000</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>819695</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="25" name="TextBox 24"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="2162175" y="4439195"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>2</xdr:col><xdr:colOff>1162050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>819695</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="26" name="TextBox 25"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="2943225" y="4439195"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>3</xdr:col><xdr:colOff>781050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>829220</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="27" name="TextBox 26"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="3733800" y="4448720"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>4</xdr:col><xdr:colOff>390525</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>838745</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="28" name="TextBox 27"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="4514850" y="4458245"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>4</xdr:col><xdr:colOff>1162050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>848270</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="29" name="TextBox 28"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="5286375" y="4467770"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>5</xdr:col><xdr:colOff>790575</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>857795</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="30" name="TextBox 29"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="6086475" y="4477295"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>6</xdr:col><xdr:colOff>400050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>857795</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="31" name="TextBox 30"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="6867525" y="4477295"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>'),
	// 			'<xdr:oneCellAnchor><xdr:from><xdr:col>7</xdr:col><xdr:colOff>19050</xdr:colOff><xdr:row>18</xdr:row><xdr:rowOff>867320</xdr:rowOff></xdr:from><xdr:ext cx="885825" cy="417422"/><xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="32" name="TextBox 31"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="7658100" y="4486820"/><a:ext cx="885825" cy="417422"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr><xdr:style><a:lnRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:lnRef><a:fillRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:fillRef><a:effectRef idx="0"><a:scrgbClr r="0" g="0" b="0"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" rtlCol="0" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>contactName</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>status</a:t></a:r></a:p><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="700" b="1" i="0" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:rPr><a:t>date</a:t></a:r><a:endParaRPr lang="en-US" sz="700" b="1" i="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="95000"/><a:lumOff val="5000"/></a:schemeClr></a:solidFill><a:latin typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:ea typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/><a:cs typeface="Tahoma" panose="020B0604030504040204" pitchFamily="34" charset="0"/></a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/></xdr:oneCellAnchor>'
	// 				.replace('<xdr:row>18</xdr:row>', '<xdr:row>' + (rowCountAfterTable - 3) + '</xdr:row>')
	// 		];

	// 		var xlDrawingsFolder = xlFolder.folder("drawings");

	// 		var xlRelsDrawingsFolder = xlDrawingsFolder.folder("_rels");

	// 		var workbookDrawingsRels = new StringBuilder();

	// 		workbookDrawingsRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 		workbookDrawingsRels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">');
	// 		workbookDrawingsRels.append('<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"'
	// 			+ 'Target="../media/signature.jpeg"/>');
	// 		workFlows[0].workflow.forEach(function (item, index) {
	// 			if (item.signature) {
	// 				workbookDrawingsRels.append('<Relationship Id="rId' + (index + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/' + item.signature + '"/>');
	// 				workbookDrawings.append(fullTenSignaturePictures[index].replace('r:embed="rId1"', 'r:embed="rId' + (index + 2) + '"'));
	// 			} else {
	// 				workbookDrawings.append(fullTenSignaturePictures[index]);
	// 			}
	// 		});
	// 		workbookDrawingsRels.append('</Relationships>');

	// 		xlRelsDrawingsFolder.file("drawing1.xml.rels", workbookDrawingsRels.toString());

	// 		workFlows[0].workflow.forEach(function (item, index) {
	// 			workbookDrawings.append(fullTenSignatureText[index].replace('status', item.status).replace('date', item.approvalDate).replace('contactName', item.contactName));
	// 		});

	// 		workbookDrawings.append('</xdr:wsDr>');

	// 		xlDrawingsFolder.file("drawing1.xml", workbookDrawings.toString());
	// 	}

	// 	var xlThemeFolder = xlFolder.folder("theme");

	// 	var xlRelsThemeFolder = xlThemeFolder.folder("_rels");

	// 	var workbookThemeRels = new StringBuilder();

	// 	workbookThemeRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookThemeRels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
	// 	);

	// 	xlRelsThemeFolder.file("theme1.xml.rels", workbookThemeRels.toString());

	// 	var workbookTheme = new StringBuilder();

	// 	workbookTheme.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookTheme.append(
	// 		'<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements>'
	// 		+ '<a:clrScheme name="Violet"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1>'
	// 		+ '<a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="373545"/></a:dk2><a:lt2>'
	// 		+ '<a:srgbClr val="DCD8DC"/></a:lt2><a:accent1><a:srgbClr val="AD84C6"/></a:accent1><a:accent2>'
	// 		+ '<a:srgbClr val="8784C7"/></a:accent2><a:accent3><a:srgbClr val="5D739A"/></a:accent3>'
	// 		+ '<a:accent4><a:srgbClr val="6997AF"/></a:accent4><a:accent5><a:srgbClr val="84ACB6"/></a:accent5>'
	// 		+ '<a:accent6><a:srgbClr val="6F8183"/></a:accent6><a:hlink><a:srgbClr val="69A020"/></a:hlink>'
	// 		+ '<a:folHlink><a:srgbClr val="8C8C8C"/></a:folHlink></a:clrScheme><a:fontScheme name="Office">'
	// 		+ '<a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/>'
	// 		+ '<a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/>'
	// 		+ '<a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线 Light"/>'
	// 		+ '<a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/>'
	// 		+ '<a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/>'
	// 		+ '<a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/>'
	// 		+ '<a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/>'
	// 		+ '<a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/>'
	// 		+ '<a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/>'
	// 		+ '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/>'
	// 		+ '<a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/>'
	// 		+ '<a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/>'
	// 		+ '<a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/>'
	// 		+ '<a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/>'
	// 		+ '<a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont>'
	// 		+ '<a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/>'
	// 		+ '<a:font script="Jpan" typeface="游ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/>'
	// 		+ '<a:font script="Hans" typeface="等线"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/>'
	// 		+ '<a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/>'
	// 		+ '<a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/>'
	// 		+ '<a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/>'
	// 		+ '<a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/>'
	// 		+ '<a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/>'
	// 		+ '<a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/>'
	// 		+ '<a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>'
	// 	);

	// 	xlThemeFolder.file("theme1.xml", workbookTheme.toString());

	// 	var xlTablesFolder = xlFolder.folder("tables");

	// 	var startTables = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

	// 	if (itemsArray && itemsArray.length) {

	// 		var workbookTables = new StringBuilder();

	// 		var lastLetter = availableColumns[itemsColumnDefenition.friendlyNames.length];

	// 		workbookTables.append('<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="Table1" displayName="Table1" ref="B' + (mergedCells[1] + 1) + ':' + (lastLetter + (mergedCells[1] + 1 + itemsArray.length)) +
	// 			'" totalsRowShown="0">');
	// 		workbookTables.append('<autoFilter ref="B' + (mergedCells[1] + 1) + ':' + (lastLetter + (mergedCells[1] + 1 + itemsArray.length)) + '"/>');
	// 		workbookTables.append('<tableColumns count="' + itemsColumnDefenition.friendlyNames.length + '">');
	// 		for (var j = 0; j < itemsColumnDefenition.friendlyNames.length; j++) {
	// 			workbookTables.append('<tableColumn id="' + (j + 1) + '" name="' + itemsColumnDefenition.friendlyNames[j] + '"/>');
	// 		}

	// 		workbookTables.append('</tableColumns><tableStyleInfo name="TableStyleMedium4" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>');

	// 		xlTablesFolder.file("table1.xml", startTables.toString() + workbookTables.toString());
	// 	}
	// 	if (itemsArray1 && itemsArray1.length) {

	// 		var workbookTables2 = new StringBuilder();

	// 		var lastMerge = mergedCells.length - 1;

	// 		var lastLetter = availableColumns[itemsColumnDefenition1.friendlyNames.length];
	// 		workbookTables2.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 		workbookTables2.append('<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="2" headerRowDxfId="0" headerRowBorderDxfId="1" tableBorderDxfId="2" dataDxfId="0" name="Table2" displayName="Table2" ref="B' + (rowsTillTable2 + 4)
	// 			+ ':' + (lastLetter + (rowsTillTable2 + 4 + itemsArray1.length)) + '" totalsRowShown="0">');
	// 		workbookTables2.append('<autoFilter ref="B' + (rowsTillTable2 + 4) + ':' + (lastLetter + (rowsTillTable2 + 4 + itemsArray1.length)) + '"/>');
	// 		workbookTables2.append('<tableColumns count="' + itemsColumnDefenition1.friendlyNames.length + '">');
	// 		for (var j = 0; j < itemsColumnDefenition1.friendlyNames.length; j++) {
	// 			workbookTables2.append('<tableColumn  dataDxfId="' + (itemsColumnDefenition1.friendlyNames.length - j) + '" id="' + (j + 1) + '" name="' + itemsColumnDefenition1.friendlyNames[j] + '"/>');
	// 		}

	// 		workbookTables2.append('</tableColumns><tableStyleInfo name="TableStyleMedium4" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>');

	// 		xlTablesFolder.file("table2.xml", workbookTables2.toString());
	// 	}
	// 	if (itemsArray2 && itemsArray2.length) {
	// 		if (itemsArray && itemsArray.length) {

	// 			var workbookTables3 = new StringBuilder();

	// 			var lastMerge = mergedCells.length - 1;

	// 			var lastLetter = availableColumns[itemsColumnDefenition2.friendlyNames.length];
	// 			workbookTables3.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 			workbookTables3.append('<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="3" headerRowDxfId="0" headerRowBorderDxfId="1" tableBorderDxfId="2" dataDxfId="0" name="Table3" displayName="Table3" ref="B' + (rowsTillTable3 + 5)
	// 				+ ':' + (lastLetter + (rowsTillTable3 + 5 + itemsArray2.length)) + '" totalsRowShown="0">');
	// 			workbookTables3.append('<autoFilter ref="B' + (rowsTillTable3 + 5) + ':' + (lastLetter + (rowsTillTable3 + 5 + itemsArray2.length)) + '"/>');
	// 			workbookTables3.append('<tableColumns count="' + itemsColumnDefenition2.friendlyNames.length + '">');
	// 			for (var j = 0; j < itemsColumnDefenition2.friendlyNames.length; j++) {
	// 				workbookTables3.append('<tableColumn  dataDxfId="' + (itemsColumnDefenition2.friendlyNames.length - j) + '" id="' + (j + 1) + '" name="' + itemsColumnDefenition2.friendlyNames[j] + '"/>');
	// 			}

	// 			workbookTables3.append('</tableColumns><tableStyleInfo name="TableStyleMedium4" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>');

	// 			xlTablesFolder.file("table3.xml", workbookTables3.toString());
	// 		}

	// 		else {
	// 			var workbookTables3 = new StringBuilder();

	// 			var lastMerge = mergedCells.length - 1;

	// 			var lastLetter = availableColumns[itemsColumnDefenition2.friendlyNames.length];
	// 			workbookTables3.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 			workbookTables3.append('<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="3" headerRowDxfId="0" headerRowBorderDxfId="1" tableBorderDxfId="2" dataDxfId="0" name="Table3" displayName="Table3" ref="B' + (rowsTillTable3 + 3)
	// 				+ ':' + (lastLetter + (rowsTillTable3 + 3 + itemsArray2.length)) + '" totalsRowShown="0">');
	// 			workbookTables3.append('<autoFilter ref="B' + (rowsTillTable3 + 3) + ':' + (lastLetter + (rowsTillTable3 + 3 + itemsArray2.length)) + '"/>');
	// 			workbookTables3.append('<tableColumns count="' + itemsColumnDefenition2.friendlyNames.length + '">');
	// 			for (var j = 0; j < itemsColumnDefenition2.friendlyNames.length; j++) {
	// 				workbookTables3.append('<tableColumn  dataDxfId="' + (itemsColumnDefenition2.friendlyNames.length - j) + '" id="' + (j + 1) + '" name="' + itemsColumnDefenition2.friendlyNames[j] + '"/>');
	// 			}

	// 			workbookTables3.append('</tableColumns><tableStyleInfo name="TableStyleMedium4" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>');

	// 			xlTablesFolder.file("table3.xml", workbookTables3.toString());
	// 		}
	// 	}

	// 	xlWorksheetsFolder.file('sheet1.xml', sheet.toString());

	// 	var printerSettings = xlFolder.folder("printerSettings");

	// 	$.ajax({
	// 		url: "/public/printerSettings/printerSettings1.bin",
	// 		type: "GET",
	// 		mimeType: "text/plain; charset=x-user-defined"
	// 	}).then(function (data) {
	// 		printerSettings.file("printerSettings1.bin", base64Encode(data), {
	// 			base64: true
	// 		});

	// 		var xlMediaFolder = xlFolder.folder("media");

	// 		var arrayOfPictures = ['/public/img/white.jpeg'];

	// 		if (workFlows && workFlows.length) {
	// 			workFlows[0].workflow.forEach(function (item, index) {
	// 				if (item.statusVal) {
	// 					if (item.signature) {
	// 						// arrayOfPictures.push(item.signature);
	// 						arrayOfPictures.push('/public/img/signature.png');
	// 					}
	// 				}
	// 				else {
	// 					arrayOfPictures.push('/public/img/white.jpeg');
	// 				}
	// 			});
	// 		}

	// 		var arrayOfPromisesToPictures = arrayOfPictures.map(getPicture);

	// 		var promiseToArrayOfPictures = all(arrayOfPromisesToPictures);

	// 		promiseToArrayOfPictures.then(function (pictures) {
	// 			xlMediaFolder.file("signature.jpeg", base64Encode(pictures[0][0]), {
	// 				base64: true
	// 			});

	// 			if (arrayOfPictures.length > 1) {
	// 				pictures.forEach(function (picture, index) {
	// 					if (index > 0) {
	// 						xlMediaFolder.file("sig" + (index - 1) + ".jpeg", base64Encode(picture[0]), {
	// 							base64: true
	// 						});
	// 					}
	// 				});
	// 			}

	// 			var excelFile = zip.generate({
	// 				type: "blob"
	// 			});

	// 			saveAs(excelFile, (fileName || 'Procoor Generated Excel File') + '.xlsx');
	// 		}).fail(function (err) {
	// 			console.log(err);
	// 		});
	// 	});


	// };

	// static 	excelExportingServiceHeader = function (fileName, itemsArray, itemsColumnDefenition) {
	// 	var zip = new JSZip();

	// 	fileName = fileName ? fileName.replace('.pdf', '') : ' Excel File';

	// 	var contentType = new StringBuilder();

	// 	contentType.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	contentType.append(
	// 		'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="bin" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>' + ((workFlows && workFlows.length) ? '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>' : '') + ((itemsArray && itemsArray.length) ? '<Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>' : '') + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>'
	// 	);

	// 	zip.file("[Content_Types].xml", contentType.toString());

	// 	var rels = new StringBuilder();

	// 	rels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	rels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'
	// 	);

	// 	var relsFolder = zip.folder("_rels");

	// 	relsFolder.file(".rels", rels.toString());

	// 	var appProp = new StringBuilder();

	// 	appProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	appProp.append(
	// 		'<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Sheet1</vt:lpstr></vt:vector></TitlesOfParts><Company></Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>'
	// 	);

	// 	var coreProp = new StringBuilder();

	// 	coreProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	coreProp.append(
	// 		'<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Ibrahim Amin</dc:creator><cp:lastModifiedBy>Ibrahim Amin</cp:lastModifiedBy><cp:lastPrinted>2016-03-29T15:52:14Z</cp:lastPrinted><dcterms:created xsi:type="dcterms:W3CDTF">2016-03-29T14:59:53Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2016-03-29T15:52:25Z</dcterms:modified></cp:coreProperties>'
	// 	);

	// 	var customProp = new StringBuilder();

	// 	customProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	customProp.append(
	// 		'<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="4" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant><vt:variant><vt:lpstr>Named Ranges</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="2" baseType="lpstr"><vt:lpstr>Procoor Exporting System</vt:lpstr></vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>'
	// 	);

	// 	var docPropsFolder = zip.folder("docProps");

	// 	docPropsFolder.file("app.xml", appProp.toString());
	// 	docPropsFolder.file("core.xml", coreProp.toString());
	// 	docPropsFolder.file("custom.xml", customProp.toString());

	// 	var emptyLine = '<row spans="1:8" x14ac:dyDescent="0.25"></row>';

	// 	var xlFolder = zip.folder("xl");

	// 	var xlRelsFolder = xlFolder.folder("_rels");

	// 	var workbookRels = new StringBuilder();

	// 	workbookRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookRels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>'
	// 	);

	// 	xlRelsFolder.file("workbook.xml.rels", workbookRels.toString());

	// 	var availableColumns = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(' ');

	// 	var sharedStrings = new StringBuilder();

	// 	var sharedStringsCount = 2;

	// 	sharedStrings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	sharedStrings.append('<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>' + fileName + '</t>');
	// 	sharedStrings.append('</si>');

	// 	sharedStrings.append('<si>');
	// 	sharedStrings.append('<t>Items</t>');
	// 	sharedStrings.append('</si>');

	// 	var styles = new StringBuilder();

	// 	styles.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	styles.append(
	// 		'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main"><fonts count="4" x14ac:knownFonts="1"><font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><b/><sz val="14"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><b/><sz val="10.5"/><color theme="1"/><name val="Calibri Light"/><family val="2"/><scheme val="major"/></font><font><b/><sz val="12"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts><fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor theme="8" tint="0.39997558519241921"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor theme="9" tint="0.79998168889431442"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="10"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="3" borderId="0" xfId="0" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center" indent="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyBorder="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/><extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext><ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>'
	// 	);

	// 	xlFolder.file("styles.xml", styles.toString());

	// 	var workbook = new StringBuilder();

	// 	workbook.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbook.append(
	// 		'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><fileVersion appName="xl" lastEdited="6" lowestEdited="6" rupBuild="14420"/><workbookPr/><mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice Requires="x15"><x15ac:absPath url="C:\Users\ibrahim.EGEC-PM\Desktop\" xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"/></mc:Choice></mc:AlternateContent><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="20490" windowHeight="7665"/></bookViews><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="162913"/><extLst><ext uri="{140A7094-0E35-4892-8432-C4D2E57EDEB5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:workbookPr chartTrackingRefBase="1"/></ext></extLst></workbook>'
	// 	);

	// 	xlFolder.file("workbook.xml", workbook.toString());

	// 	var xlWorksheetsFolder = xlFolder.folder("worksheets");

	// 	var xlRelsWorksheetsFolder = xlWorksheetsFolder.folder("_rels");

	// 	var workbookWorkSheetsRels = new StringBuilder();

	// 	workbookWorkSheetsRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookWorkSheetsRels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + ((itemsArray && itemsArray.length) ? '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table1.xml"/>' : '') + ((workFlows && workFlows.length) ? '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>' : '') + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/printerSettings" Target="../printerSettings/printerSettings1.bin"/></Relationships>'
	// 	);

	// 	xlRelsWorksheetsFolder.file("sheet1.xml.rels", workbookWorkSheetsRels.toString());

	// 	var sheet = new StringBuilder();

	// 	sheet.append(
	// 		'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView showGridLines="0" tabSelected="1" workbookViewId="0"><selection activeCell="I20" sqref="I20"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/><cols><col min="2" max="8" width="17.5703125" bestFit="1" customWidth="1"/></cols><sheetData><row r="2" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B2" s="4" t="s"><v>0</v></c><c r="C2" s="4"/><c r="D2" s="4"/><c r="E2" s="4"/><c r="F2" s="4"/><c r="G2" s="4"/><c r="H2" s="4"/></row><row r="3" spans="1:8" x14ac:dyDescent="0.25"></row>'
	// 	);

	// 	var rows = 0;

	// 	var index = 0;

	// 	var mergedCells = [];

	// 	sheet.append(emptyLine.replace('<row ', '<row r="' + (rows + 4) + '" '));

	// 	mergedCells.push((rows + 4));

	// 	var rowCountAfterTable = rows + 5;

	// 	if (itemsArray && itemsArray.length) {
	// 		sheet.append('<row r="' + rowCountAfterTable + '" spans="1:8" ht="30" customHeight="1" x14ac:dyDescent="0.25"><c r="B' + rowCountAfterTable + '" s="5" t="s"><v>1</v></c></row>');
	// 		mergedCells.push(rowCountAfterTable);

	// 		var currentRow = rows + 6;

	// 		var sharedCurrentIndex = sharedStringsCount;

	// 		if (itemsColumnDefenition && itemsColumnDefenition.friendlyNames && itemsColumnDefenition.friendlyNames.length) {
	// 			itemsColumnDefenition.friendlyNames.forEach(function (item, index) {
	// 				sharedStrings.append('<si>');
	// 				sharedStrings.append('<t>' + item + '</t>');
	// 				sharedStrings.append('</si>');
	// 				sharedStringsCount++;
	// 			});

	// 			sheet.append('<row r="' + currentRow + '">');
	// 			itemsColumnDefenition.friendlyNames.forEach(function (item, index) {
	// 				sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 				sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 				sheet.append('</c>');

	// 				sharedCurrentIndex++;
	// 			});
	// 			sheet.append('</row>');

	// 			currentRow++;

	// 			sharedCurrentIndex = sharedStringsCount;

	// 			if (itemsColumnDefenition.fields && itemsColumnDefenition.fields.length) {
	// 				itemsArray.forEach(function (item, index) {
	// 					sheet.append('<row r="' + currentRow + '" spans="1:8" x14ac:dyDescent="0.25">');
	// 					itemsColumnDefenition.fields.forEach(function (field, index) {
	// 						var fieldValue = item[field];

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("&") !== -1) {
	// 							fieldValue = fieldValue.replace(/&/g, "&amp;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf("<") !== -1) {
	// 							fieldValue = fieldValue.replace(/</g, "&lt;");
	// 						}

	// 						if (typeof fieldValue === 'string' && fieldValue.indexOf(">") !== -1) {
	// 							fieldValue = fieldValue.replace(/>/g, "&gt;");
	// 						}

	// 						sharedStrings.append('<si>');
	// 						sharedStrings.append('<t>' + fieldValue + '</t>');
	// 						sharedStrings.append('</si>');
	// 						sharedStringsCount++;

	// 						sheet.append('<c r="' + availableColumns[index + 1] + currentRow + '" t="s">');
	// 						sheet.append('<v>' + sharedCurrentIndex + '</v>');
	// 						sheet.append('</c>');

	// 						sharedCurrentIndex++;
	// 					});
	// 					sheet.append('</row>');

	// 					currentRow++;
	// 				});
	// 			}

	// 			sheet.append(emptyLine.replace('<row ', '<row r="' + currentRow + '" '));

	// 			mergedCells.push(currentRow);

	// 			rowCountAfterTable = currentRow + 1;
	// 		}
	// 	}

	// 	sheet.append('</sheetData>');
	// 	sheet.append('<mergeCells>');

	// 	sheet.append('<mergeCell ref="B2:H2"/>');

	// 	mergedCells.forEach(function (item) {
	// 		sheet.append('<mergeCell ref="B' + item + ':H' + item + '"/>');
	// 	});

	// 	sheet.append(
	// 		'</mergeCells><pageMargins left="0.25" right="0.25" top="0.75" bottom="0.75" header="0.3" footer="0.3"/><pageSetup paperSize="9" orientation="landscape" r:id="rId1"/>' + ((workFlows && workFlows.length) ? '<drawing r:id="rId2"/>' : '') + ((itemsArray && itemsArray.length) ? '<tableParts count="1"><tablePart r:id="rId3"/></tableParts>' : '') + '</worksheet>'
	// 	);

	// 	sharedStrings.append('</sst>');

	// 	xlFolder.file("sharedStrings.xml", sharedStrings.toString());

	// 	var xlThemeFolder = xlFolder.folder("theme");

	// 	var xlRelsThemeFolder = xlThemeFolder.folder("_rels");

	// 	var workbookThemeRels = new StringBuilder();

	// 	workbookThemeRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookThemeRels.append(
	// 		'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'
	// 	);

	// 	xlRelsThemeFolder.file("theme1.xml.rels", workbookThemeRels.toString());

	// 	var workbookTheme = new StringBuilder();

	// 	workbookTheme.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookTheme.append(
	// 		'<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Violet"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="373545"/></a:dk2><a:lt2><a:srgbClr val="DCD8DC"/></a:lt2><a:accent1><a:srgbClr val="AD84C6"/></a:accent1><a:accent2><a:srgbClr val="8784C7"/></a:accent2><a:accent3><a:srgbClr val="5D739A"/></a:accent3><a:accent4><a:srgbClr val="6997AF"/></a:accent4><a:accent5><a:srgbClr val="84ACB6"/></a:accent5><a:accent6><a:srgbClr val="6F8183"/></a:accent6><a:hlink><a:srgbClr val="69A020"/></a:hlink><a:folHlink><a:srgbClr val="8C8C8C"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线 Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>'
	// 	);

	// 	xlThemeFolder.file("theme1.xml", workbookTheme.toString());

	// 	if (itemsArray && itemsArray.length) {
	// 		var xlTablesFolder = xlFolder.folder("tables");

	// 		var workbookTables = new StringBuilder();

	// 		var lastLetter = availableColumns[itemsColumnDefenition.friendlyNames.length];

	// 		workbookTables.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 		workbookTables.append('<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="Table1" displayName="Table1" ref="B' + (mergedCells[1] + 1) + ':' + (lastLetter + (mergedCells[1] + 1 + itemsArray.length)) +
	// 			'" totalsRowShown="0">');

	// 		workbookTables.append('<autoFilter ref="B' + (mergedCells[1] + 1) + ':' + (lastLetter + (mergedCells[1] + 1 + itemsArray.length)) + '"/>');

	// 		workbookTables.append('<tableColumns count="' + itemsColumnDefenition.friendlyNames.length + '">');

	// 		for (var j = 0; j < itemsColumnDefenition.friendlyNames.length; j++) {
	// 			workbookTables.append('<tableColumn id="' + (j + 1) + '" name="' + itemsColumnDefenition.friendlyNames[j] + '"/>');
	// 		}

	// 		workbookTables.append('</tableColumns><tableStyleInfo name="TableStyleMedium14" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>');

	// 		xlTablesFolder.file("table1.xml", workbookTables.toString());
	// 	}

	// 	xlWorksheetsFolder.file('sheet1.xml', sheet.toString());

	// 	var printerSettings = xlFolder.folder("printerSettings");

	// 	$.ajax({
	// 		url: "/public/printerSettings/printerSettings1.bin",
	// 		type: "GET",
	// 		mimeType: "text/plain; charset=x-user-defined"
	// 	}).then(function (data) {
	// 		printerSettings.file("printerSettings1.bin", base64Encode(data), {
	// 			base64: true
	// 		});

	// 	});
	// };

	// static 	excelExportingServiceCustom = function (data, columns, fileName, totals) {
	// 	var zip = new JSZip();

	// 	var contentType = new StringBuilder();

	// 	contentType.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	contentType.append('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Default Extension="xml" ContentType="application/xml" /><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" /><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml" /><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml" /></Types>');

	// 	zip.file("[Content_Types].xml", contentType.toString());

	// 	var rels = new StringBuilder();

	// 	rels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	rels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');

	// 	var relsFolder = zip.folder("_rels");

	// 	relsFolder.file(".rels", rels.toString());

	// 	var appProp = new StringBuilder();

	// 	appProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	appProp.append('<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Sheet1</vt:lpstr></vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>14.0300</AppVersion></Properties>');

	// 	var coreProp = new StringBuilder();

	// 	coreProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	coreProp.append('<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Kendo UI</dc:creator><cp:lastModifiedBy>Kendo UI</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2015-03-16T08:02:14.459Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2015-03-16T08:02:14.459Z</dcterms:modified></cp:coreProperties>');

	// 	var docPropsFolder = zip.folder("docProps");

	// 	docPropsFolder.file("app.xml", appProp.toString());
	// 	docPropsFolder.file("core.xml", coreProp.toString());

	// 	var xlFolder = zip.folder("xl");

	// 	var xlRelsFolder = xlFolder.folder("_rels");

	// 	var workbookRels = new StringBuilder();

	// 	workbookRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookRels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml" /><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml" /><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml" /></Relationships>');

	// 	xlRelsFolder.file("workbook.xml.rels", workbookRels.toString());

	// 	var xlWorksheetsFolder = xlFolder.folder("worksheets");

	// 	var availableColumns = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(' ');

	// 	var sharedStrings = new StringBuilder();

	// 	var sharedStringsCount = 0;

	// 	sharedStrings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	sharedStrings.append('<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">');

	// 	columns.forEach(function (item, index) {
	// 		sharedStrings.append('<si>');
	// 		sharedStrings.append('<t>' + item.title + '</t>');
	// 		sharedStrings.append('</si>');

	// 		sharedStringsCount++;
	// 	});

	// 	var styles = new StringBuilder();

	// 	styles.append('<?xml version="1.0" encoding="UTF-8"?>');
	// 	styles.append('<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><numFmts count="0"></numFmts><fonts count="3" x14ac:knownFonts="1"><font><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font><font><color rgb="FFFFFFFF" /><sz val="11" /><name val="Calibri" /><scheme val="minor" /><family val="2" /></font><font><color rgb="FF333333" /><sz val="11" /><name val="Calibri" /><scheme val="minor" /><family val="2" /></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF7A7A7A"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDFDFDF"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf xfid="0" fontId="1" applyFont="1" fillId="2" applyFill="1"></xf><xf xfid="0" fontId="2" applyFont="1" fillId="3" applyFill="1"></xf></cellXfs><dxfs count="0" /><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleMedium9" /></styleSheet>');

	// 	xlFolder.file("styles.xml", styles.toString());

	// 	var workbook = new StringBuilder();

	// 	workbook.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbook.append('<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="9303" /><workbookPr defaultThemeVersion="124226" /><bookViews><workbookView xWindow="240" yWindow="45" windowWidth="18195" windowHeight="7995" /></bookViews><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1" /></sheets><calcPr calcId="145621" /></workbook>');

	// 	xlFolder.file("workbook.xml", workbook.toString());

	// 	var sheet = new StringBuilder();

	// 	sheet.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	sheet.append('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" mc:Ignorable="x14ac">');
	// 	sheet.append('<dimension ref="A1" />');
	// 	sheet.append('<sheetViews>');
	// 	sheet.append('<sheetView tabSelected="1" workbookViewId="0">');
	// 	sheet.append('<pane state="frozen" xSplit="1" ySplit="1" topLeftCell="B2"/>');
	// 	sheet.append('</sheetView>');
	// 	sheet.append('</sheetViews>');
	// 	sheet.append('<sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25" />');
	// 	sheet.append('<cols>');

	// 	columns.forEach(function (item, index) {
	// 		sheet.append('<col min="' + (index + 1) + '" max="' + (index + 1) + '" customWidth="1" width="42.86214285714286" />');
	// 	});

	// 	sheet.append('</cols>');
	// 	sheet.append('<sheetData>');

	// 	sheet.append('<row r="1">');
	// 	columns.forEach(function (item, index) {
	// 		sheet.append('<c r="' + availableColumns[index] + '1" s="1" t="s">');
	// 		sheet.append('<v>' + index + '</v>');
	// 		sheet.append('</c>');
	// 	});
	// 	sheet.append('</row>');

	// 	var enumerableData = Enumerable.From(data).ToArray();

	// 	var currentEmptyRow = 0;

	// 	enumerableData.forEach(function (row, rowIndex) {
	// 		sheet.append('<row r="' + (rowIndex + 2) + '">');
	// 		columns.forEach(function (column, columnIndex) {
	// 			var columnType = column.type;

	// 			if (typeof row[column.key] === 'undefined' || (row[column.key] === null)) {
	// 				row[column.key] = " ";
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("&") !== -1) {
	// 				row[column.key] = row[column.key].replace(/&/g, "&amp;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("<") !== -1) {
	// 				row[column.key].replace(/</g, "&lt;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf(">") !== -1) {
	// 				row[column.key].replace(/>/g, "&gt;");
	// 			}

	// 			if (column.type === 'd' && (typeof row[column.key] !== 'undefined') && (row[column.key] !== null) && (row[column.key] !== " ")) {
	// 				row[column.key] = moment(row[column.key]).format("DD/MM/YYYY");
	// 				columnType = 's';
	// 			} else if (column.type === 'd') {
	// 				columnType = 's';
	// 			}

	// 			if (column.type === 'n' && (typeof row[column.key] !== 'undefined') && (row[column.key] !== null) && (row[column.key] !== " ")) {
	// 				columnType = 'n';
	// 			} else if (column.type === 'd') {
	// 				columnType = 's';
	// 			}

	// 			if (columnType === 's') {
	// 				sharedStrings.append('<si>');
	// 				sharedStrings.append('<t>' + row[column.key] + '</t>');
	// 				sharedStrings.append('</si>');

	// 				row[column.key] = sharedStringsCount;

	// 				sharedStringsCount++;
	// 			}

	// 			sheet.append('<c r="' + availableColumns[columnIndex] + (rowIndex + 2) + '" t="' + columnType + '">');
	// 			sheet.append('<v>' + row[column.key] + '</v>');
	// 			sheet.append('</c>');
	// 		});
	// 		sheet.append('</row>');
	// 		currentEmptyRow = (rowIndex + 3);
	// 	});

	// 	if (totals && totals.length) {
	// 		sheet.append('<row r="' + currentEmptyRow + '">');
	// 		columns.forEach(function (column, columnIndex) {
	// 			var total = 0;

	// 			if (totals.indexOf(column.key) !== -1) {
	// 				enumerableData.forEach(function (row, rowIndex) {
	// 					total += (parseFloat(row[column.key]) || 0);
	// 				});
	// 			}

	// 			sheet.append('<c r="' + availableColumns[columnIndex] + currentEmptyRow + '" s="1">');
	// 			if (total) { sheet.append('<v>' + total.toFixed(2) + '</v>'); }
	// 			sheet.append('</c>');
	// 		});
	// 		sheet.append('</row>');
	// 	}

	// 	sharedStrings.append('</sst>');

	// 	xlFolder.file("sharedStrings.xml", sharedStrings.toString());

	// 	sheet.append('</sheetData>');
	// 	sheet.append('<autoFilter ref="A1:' + availableColumns[columns.length - 1] + '1"/>');
	// 	sheet.append('<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3" />');
	// 	sheet.append('</worksheet>');

	// 	xlWorksheetsFolder.file('sheet1.xml', sheet.toString());

	// 	var excelFile = zip.generate({ type: "blob" });

	// 	saveAs(excelFile, (fileName || 'ProcoorGeneratedExcelFile') + '.xlsx');
	// };

	// static 	getPicture = function (picUrl) {

	// 	console.log(picUrl);

	// 	return $.ajax({
	// 		url: picUrl,
	// 		type: "GET",
	// 		//contentType: "image/jpg",
	// 		mimeType: "text/plain; charset=x-user-defined"
	// 	});
	// };

	// static 	excelExportingService = function (data, columns, fileName, totals) {
	// 	var zip = new JSZip();

	// 	var contentType = new StringBuilder();

	// 	contentType.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	contentType.append('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Default Extension="xml" ContentType="application/xml" /><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" /><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml" /><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml" /></Types>');

	// 	zip.file("[Content_Types].xml", contentType.toString());

	// 	var rels = new StringBuilder();

	// 	rels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	rels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');

	// 	var relsFolder = zip.folder("_rels");

	// 	relsFolder.file(".rels", rels.toString());

	// 	var appProp = new StringBuilder();

	// 	appProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	appProp.append('<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Sheet1</vt:lpstr></vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>14.0300</AppVersion></Properties>');

	// 	var coreProp = new StringBuilder();

	// 	coreProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	coreProp.append('<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Kendo UI</dc:creator><cp:lastModifiedBy>Kendo UI</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2015-03-16T08:02:14.459Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2015-03-16T08:02:14.459Z</dcterms:modified></cp:coreProperties>');

	// 	var docPropsFolder = zip.folder("docProps");

	// 	docPropsFolder.file("app.xml", appProp.toString());
	// 	docPropsFolder.file("core.xml", coreProp.toString());

	// 	var xlFolder = zip.folder("xl");

	// 	var xlRelsFolder = xlFolder.folder("_rels");

	// 	var workbookRels = new StringBuilder();

	// 	workbookRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookRels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml" /><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml" /><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml" /></Relationships>');

	// 	xlRelsFolder.file("workbook.xml.rels", workbookRels.toString());

	// 	var xlWorksheetsFolder = xlFolder.folder("worksheets");

	// 	var availableColumns = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(' ');

	// 	var indexx = 0;

	// 	var indexxx = 0;

	// 	if (columns.length > 26) {

	// 		for (var i = 0; i < columns.length; i++) {

	// 			if (availableColumns[indexxx] === "Z") {

	// 				availableColumns.push(availableColumns[indexx] + availableColumns[indexxx]);
	// 				indexxx = 0;
	// 				indexx++
	// 			} else {

	// 				availableColumns.push(availableColumns[indexx] + availableColumns[indexxx]);
	// 				indexxx++;
	// 			}
	// 		}
	// 	}

	// 	var sharedStrings = new StringBuilder();

	// 	var sharedStringsCount = 0;

	// 	sharedStrings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	sharedStrings.append('<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">');

	// 	columns.forEach(function (item, index) {
	// 		sharedStrings.append('<si>');
	// 		sharedStrings.append('<t>' + item.title + '</t>');
	// 		sharedStrings.append('</si>');

	// 		sharedStringsCount++;
	// 	});

	// 	var styles = new StringBuilder();

	// 	styles.append('<?xml version="1.0" encoding="UTF-8"?>');
	// 	styles.append('<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><numFmts count="0"></numFmts><fonts count="3" x14ac:knownFonts="1"><font><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font><font><color rgb="FFFFFFFF" /><sz val="11" /><name val="Calibri" /><scheme val="minor" /><family val="2" /></font><font><color rgb="FF333333" /><sz val="11" /><name val="Calibri" /><scheme val="minor" /><family val="2" /></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF7A7A7A"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDFDFDF"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf xfid="0" fontId="1" applyFont="1" fillId="2" applyFill="1"></xf><xf xfid="0" fontId="2" applyFont="1" fillId="3" applyFill="1"></xf></cellXfs><dxfs count="0" /><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleMedium9" /></styleSheet>');

	// 	xlFolder.file("styles.xml", styles.toString());

	// 	var workbook = new StringBuilder();

	// 	workbook.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbook.append('<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="9303" /><workbookPr defaultThemeVersion="124226" /><bookViews><workbookView xWindow="240" yWindow="45" windowWidth="18195" windowHeight="7995" /></bookViews><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1" /></sheets><calcPr calcId="145621" /></workbook>');

	// 	xlFolder.file("workbook.xml", workbook.toString());

	// 	var sheet = new StringBuilder();

	// 	sheet.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	sheet.append('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" mc:Ignorable="x14ac">');
	// 	sheet.append('<dimension ref="A1" />');
	// 	sheet.append('<sheetViews>');
	// 	sheet.append('<sheetView tabSelected="1" workbookViewId="0">');
	// 	sheet.append('<pane state="frozen" xSplit="1" ySplit="1" topLeftCell="B2"/>');
	// 	sheet.append('</sheetView>');
	// 	sheet.append('</sheetViews>');
	// 	sheet.append('<sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25" />');
	// 	sheet.append('<cols>');

	// 	columns.forEach(function (item, index) {
	// 		sheet.append('<col min="' + (index + 1) + '" max="' + (index + 1) + '" customWidth="1" width="42.86214285714286" />');
	// 	});

	// 	sheet.append('</cols>');
	// 	sheet.append('<sheetData>');

	// 	sheet.append('<row r="1">');
	// 	columns.forEach(function (item, index) {
	// 		sheet.append('<c r="' + availableColumns[index] + '1" s="1" t="s">');
	// 		sheet.append('<v>' + index + '</v>');
	// 		sheet.append('</c>');
	// 	});
	// 	sheet.append('</row>');

	// 	var enumerableData = Enumerable.From(data).ToArray();

	// 	var currentEmptyRow = 0;

	// 	var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

	// 	enumerableData.forEach(function (row, rowIndex) {
	// 		sheet.append('<row r="' + (rowIndex + 2) + '">');
	// 		columns.forEach(function (column, columnIndex) {
	// 			var columnType = column.type;

	// 			if (typeof column.key === 'string' && column.key.indexOf("&") !== -1) {
	// 				column.key = column.key.replace(/&/g, "&amp;");
	// 			}

	// 			if (typeof row[column.key] === 'undefined' || (row[column.key] === null)) {
	// 				row[column.key] = " ";
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("&") !== -1) {
	// 				row[column.key] = row[column.key].replace(/&/g, "&amp;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("<") !== -1) {
	// 				row[column.key].replace(/</g, "&lt;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf(">") !== -1) {
	// 				row[column.key].replace(/>/g, "&gt;");
	// 			}

	// 			if (column.type === 'd' && (typeof row[column.key] !== 'undefined') && (row[column.key] !== null) && (row[column.key] !== " ")) {
	// 				row[column.key] = moment(row[column.key]).format("DD/MM/YYYY");
	// 				columnType = 's';
	// 			} else if (column.type === 'd') {
	// 				columnType = 's';
	// 			}

	// 			if (column.type === 'n' && (typeof row[column.key] !== 'undefined') && (row[column.key] !== null) && (row[column.key] !== " ")) {
	// 				row[column.key] = row[column.key].toFixed(2);
	// 				columnType = 'n';
	// 			} else if (column.type === 'd') {
	// 				columnType = 's';
	// 			}

	// 			if (columnType === 's') {
	// 				sharedStrings.append('<si>');
	// 				sharedStrings.append('<t>' + row[column.key] + '</t>');
	// 				sharedStrings.append('</si>');

	// 				row[column.key] = sharedStringsCount;

	// 				sharedStringsCount++;
	// 			}

	// 			sheet.append('<c r="' + availableColumns[columnIndex] + (rowIndex + 2) + '" t="' + columnType + '">');
	// 			sheet.append('<v>' + row[column.key] + '</v>');
	// 			sheet.append('</c>');
	// 		});
	// 		sheet.append('</row>');
	// 		currentEmptyRow = (rowIndex + 3);
	// 	});

	// 	if (totals && totals.length) {
	// 		sheet.append('<row r="' + currentEmptyRow + '">');
	// 		columns.forEach(function (column, columnIndex) {
	// 			var total = 0;

	// 			if (totals.indexOf(column.key) !== -1) {
	// 				enumerableData.forEach(function (row, rowIndex) {
	// 					total += (parseFloat(row[column.key]) || 0);
	// 				});
	// 			}

	// 			sheet.append('<c r="' + availableColumns[columnIndex] + currentEmptyRow + '" s="1">');
	// 			if (total) { sheet.append('<v>' + total.toFixed(2) + '</v>'); }
	// 			sheet.append('</c>');
	// 		});
	// 		sheet.append('</row>');
	// 	}

	// 	sharedStrings.append('</sst>');

	// 	xlFolder.file("sharedStrings.xml", sharedStrings.toString());

	// 	sheet.append('</sheetData>');
	// 	sheet.append('<autoFilter ref="A1:' + availableColumns[columns.length - 1] + '1"/>');
	// 	sheet.append('<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3" />');
	// 	sheet.append('</worksheet>');

	// 	xlWorksheetsFolder.file('sheet1.xml', sheet.toString());

	// 	var excelFile = zip.generate({ type: "blob" });

	// 	saveAs(excelFile, (fileName || 'ProcoorGeneratedExcelFile') + '.xlsx');
	// };

	// static 	excelExportingServicePaymentItems = function (data, columns, fileName, totals) {
	// 	var zip = new JSZip();

	// 	var contentType = new StringBuilder();

	// 	contentType.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	contentType.append('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Default Extension="xml" ContentType="application/xml" /><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" /><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml" /><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml" /></Types>');

	// 	zip.file("[Content_Types].xml", contentType.toString());

	// 	var rels = new StringBuilder();

	// 	rels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	rels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');

	// 	var relsFolder = zip.folder("_rels");

	// 	relsFolder.file(".rels", rels.toString());

	// 	var appProp = new StringBuilder();

	// 	appProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	appProp.append('<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Sheet1</vt:lpstr></vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>14.0300</AppVersion></Properties>');

	// 	var coreProp = new StringBuilder();

	// 	coreProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	coreProp.append('<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Kendo UI</dc:creator><cp:lastModifiedBy>Kendo UI</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2015-03-16T08:02:14.459Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2015-03-16T08:02:14.459Z</dcterms:modified></cp:coreProperties>');

	// 	var docPropsFolder = zip.folder("docProps");

	// 	docPropsFolder.file("app.xml", appProp.toString());
	// 	docPropsFolder.file("core.xml", coreProp.toString());

	// 	var xlFolder = zip.folder("xl");

	// 	var xlRelsFolder = xlFolder.folder("_rels");

	// 	var workbookRels = new StringBuilder();

	// 	workbookRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbookRels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml" /><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml" /><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml" /></Relationships>');

	// 	xlRelsFolder.file("workbook.xml.rels", workbookRels.toString());

	// 	var xlWorksheetsFolder = xlFolder.folder("worksheets");

	// 	var availableColumns = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(' ');

	// 	var indexx = 0;

	// 	var indexxx = 0;

	// 	if (columns.length > 26) {

	// 		for (var i = 0; i < columns.length; i++) {

	// 			if (availableColumns[indexxx] === "Z") {

	// 				availableColumns.push(availableColumns[indexx] + availableColumns[indexxx]);
	// 				indexxx = 0;
	// 				indexx++
	// 			} else {

	// 				availableColumns.push(availableColumns[indexx] + availableColumns[indexxx]);
	// 				indexxx++;
	// 			}
	// 		}
	// 	}

	// 	var sharedStrings = new StringBuilder();

	// 	var sharedStringsCount = 0;

	// 	sharedStrings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	sharedStrings.append('<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">');

	// 	columns.forEach(function (item, index) {
	// 		sharedStrings.append('<si>');
	// 		sharedStrings.append('<t>' + item.title + '</t>');
	// 		sharedStrings.append('</si>');

	// 		sharedStringsCount++;
	// 	});

	// 	var styles = new StringBuilder();

	// 	styles.append('<?xml version="1.0" encoding="UTF-8"?>');
	// 	styles.append('<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><numFmts count="0"></numFmts><fonts count="3" x14ac:knownFonts="1"><font><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font><font><color rgb="FFFFFFFF" /><sz val="11" /><name val="Calibri" /><scheme val="minor" /><family val="2" /></font><font><color rgb="FF333333" /><sz val="11" /><name val="Calibri" /><scheme val="minor" /><family val="2" /></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF7A7A7A"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDFDFDF"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf xfid="0" fontId="1" applyFont="1" fillId="2" applyFill="1"></xf><xf xfid="0" fontId="2" applyFont="1" fillId="3" applyFill="1"></xf></cellXfs><dxfs count="0" /><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleMedium9" /></styleSheet>');

	// 	xlFolder.file("styles.xml", styles.toString());

	// 	var workbook = new StringBuilder();

	// 	workbook.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	workbook.append('<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="9303" /><workbookPr defaultThemeVersion="124226" /><bookViews><workbookView xWindow="240" yWindow="45" windowWidth="18195" windowHeight="7995" /></bookViews><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1" /></sheets><calcPr calcId="145621" /></workbook>');

	// 	xlFolder.file("workbook.xml", workbook.toString());

	// 	var sheet = new StringBuilder();

	// 	sheet.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	sheet.append('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" mc:Ignorable="x14ac">');
	// 	sheet.append('<dimension ref="A1" />');
	// 	sheet.append('<sheetViews>');
	// 	sheet.append('<sheetView tabSelected="1" workbookViewId="0">');
	// 	sheet.append('<pane state="frozen" xSplit="1" ySplit="1" topLeftCell="B2"/>');
	// 	sheet.append('</sheetView>');
	// 	sheet.append('</sheetViews>');
	// 	sheet.append('<sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25" />');
	// 	sheet.append('<cols>');

	// 	columns.forEach(function (item, index) {
	// 		sheet.append('<col min="' + (index + 1) + '" max="' + (index + 1) + '" customWidth="1" width="42.86214285714286" />');
	// 	});

	// 	sheet.append('</cols>');
	// 	sheet.append('<sheetData>');

	// 	sheet.append('<row r="1">');
	// 	columns.forEach(function (item, index) {
	// 		sheet.append('<c r="' + availableColumns[index] + '1" s="1" t="s">');
	// 		sheet.append('<v>' + index + '</v>');
	// 		sheet.append('</c>');
	// 	});
	// 	sheet.append('</row>');

	// 	var enumerableData = Enumerable.From(data).ToArray();

	// 	var currentEmptyRow = 0;

	// 	var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

	// 	enumerableData.forEach(function (row, rowIndex) {
	// 		sheet.append('<row r="' + (rowIndex + 2) + '">');
	// 		columns.forEach(function (column, columnIndex) {
	// 			var columnType = column.type;

	// 			if (typeof row[column.key] === 'undefined' || (row[column.key] === null)) {
	// 				row[column.key] = " ";
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("&") !== -1) {
	// 				row[column.key] = row[column.key].replace(/&/g, "&amp;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("(") !== -1) {
	// 				row[column.key] = row[column.key].replace('(', "");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("^") !== -1) {
	// 				row[column.key] = row[column.key].replace('^', "");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf(")") !== -1) {
	// 				row[column.key] = row[column.key].replace(')', "");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("_") !== -1) {
	// 				row[column.key] = row[column.key].replace('_', "");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("#") !== -1) {
	// 				row[column.key] = row[column.key].replace(/#/g, "");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf(",") !== -1) {
	// 				row[column.key] = row[column.key].replace(/,/g, "%2C");
	// 			}


	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("°") !== -1) {
	// 				row[column.key] = row[column.key].replace(/°/g, "");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf(".") !== -1) {
	// 				row[column.key] = row[column.key].replace(/./g, " ");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("<") !== -1) {
	// 				row[column.key] = row[column.key].replace(/</g, "&lt;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf(">") !== -1) {
	// 				row[column.key] = row[column.key].replace(/>/g, "&gt;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf('"') !== -1) {
	// 				row[column.key] = row[column.key].replace(/"/g, "&quot;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("²") !== -1) {
	// 				row[column.key] = row[column.key].replace(/²/g, "");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("'") !== -1) {
	// 				row[column.key] = row[column.key].replace(/'/g, "&#39;");
	// 			}

	// 			if (column.type === 'd' && (typeof row[column.key] !== 'undefined') && (row[column.key] !== null) && (row[column.key] !== " ")) {
	// 				row[column.key] = moment(row[column.key]).format("DD/MM/YYYY");
	// 				columnType = 's';
	// 			} else if (column.type === 'd') {
	// 				columnType = 's';
	// 			}

	// 			if (column.type === 'n' && (typeof row[column.key] !== 'undefined') && (row[column.key] !== null) && (row[column.key] !== " ")) {
	// 				row[column.key] = row[column.key].toFixed(2);
	// 				columnType = 'n';
	// 			} else if (column.type === 'd') {
	// 				columnType = 's';
	// 			}

	// 			if (columnType === 's') {
	// 				sharedStrings.append('<si>');
	// 				sharedStrings.append('<t>' + row[column.key] + '</t>');
	// 				sharedStrings.append('</si>');

	// 				row[column.key] = sharedStringsCount;

	// 				sharedStringsCount++;
	// 			}

	// 			sheet.append('<c r="' + availableColumns[columnIndex] + (rowIndex + 2) + '" t="' + columnType + '">');
	// 			sheet.append('<v>' + row[column.key] + '</v>');
	// 			sheet.append('</c>');
	// 		});
	// 		sheet.append('</row>');
	// 		currentEmptyRow = (rowIndex + 3);
	// 	});

	// 	if (totals && totals.length) {
	// 		sheet.append('<row r="' + currentEmptyRow + '">');
	// 		columns.forEach(function (column, columnIndex) {
	// 			var total = 0;

	// 			if (totals.indexOf(column.key) !== -1) {
	// 				enumerableData.forEach(function (row, rowIndex) {
	// 					total += (parseFloat(row[column.key]) || 0);
	// 				});
	// 			}

	// 			sheet.append('<c r="' + availableColumns[columnIndex] + currentEmptyRow + '" s="1">');
	// 			if (total) { sheet.append('<v>' + total.toFixed(2) + '</v>'); }
	// 			sheet.append('</c>');
	// 		});
	// 		sheet.append('</row>');
	// 	}

	// 	sharedStrings.append('</sst>');

	// 	xlFolder.file("sharedStrings.xml", sharedStrings.toString());

	// 	sheet.append('</sheetData>');
	// 	sheet.append('<autoFilter ref="A1:' + availableColumns[columns.length - 1] + '1"/>');
	// 	sheet.append('<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3" />');
	// 	sheet.append('</worksheet>');

	// 	xlWorksheetsFolder.file('sheet1.xml', sheet.toString());

	// 	var excelFile = zip.generate({ type: "blob" });

	// 	saveAs(excelFile, (fileName || 'ProcoorGeneratedExcelFile') + '.xlsx');
	// };

	// static 	wordExportingService = function (data, columns, fileName) {
	// 	var zip = new JSZip();

	// 	var contentType = new StringBuilder();

	// 	contentType.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	contentType.append('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/webSettings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/><Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/><Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>');

	// 	zip.file("[Content_Types].xml", contentType.toString());

	// 	var rels = new StringBuilder();

	// 	rels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	rels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');

	// 	var relsFolder = zip.folder("_rels");

	// 	relsFolder.file(".rels", rels.toString());

	// 	var appProp = new StringBuilder();

	// 	appProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	appProp.append('<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Sheet1</vt:lpstr></vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>14.0300</AppVersion></Properties>');

	// 	var coreProp = new StringBuilder();

	// 	coreProp.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	coreProp.append('<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Kendo UI</dc:creator><cp:lastModifiedBy>Kendo UI</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2015-03-16T08:02:14.459Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2015-03-16T08:02:14.459Z</dcterms:modified></cp:coreProperties>');

	// 	var docPropsFolder = zip.folder("docProps");

	// 	docPropsFolder.file("app.xml", appProp.toString());
	// 	docPropsFolder.file("core.xml", coreProp.toString());

	// 	var wordFolder = zip.folder("word");

	// 	var wordRelsFolder = wordFolder.folder("_rels");

	// 	var documentRels = new StringBuilder();

	// 	documentRels.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	documentRels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings" Target="webSettings.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/></Relationships>');

	// 	wordRelsFolder.file("document.xml.rels", documentRels.toString());

	// 	var wordThemesFolder = wordFolder.folder("theme");

	// 	var wordTheme = new StringBuilder();

	// 	wordTheme.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	wordTheme.append('<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="5B9BD5"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="4472C4"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="ＭＳ ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="ＭＳ 明朝"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>');

	// 	wordThemesFolder.file("theme1.xml", wordTheme.toString());

	// 	var styles = new StringBuilder();

	// 	styles.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	styles.append('<w:styles xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" mc:Ignorable="w14 w15"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="0" w:defUnhideWhenUsed="0" w:defQFormat="0" w:count="371"><w:lsdException w:name="Normal" w:uiPriority="0" w:qFormat="1"/><w:lsdException w:name="heading 1" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 2" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 3" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 4" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 5" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 6" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 7" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 8" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="heading 9" w:semiHidden="1" w:uiPriority="9" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="index 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 6" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 7" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 8" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index 9" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 1" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 2" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 3" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 4" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 5" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 6" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 7" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 8" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="toc 9" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1"/><w:lsdException w:name="Normal Indent" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="footnote text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="annotation text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="header" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="footer" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="index heading" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="caption" w:semiHidden="1" w:uiPriority="35" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="table of figures" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="envelope address" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="envelope return" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="footnote reference" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="annotation reference" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="line number" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="page number" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="endnote reference" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="endnote text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="table of authorities" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="macro" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="toa heading" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Bullet 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Number 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Title" w:uiPriority="10" w:qFormat="1"/><w:lsdException w:name="Closing" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Signature" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Default Paragraph Font" w:semiHidden="1" w:uiPriority="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text Indent" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="List Continue 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Message Header" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Subtitle" w:uiPriority="11" w:qFormat="1"/><w:lsdException w:name="Salutation" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Date" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text First Indent" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text First Indent 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Note Heading" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text Indent 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Body Text Indent 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Block Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Hyperlink" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="FollowedHyperlink" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Strong" w:uiPriority="22" w:qFormat="1"/><w:lsdException w:name="Emphasis" w:uiPriority="20" w:qFormat="1"/><w:lsdException w:name="Document Map" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Plain Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="E-mail Signature" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Top of Form" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Bottom of Form" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Normal (Web)" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Acronym" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Address" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Cite" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Code" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Definition" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Keyboard" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Preformatted" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Sample" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Typewriter" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="HTML Variable" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Normal Table" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="annotation subject" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="No List" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Outline List 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Outline List 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Outline List 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Simple 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Simple 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Simple 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Classic 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Colorful 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Colorful 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Colorful 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Columns 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 6" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 7" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid 8" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 4" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 5" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 6" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 7" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table List 8" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table 3D effects 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table 3D effects 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table 3D effects 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Contemporary" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Elegant" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Professional" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Subtle 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Subtle 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Web 1" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Web 2" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Web 3" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Balloon Text" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Table Grid" w:uiPriority="39"/><w:lsdException w:name="Table Theme" w:semiHidden="1" w:unhideWhenUsed="1"/><w:lsdException w:name="Placeholder Text" w:semiHidden="1"/><w:lsdException w:name="No Spacing" w:uiPriority="1" w:qFormat="1"/><w:lsdException w:name="Light Shading" w:uiPriority="60"/><w:lsdException w:name="Light List" w:uiPriority="61"/><w:lsdException w:name="Light Grid" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2" w:uiPriority="64"/><w:lsdException w:name="Medium List 1" w:uiPriority="65"/><w:lsdException w:name="Medium List 2" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3" w:uiPriority="69"/><w:lsdException w:name="Dark List" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading" w:uiPriority="71"/><w:lsdException w:name="Colorful List" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 1" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 1" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 1" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 1" w:uiPriority="65"/><w:lsdException w:name="Revision" w:semiHidden="1"/><w:lsdException w:name="List Paragraph" w:uiPriority="34" w:qFormat="1"/><w:lsdException w:name="Quote" w:uiPriority="29" w:qFormat="1"/><w:lsdException w:name="Intense Quote" w:uiPriority="30" w:qFormat="1"/><w:lsdException w:name="Medium List 2 Accent 1" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 1" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 1" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 1" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 1" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 2" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 2" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 2" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 2" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 2" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 2" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 2" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 2" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 2" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 3" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 3" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 3" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 3" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 3" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 3" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 3" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 3" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 3" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 4" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 4" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 4" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 4" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 4" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 4" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 4" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 4" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 4" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 5" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 5" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 5" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 5" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 5" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 5" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 5" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 5" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 5" w:uiPriority="73"/><w:lsdException w:name="Light Shading Accent 6" w:uiPriority="60"/><w:lsdException w:name="Light List Accent 6" w:uiPriority="61"/><w:lsdException w:name="Light Grid Accent 6" w:uiPriority="62"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:uiPriority="63"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:uiPriority="64"/><w:lsdException w:name="Medium List 1 Accent 6" w:uiPriority="65"/><w:lsdException w:name="Medium List 2 Accent 6" w:uiPriority="66"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:uiPriority="67"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:uiPriority="68"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:uiPriority="69"/><w:lsdException w:name="Dark List Accent 6" w:uiPriority="70"/><w:lsdException w:name="Colorful Shading Accent 6" w:uiPriority="71"/><w:lsdException w:name="Colorful List Accent 6" w:uiPriority="72"/><w:lsdException w:name="Colorful Grid Accent 6" w:uiPriority="73"/><w:lsdException w:name="Subtle Emphasis" w:uiPriority="19" w:qFormat="1"/><w:lsdException w:name="Intense Emphasis" w:uiPriority="21" w:qFormat="1"/><w:lsdException w:name="Subtle Reference" w:uiPriority="31" w:qFormat="1"/><w:lsdException w:name="Intense Reference" w:uiPriority="32" w:qFormat="1"/><w:lsdException w:name="Book Title" w:uiPriority="33" w:qFormat="1"/><w:lsdException w:name="Bibliography" w:semiHidden="1" w:uiPriority="37" w:unhideWhenUsed="1"/><w:lsdException w:name="TOC Heading" w:semiHidden="1" w:uiPriority="39" w:unhideWhenUsed="1" w:qFormat="1"/><w:lsdException w:name="Plain Table 1" w:uiPriority="41"/><w:lsdException w:name="Plain Table 2" w:uiPriority="42"/><w:lsdException w:name="Plain Table 3" w:uiPriority="43"/><w:lsdException w:name="Plain Table 4" w:uiPriority="44"/><w:lsdException w:name="Plain Table 5" w:uiPriority="45"/><w:lsdException w:name="Grid Table Light" w:uiPriority="40"/><w:lsdException w:name="Grid Table 1 Light" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 1" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 1" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 1" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 1" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 1" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 1" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 1" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 2" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 2" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 2" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 2" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 2" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 2" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 2" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 3" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 3" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 3" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 3" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 3" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 3" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 3" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 4" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 4" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 4" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 4" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 4" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 4" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 4" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 5" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 5" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 5" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 5" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 5" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 5" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 5" w:uiPriority="52"/><w:lsdException w:name="Grid Table 1 Light Accent 6" w:uiPriority="46"/><w:lsdException w:name="Grid Table 2 Accent 6" w:uiPriority="47"/><w:lsdException w:name="Grid Table 3 Accent 6" w:uiPriority="48"/><w:lsdException w:name="Grid Table 4 Accent 6" w:uiPriority="49"/><w:lsdException w:name="Grid Table 5 Dark Accent 6" w:uiPriority="50"/><w:lsdException w:name="Grid Table 6 Colorful Accent 6" w:uiPriority="51"/><w:lsdException w:name="Grid Table 7 Colorful Accent 6" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light" w:uiPriority="46"/><w:lsdException w:name="List Table 2" w:uiPriority="47"/><w:lsdException w:name="List Table 3" w:uiPriority="48"/><w:lsdException w:name="List Table 4" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 1" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 1" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 1" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 1" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 1" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 1" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 1" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 2" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 2" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 2" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 2" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 2" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 2" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 2" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 3" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 3" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 3" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 3" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 3" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 3" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 3" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 4" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 4" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 4" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 4" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 4" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 4" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 4" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 5" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 5" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 5" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 5" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 5" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 5" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 5" w:uiPriority="52"/><w:lsdException w:name="List Table 1 Light Accent 6" w:uiPriority="46"/><w:lsdException w:name="List Table 2 Accent 6" w:uiPriority="47"/><w:lsdException w:name="List Table 3 Accent 6" w:uiPriority="48"/><w:lsdException w:name="List Table 4 Accent 6" w:uiPriority="49"/><w:lsdException w:name="List Table 5 Dark Accent 6" w:uiPriority="50"/><w:lsdException w:name="List Table 6 Colorful Accent 6" w:uiPriority="51"/><w:lsdException w:name="List Table 7 Colorful Accent 6" w:uiPriority="52"/></w:latentStyles><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/><w:uiPriority w:val="39"/><w:rsid w:val="00A562C8"/><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tblBorders></w:tblPr></w:style></w:styles>');

	// 	wordFolder.file("styles.xml", styles.toString());

	// 	var webSettings = new StringBuilder();

	// 	webSettings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	webSettings.append('<w:webSettings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" mc:Ignorable="w14 w15"><w:optimizeForBrowser/><w:relyOnVML/><w:allowPNG/></w:webSettings>');

	// 	wordFolder.file("webSettings.xml", webSettings.toString());

	// 	var settings = new StringBuilder();

	// 	settings.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	settings.append('<w:settings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" mc:Ignorable="w14 w15"><w:zoom w:percent="100"/><w:proofState w:spelling="clean" w:grammar="clean"/><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/><w:compatSetting w:name="overrideTableStyleFontSizeAndJustification" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="enableOpenTypeFeatures" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="doNotFlipMirrorIndents" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="differentiateMultirowTableHeaders" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/></w:compat><w:rsids><w:rsidRoot w:val="00FC6238"/><w:rsid w:val="00547190"/><w:rsid w:val="00A562C8"/><w:rsid w:val="00FC6238"/></w:rsids><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="0"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr><w:themeFontLang w:val="en-US" w:bidi="ar-SA"/><w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/><w:shapeDefaults><o:shapedefaults v:ext="edit" spidmax="1026"/><o:shapelayout v:ext="edit"><o:idmap v:ext="edit" data="1"/></o:shapelayout></w:shapeDefaults><w:decimalSymbol w:val="."/><w:listSeparator w:val=","/><w15:chartTrackingRefBased/><w15:docId w15:val="{15D8FF92-5A9B-43C2-AF96-1E0F16D9E2FB}"/></w:settings>');

	// 	wordFolder.file("settings.xml", settings.toString());

	// 	var fontTable = new StringBuilder();

	// 	fontTable.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	fontTable.append('<w:fonts xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" mc:Ignorable="w14 w15"><w:font w:name="Calibri"><w:panose1 w:val="020F0502020204030204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="4000ACFF" w:usb2="00000001" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Arial"><w:panose1 w:val="020B0604020202020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002AFF" w:usb1="C0007843" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Times New Roman"><w:panose1 w:val="02020603050405020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002EFF" w:usb1="C0007843" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Calibri Light"><w:panose1 w:val="020F0302020204030204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="A00002EF" w:usb1="4000207B" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font></w:fonts>');

	// 	wordFolder.file("fontTable.xml", fontTable.toString());

	// 	var document = new StringBuilder();

	// 	document.append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
	// 	document.append('<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 wp14">');
	// 	document.append('<w:body>');
	// 	document.append('<w:tbl>');
	// 	document.append('<w:tblPr>');
	// 	document.append('<w:tblStyle w:val="TableGrid"/>');
	// 	document.append('<w:tblW w:w="15299" w:type="dxa"/>');
	// 	document.append('<w:tblInd w:w="-1175" w:type="dxa"/>');
	// 	document.append('<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>');
	// 	document.append('</w:tblPr>');

	// 	document.append('<w:tblGrid>');
	// 	columns.forEach(function (item, index) {
	// 		document.append('<w:gridCol w:w="1080"/>');
	// 	});
	// 	document.append('</w:tblGrid>');

	// 	document.append('<w:tr w:rsidR="00A562C8" w:rsidTr="00A562C8">');
	// 	columns.forEach(function (item, index) {
	// 		document.append('<w:tc>');
	// 		document.append('<w:tcPr>');
	// 		document.append('<w:tcW w:w="1080" w:type="dxa"/>');
	// 		document.append('<w:shd w:val="clear" w:color="auto" w:fill="E7E6E6" w:themeFill="background2"/>');
	// 		document.append('</w:tcPr>');
	// 		document.append('<w:p w:rsidR="00A562C8" w:rsidRDefault="00A562C8">');
	// 		document.append('<w:r>');
	// 		document.append('<w:t>' + item.title + '</w:t>');
	// 		document.append('</w:r>');
	// 		document.append('</w:p>');
	// 		document.append('</w:tc>');
	// 	});
	// 	document.append('</w:tr>');

	// 	var enumerableData = Enumerable.From(data).ToArray();

	// 	enumerableData.forEach(function (row, rowIndex) {
	// 		document.append('<w:tr w:rsidR="00A562C8" w:rsidTr="00A562C8">');
	// 		columns.forEach(function (column, columnIndex) {
	// 			if (typeof row[column.key] === 'undefined' || (row[column.key] === null)) {
	// 				row[column.key] = " ";
	// 			}

	// 			if (column.type === 'd' && (typeof row[column.key] !== 'undefined') && (row[column.key] !== null) && (row[column.key] !== " ")) {
	// 				row[column.key] = moment(row[column.key]).format("DD/MM/YYYY");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("&") !== -1) {
	// 				row[column.key] = row[column.key].replace(/&/g, "&amp;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf("<") !== -1) {
	// 				row[column.key].replace(/</g, "&lt;");
	// 			}

	// 			if (typeof row[column.key] === 'string' && row[column.key].indexOf(">") !== -1) {
	// 				row[column.key].replace(/>/g, "&gt;");
	// 			}

	// 			document.append('<w:tc>');
	// 			document.append('<w:tcPr>');
	// 			document.append('<w:tcW w:w="1080" w:type="dxa"/>');
	// 			document.append('</w:tcPr>');
	// 			document.append('<w:p w:rsidR="00A562C8" w:rsidRDefault="00A562C8">');
	// 			document.append('<w:r>');
	// 			document.append('<w:t>' + row[column.key] + '</w:t>');
	// 			document.append('</w:r>');
	// 			document.append('</w:p>');
	// 			document.append('</w:tc>');
	// 		});
	// 		document.append('</w:tr>');
	// 	});

	// 	document.append('</w:tbl>');
	// 	document.append('<w:p w:rsidR="00547190" w:rsidRDefault="00547190"/>');
	// 	document.append('<w:sectPr w:rsidR="00547190">');
	// 	document.append('<w:pgSz w:w="15840" w:h="24480" w:code="3"/>');
	// 	document.append('<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>');
	// 	document.append('<w:cols w:space="720"/>');
	// 	document.append('<w:docGrid w:linePitch="360"/>');
	// 	document.append('</w:sectPr>');
	// 	document.append('</w:body>');
	// 	document.append('</w:document>');

	// 	wordFolder.file('document.xml', document.toString());

	// 	var wordFile = zip.generate({ type: "blob" });

	// 	saveAs(wordFile, (fileName || 'ProcoorGeneratedWordFile') + '.docx');
	// };

	// static pdfExportingService = function (data, columns, fileName) {
	// 	var doc = new jsPDF('landscape', "pt", "a4", true);

	// 	var pdfData = Enumerable.From(data).Select(function (x) {
	// 		var result = {};

	// 		columns.forEach(function (prop, index) {
	// 			var propData = x[prop.key];

	// 			if (propData === undefined || propData === null || propData === "") {
	// 				propData = "No Data";
	// 			} else if (prop.type === 'd') {
	// 				propData = moment(propData).format("DD/MM/YYYY");
	// 			}

	// 			Object.defineProperty(result, prop.key, {
	// 				value: propData,
	// 				writable: true,
	// 				enumerable: true,
	// 				configurable: true
	// 			});
	// 		});

	// 		return result;
	// 	}).ToArray();

	// 	doc.autoTable(columns, pdfData);
	// 	doc.save(fileName + '.pdf');
	// };

}
