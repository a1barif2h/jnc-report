// const { response } = require("express");
const { response } = require("express");
const fs = require("fs");
const { AllSopsCodes } = require("../shared/constants/AllSopsCodes");
var footerTemplate = fs.readFileSync(
  "./pdf_templates/import-permit/footer.html",
  "utf8"
);

let exportPermitFooterTemplate = fs.readFileSync(
  "./pdf_templates/export-permit/export-permit-footer.html",
  "utf8"
);

const pageBreak = '<div class="mainContainer pageBreak">';
const itemsCountPerPage = 4;

const addJsonValuesIntoHtml = function (json, template) {
  for (var key in json) {
    // console.log(`json[${key}] = ${json[key]}`)
    template = template.replaceAll("{{" + key + "}}", json[key] || "-");
  }
  return template;
};
const generateMultipleMaterialsDescription = function (
  dataGrid,
  materialsTemplate,
  headerTemplate
) {
  // if (data.length == 0) {
  //   return "";
  // }
  // const dataGrid = data.dataGrid;
  let materialsDescriptionTemplate = "";

  for (let i = 2; i < dataGrid.length; i++) {
    let tempmaterialsTemplate = materialsTemplate;
    if (i == dataGrid.length - 1) {
      tempmaterialsTemplate = tempmaterialsTemplate.replace(
        `{{footerHere}}`,
        footerTemplate.toString() || "-"
      );
    } else {
      tempmaterialsTemplate = tempmaterialsTemplate.replace(
        `{{footerHere}}`,
        ""
      );
    }
    if (i % 4 == 1) {
      materialsDescriptionTemplate += pageBreak;

      tempmaterialsTemplate = tempmaterialsTemplate.replace(
        `{{headerHere}}`,
        headerTemplate.toString()
      );
    } else {
      tempmaterialsTemplate = tempmaterialsTemplate.replace(
        `{{headerHere}}`,
        ""
      );
    }
    materialsDescriptionTemplate += addJsonValuesIntoHtml(
      dataGrid[i],
      tempmaterialsTemplate
    );

    if (i % 4 == 0) {
      materialsDescriptionTemplate += "</div>";
    }
  }

  if (dataGrid.length != 0 && dataGrid.length % 4 == 0) {
    materialsDescriptionTemplate += "</div>";
  }

  return materialsDescriptionTemplate;
};
const addFirstMaterials = function (
  dataGrid,
  materialsDetailsTemplate,
  htmlExportTemplate,
  headerTemplate
) {


  if (dataGrid.length != 1) {
    materialsDetailsTemplate = materialsDetailsTemplate.replace(
      `{{footerHere}}`,
      ""
    );
  } else {
    materialsDetailsTemplate = materialsDetailsTemplate.replace(
      `{{footerHere}}`,
      footerTemplate.toString() || "-"
    );
  }
  materialsDetailsTemplate = materialsDetailsTemplate.replace(
    `{{headerHere}}`,
    ""
  );
  let firstMaterialsDetails = addJsonValuesIntoHtml(
    dataGrid[0],
    materialsDetailsTemplate
  );
  htmlExportTemplate = htmlExportTemplate.replace(
    `{{firstMaterialsDetails}}`,
    firstMaterialsDetails || "-"
  );
  return htmlExportTemplate;
};

const addRemainingMaterials = function (
  dataGrid,
  materialsDetailsTemplate,
  htmlExportTemplate,
  headerTemplate
) {
  if (dataGrid.length == 2) {
    htmlExportTemplate = htmlExportTemplate.replace(
      `{{remainingMaterialsDetails}}`,
      ""
    );
    return htmlExportTemplate;
  }
  let remainingMaterialsDetails = generateMultipleMaterialsDescription(
    dataGrid,
    materialsDetailsTemplate,
    headerTemplate
  );
  htmlExportTemplate = htmlExportTemplate.replace(
    `{{remainingMaterialsDetails}}`,
    remainingMaterialsDetails || "-"
  );
  return htmlExportTemplate;
};

const addLogoQrBarCodeAndMaterialLabelHeader = function (detailsTemplate,
  logoQrBarCodeHeaderTemplate, materialLabelTemplate, footerTemplate) {

  detailsTemplate = detailsTemplate.replace(
    `{{headerHere}}`,
    logoQrBarCodeHeaderTemplate.toString()
  );
  detailsTemplate = detailsTemplate.replace(
    `{{materialLabel}}`,
    materialLabelTemplate
  );
  detailsTemplate = detailsTemplate.replace(
    `{{footerHere}}`,
    footerTemplate
  );
  return detailsTemplate;
}

