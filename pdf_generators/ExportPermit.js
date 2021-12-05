const { response } = require("express");
const fs = require("fs");
const htmlTemplate = fs.readFileSync(
  "./pdf_templates/export-permit/export-permit.html",
  "utf8"
);
const multipageHeader =fs.readFileSync(
  "./pdf_templates/export-permit/export-multipage-header.html"
);

const materialGroup =fs.readFileSync(
  "./pdf_templates/export-permit/export-material-group.html"
);

const htmlFooter = fs.readFileSync(
  "./pdf_templates/export-permit/export-permit-footer.html"
);

const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };
const dateTimeFormattor = require('../util/dateTimeFormattor');
const templateEngine = require('../util/templateEngine');

class ExportPermit {
  constructor() {}

  async generate(body) {
    
    body.formValue.undertakingDate = dateTimeFormattor.getApplicationDate(body.formValue.undertakingDate);
    body.formValue.invoiceVendorRefDate = dateTimeFormattor.getApplicationDate(body.formValue.invoiceVendorRefDate);
    let html = htmlTemplate;
    body.formValue.dataGrid.forEach((element, index) => {
      element.issueDate = dateTimeFormattor.getApplicationDate(element.issueDate);
      element.expiryDate = dateTimeFormattor.getApplicationDate(element.expiryDate);
      if(index==0){
        body.formValue.firstMaterial = templateEngine.replacer(materialGroup.toString(), element);
        if(body.formValue.dataGrid.length == 1) {
          body.formValue.firstMaterial += htmlFooter;
        }
      }
      else{
        if(body.formValue.dataGrid.length > 1){
          if(index%2!=0){
            html+="<div class=\"mainContainer pagebreak\">";
            body.formValue.nextMaterials = templateEngine.replacer(materialGroup.toString(), element);
            if(index==(body.formValue.dataGrid.length-1)){
              html += templateEngine.replacer(multipageHeader.toString(), body.formValue);
              html += htmlFooter;
              html += "</main></div>";
            }
          }
          else{
            if(index!=0){
              body.formValue.nextMaterials += templateEngine.replacer(materialGroup.toString(), element);
              html += templateEngine.replacer(multipageHeader.toString(), body.formValue);
              
              if(index==(body.formValue.dataGrid.length-1)){
                html += htmlFooter;                
              }
              html += "</main></div>";
            }            
          }          
        }
        else{
        }        
      }  
    });  
    html += "</body></html>"
    const response = await pdf.generatePdfFromHtml(html, body, options);
    return response;
  }
}

module.exports = ExportPermit;
