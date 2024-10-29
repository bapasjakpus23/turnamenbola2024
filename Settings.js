function doGet(e) {
   
          var output = HtmlService.createTemplateFromFile('Index');
            var sess = getSession();
            if (sess.loggedIn) {
  
                let page = e.parameter.page;       
                if (page == null) page = "Admin";     
                var output = HtmlService.createTemplateFromFile(page);
                output.evaluate()
                .setTitle("TURNAMEN BOLA")
                .addMetaTag('viewport', 'width=device-width, initial-scale=1')
                .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                // .setFaviconUrl('https://www.aida.or.id/wp-content/uploads/2017/11/ditjenpas.png');//03
            }
  
            return output.evaluate()
            .setTitle("TURNAMEN BOLA")
            .addMetaTag('viewport', 'width=device-width, initial-scale=1')
            .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
            // .setFaviconUrl('https://www.aida.or.id/wp-content/uploads/2017/11/ditjenpas.png');   
  
   }

  let MySheets  = SpreadsheetApp.getActiveSpreadsheet();
  let LoginSheet  = MySheets.getSheetByName("Login");   
  
    function myURL()  //06
  {
    return ScriptApp.getService().getUrl();
  }
  
  function setSession(session) {
    var sId   = Session.getTemporaryActiveUserKey();
    var uProp = PropertiesService.getUserProperties();
    uProp.setProperty(sId, JSON.stringify(session));
  }
  
  function getSession() {
    var sId   = Session.getTemporaryActiveUserKey();
    var uProp = PropertiesService.getUserProperties();
    var sData = uProp.getProperty(sId);
    return sData ? JSON.parse(sData) : { loggedIn: false };
  }
  
  function loginUser(pUID, pPassword) {
      
      if (loginCheck(pUID, pPassword)) {
        
        var sess = getSession();
        sess.loggedIn = true;
        setSession(sess);
  
          return 'success';
      } 
      else {
          return 'failure';
      }
  }
  
  function logoutUser() {
    var sess = getSession();
    sess.loggedIn = false;
    setSession(sess);
  }
  
  function loginCheck(pUID, pPassword) {
    let LoginPass =  false;
        let ReturnData = LoginSheet.getRange("A:A").createTextFinder(pUID).matchEntireCell(true).findAll();        
          ReturnData.forEach(function (range) {
            let StartRow = range.getRow();
            let TmpPass = LoginSheet.getRange(StartRow, 2).getValue();
            if (TmpPass == pPassword)
            {
                LoginPass = true;
            }
          });
  
      return LoginPass;
  }

    function includeSidebar()   //05
  {
     return HtmlService.createTemplateFromFile("Sidebar.html").evaluate()
     .getContent() ;
  }
  
  function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