/**
 * Generate the first page of the pdf with combition of overall 2 no of material details and/or lcs 
 * So if materials details items > 2 then just used first 2 of material details otherwise add 1 material details and first lc item
 * @param {*} materialAndLcDescriptionsSectionGenerationProps 
 * @returns html
 */
const generateFirstPage = function (materialAndLcDescriptionsSectionGenerationProps) {
  const {
    materialInfoItems,
    materialsDetailsTemplate,
    materialLabelTemplate,
    lcInfoItems,
    lcInfoDetailsTemplate,
    applicationCode
  } = materialAndLcDescriptionsSectionGenerationProps;

  let {
    baseHtmlIEPTemplate
  } = materialAndLcDescriptionsSectionGenerationProps;

  let materialsTemplates = "";
  //As we are adding 4 items per page, in the first page the general info section's height is combined of 2 sections, so reamins 2
  let remainingItemsToAddInFirstPage = 2;
  let index = 0;

  // const footerTemplate = (applicationCode === AllSopsCodes.IMPORT_PERMIT.value) ? importPermitFooterTemplate : exportPermitFooterTemplate;

  while (remainingItemsToAddInFirstPage > 0 && index < materialInfoItems.length) {

    let thisMaterialsDetailsTemplate = materialsDetailsTemplate;

    thisMaterialsDetailsTemplate = (index === 1) ? addLogoQrBarCodeAndMaterialLabelHeader(thisMaterialsDetailsTemplate, "", "", footerTemplate)
      : addLogoQrBarCodeAndMaterialLabelHeader(thisMaterialsDetailsTemplate, "", materialLabelTemplate, "");

    materialsTemplates += addJsonValuesIntoHtml(
      materialInfoItems[index],
      thisMaterialsDetailsTemplate
    );
    index++;
    remainingItemsToAddInFirstPage--;
  }

  baseHtmlIEPTemplate = baseHtmlIEPTemplate.replace(
    `{{materialDescriptions}}`,
    materialsTemplates
  );

  //Now add lc if needed (if there is only on material details then its needed to add first lc item from lcinfos in the first page)
  materialsTemplates = "";

  index = 0;
  while (remainingItemsToAddInFirstPage > 0) {
    let thisLcInfoDetailsTemplate = lcInfoDetailsTemplate;

    thisLcInfoDetailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(thisLcInfoDetailsTemplate, "", "", footerTemplate);
    materialsTemplates += addJsonValuesIntoHtml(
      lcInfoItems[index],
      thisLcInfoDetailsTemplate
    );
    remainingItemsToAddInFirstPage--;
  }

  baseHtmlIEPTemplate = baseHtmlIEPTemplate.replace(
    `{{lcinformations}}`,
    materialsTemplates
  );

  return baseHtmlIEPTemplate;
}

const addMaterialsDescriptions = function (materialAndLcDescriptionsSectionGenerationProps) {
  const {
    materialInfoItems,
    materialsDetailsTemplate,
    logoQrBarCodeHeaderTemplate,
    materialLabelTemplate,
    lcInfoItems,
    lcInfoDetailsTemplate,
    applicationCode
  } = materialAndLcDescriptionsSectionGenerationProps;

  let {
    baseHtmlIEPTemplate
  } = materialAndLcDescriptionsSectionGenerationProps;

  // const footerTemplate = (applicationCode === AllSopsCodes.IMPORT_PERMIT.value) ? importPermitFooterTemplate : exportPermitFooterTemplate;
  let materialDescriptionTemplates = "";

  //if material details item > 2 then those 2 already have been added to the first page so start from next
  let startIndex = (materialInfoItems.length === 1) ? 1 : 2;

  for (let i = startIndex; i < materialInfoItems.length; i++) {
    let thisMaterialsDetailsTemplate = materialsDetailsTemplate;

    //Here 3 = 1(array index start from 0) + 2 (2 itmes already beend added in the first page)
    if ((i + 3) % itemsCountPerPage == 1) {
      //first element of a new page, so add logo header, label but not the footer
      materialDescriptionTemplates += pageBreak;
      thisMaterialsDetailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(thisMaterialsDetailsTemplate,
        logoQrBarCodeHeaderTemplate, materialLabelTemplate, "");

      materialDescriptionTemplates += addJsonValuesIntoHtml(
        materialInfoItems[i],
        thisMaterialsDetailsTemplate
      );
    } else if ((i + 3) % itemsCountPerPage == 0) {
      //last item to be added in the current page so add only footer.
      thisMaterialsDetailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(thisMaterialsDetailsTemplate,
        "", "", footerTemplate);

      materialDescriptionTemplates += addJsonValuesIntoHtml(
        materialInfoItems[i],
        thisMaterialsDetailsTemplate
      );
      //end of the page
      materialDescriptionTemplates += "</div>";
    } else {
      //continueing the current page so dont add logo or label or footer
      thisMaterialsDetailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(thisMaterialsDetailsTemplate,
        "", "", "");

      materialDescriptionTemplates += addJsonValuesIntoHtml(
        materialInfoItems[i],
        thisMaterialsDetailsTemplate
      );
    }
  }

  baseHtmlIEPTemplate = baseHtmlIEPTemplate.replace(
    `{{remainingMaterialDescriptions}}`,
    materialDescriptionTemplates
  );

  materialInfoItemsSize = materialInfoItems.length;

  baseHtmlIEPTemplate = addLcInfos(lcInfoItems, lcInfoDetailsTemplate, baseHtmlIEPTemplate, logoQrBarCodeHeaderTemplate,
    materialLabelTemplate, materialInfoItemsSize, applicationCode);

  return baseHtmlIEPTemplate;
}

const addLcInfos = function (lcInfoItems, lcInfoDetailsTemplate, baseHtmlIEPTemplate,
  logoQrBarCodeHeaderTemplate, materialLabelTemplate, materialItemsSize, applicationCode) {
  let addedItemsInCurrentPage = (materialItemsSize - 2) % itemsCountPerPage;
  addedItemsInCurrentPage = (addedItemsInCurrentPage < 0 ? 0 : addedItemsInCurrentPage);
  let reaminingItemsToAddInCurrentPage = itemsCountPerPage - addedItemsInCurrentPage;

  // const footerTemplate = (applicationCode === AllSopsCodes.IMPORT_PERMIT.value) ? importPermitFooterTemplate : exportPermitFooterTemplate;
  let lcInfoDetailsTemplates = "";

  //At most 1 lc item might be already added in the first page (when only 1 material details exists)
  let startingIndex = (materialItemsSize >= 2) ? 0 : 1;

  for (let i = startingIndex; i < lcInfoItems.length; i++) {
    let thisLcDetailsTemplate = lcInfoDetailsTemplate;

    if (reaminingItemsToAddInCurrentPage === 4) {
      //first item of a new page

      lcInfoDetailsTemplates += pageBreak;

      if ((i + 1) === lcInfoItems.length) {
        //that means no items remains to add, so close the current page with a footer and with a end div tag for page break
        thisLcDetailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(thisLcDetailsTemplate,
          logoQrBarCodeHeaderTemplate, materialLabelTemplate, footerTemplate);

        lcInfoDetailsTemplates += addJsonValuesIntoHtml(
          lcInfoItems[i],
          thisLcDetailsTemplate
        );

        lcInfoDetailsTemplates += "</div>";
      } else {
        //Threre is more items still to precess, so just add logo and label but not the footer
        thisLcDetailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(thisLcDetailsTemplate,
          logoQrBarCodeHeaderTemplate, materialLabelTemplate, "");

        lcInfoDetailsTemplates += addJsonValuesIntoHtml(
          lcInfoItems[i],
          thisLcDetailsTemplate
        );
      }

    } else if (reaminingItemsToAddInCurrentPage === 1) {
      //This is the last item to be added in the current page.

      thisLcDetailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(thisLcDetailsTemplate,
        "", "", footerTemplate);

      lcInfoDetailsTemplates += addJsonValuesIntoHtml(
        lcInfoItems[i],
        thisLcDetailsTemplate
      );
      //end the current page
      lcInfoDetailsTemplates += "</div>";
      reaminingItemsToAddInCurrentPage = 5;
    } else {

      if ((i + 1) === lcInfoItems.length) {
        //that means no items remains to add, so close the current page with 
        thisLcDetailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(thisLcDetailsTemplate,
          "", "", footerTemplate);

        lcInfoDetailsTemplates += addJsonValuesIntoHtml(
          lcInfoItems[i],
          thisLcDetailsTemplate
        );

        lcInfoDetailsTemplates += "</div>";
      } else {
        thisLcDetailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(thisLcDetailsTemplate,
          "", "", "");

        lcInfoDetailsTemplates += addJsonValuesIntoHtml(
          lcInfoItems[i],
          thisLcDetailsTemplate
        );
      }
    }
    reaminingItemsToAddInCurrentPage--;
  }

  baseHtmlIEPTemplate = baseHtmlIEPTemplate.replace(
    `{{lcinformations}}`,
    lcInfoDetailsTemplates
  );
  return baseHtmlIEPTemplate;
}

// FOR SAMPLE IMPORT PERMIT AND SAMPLE EXPORT PERMIT TILL NOW
const addFirstTwoMaterialDescriptions = function (
  dataGrid,
  materialsDetailsTemplate,
  htmlExportTemplate,
  materialsDetailsLabel,
  footerTemplate
) {
  let materialDescriptionTemplates = "";
  for (let i = 0; i < dataGrid.length && i < 2; i++) {
    const detailsTemplate = addJsonValuesIntoHtml(
      dataGrid[i],
      materialsDetailsTemplate
    );


    if (i == 1) {
      materialDescriptionTemplates += addLogoQrBarCodeAndMaterialLabelHeader(
        detailsTemplate,
        "",
        "",
        footerTemplate
      )
    } else {
      materialDescriptionTemplates += addLogoQrBarCodeAndMaterialLabelHeader(
        detailsTemplate,
        "",
        materialsDetailsLabel,
        ""
      )
    }
  }
  htmlExportTemplate = htmlExportTemplate.replace(
    `{{firstMaterialsDetails}}`,
    materialDescriptionTemplates || "-"
  );
  return htmlExportTemplate;
}

const addRemainingMaterialsDescription = (
  materialInfoItems,
  materialsDetailsTemplate,
  htmlExportTemplate,
  materialsDetailsLabel,
  headerTemplate,
  footerTemplate
) => {
  if (materialInfoItems.length == 2) {
    htmlExportTemplate = htmlExportTemplate.replace(
      `{{remainingMaterialsDetails}}`,
      ""
    );
    return htmlExportTemplate;
  }

  let materialsDescriptionTemplate = "";

  let isRemaining = materialInfoItems.length - 2;

  for (let i = 2; i < materialInfoItems.length; i++) {
    let detailsTemplate = materialsDetailsTemplate;

    if ((i + 3) % itemsCountPerPage === 1)  {
      materialsDescriptionTemplate += pageBreak;
      detailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(
        detailsTemplate,
        headerTemplate,
        materialsDetailsLabel,
        ""
      )
      materialsDescriptionTemplate += addJsonValuesIntoHtml(
        materialInfoItems[i],
        detailsTemplate
      )
    } else if((i + 3) % itemsCountPerPage === 0) {
      detailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(
        detailsTemplate,
        "",
        "",
        footerTemplate
      )

      materialsDescriptionTemplate += addJsonValuesIntoHtml(
        materialInfoItems[i],
        detailsTemplate,
      )

      materialsDescriptionTemplate += "</div>"
      isRemaining -= 4;
    } else {
      detailsTemplate = addLogoQrBarCodeAndMaterialLabelHeader(
        detailsTemplate,
        "",
        "",
        ""
      )

      materialsDescriptionTemplate += addJsonValuesIntoHtml(
        materialInfoItems[i],
        detailsTemplate
      )
    }
    
  }

  if (isRemaining > 0) {
    materialsDescriptionTemplate += footerTemplate

  }

  htmlExportTemplate = htmlExportTemplate.replace(
    `{{remainingMaterialsDetails}}`,
    materialsDescriptionTemplate
  );

  return htmlExportTemplate

}


module.exports = {
  addJsonValuesIntoHtml: addJsonValuesIntoHtml,
  generateMultipleMaterialsDescription,
  addFirstMaterials,
  addRemainingMaterials,
  addMaterialsDescriptions,
  addFirstTwoMaterialDescriptions,
  generateFirstPage: generateFirstPage,
  addRemainingMaterialsDescription,
};
