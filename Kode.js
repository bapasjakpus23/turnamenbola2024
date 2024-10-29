
// Limit Pemain
 function saveRegistrationDeadline(startDeadline, endDeadline) {
    const timezone = 'Asia/Jakarta'; 
    const startDateInIndonesia = Utilities.formatDate(new Date(startDeadline), timezone, 'yyyy-MM-dd HH:mm:ss');
    const endDateInIndonesia = Utilities.formatDate(new Date(endDeadline), timezone, 'yyyy-MM-dd HH:mm:ss');  
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    sheet.getRange('A1').setValue(startDateInIndonesia); // Store the start date in cell A1
    sheet.getRange('B1').setValue(endDateInIndonesia);   // Store the end date in cell B1
}

function tanggalLimitPemain() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    const startDate = sheet.getRange('A1').getValue().toLocaleString();  
    const endDate = sheet.getRange('B1').getValue().toLocaleString();   
    return { startDate, endDate }; // Return an object containing both dates
}

function akun() {  
   const userEmail = Session.getActiveUser().getEmail(); 
   
    return userEmail  ; // Return an object containing both dates
}

function tim() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Teams'); 
  const data = sheet.getDataRange().getValues();
  const userEmail = Session.getActiveUser().getEmail(); 
  let namaTim = ''; // Initialize the variable to hold the result

   
  for (let i = 0; i < data.length; i++) {
    // 
    if (data[i][2] === userEmail) {      
      namaTim = data[i][1];
      break;  
    }
  }


  return namaTim; // Return the variable containing the result
}

function logo_tim() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Teams'); 
  const data = sheet.getDataRange().getValues();
  const userEmail = Session.getActiveUser().getEmail(); 
  let logoTim = ''; // Initialize the variable to hold the result

   
  for (let i = 0; i < data.length; i++) {
    // 
    if (data[i][2] === userEmail) {      
      logoTim = data[i][3];
      break;  
    }
  }


  return logoTim; // Return the variable containing the result
}



// Limit Team
function setRegistrationDates(startDate, endDate) {

    const timezone = 'Asia/Jakarta'; 
    const startDateInIndonesia = Utilities.formatDate(new Date(startDate), timezone, 'yyyy-MM-dd HH:mm:ss');
    const endDateInIndonesia = Utilities.formatDate(new Date(endDate), timezone, 'yyyy-MM-dd HH:mm:ss');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');  
    sheet.getRange('D1').setValue(startDateInIndonesia);
    sheet.getRange('E1').setValue(endDateInIndonesia);   
}

function tanggalLimitTim() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    const startDate = sheet.getRange('D1').getValue().toLocaleString(); // Retrieve the start date from cell D1
    const endDate = sheet.getRange('E1').getValue().toLocaleString();   // Retrieve the end date from cell E1
    return { startDate, endDate }; // Return an object containing both dates
}


// Limit Linup
function setupAdminForm(startDateAdmin, endDateAdmin) {
  const timezone = 'Asia/Jakarta'; 
  const startDateInIndonesia = Utilities.formatDate(new Date(startDateAdmin), timezone, 'yyyy-MM-dd HH:mm:ss');
  const endDateInIndonesia = Utilities.formatDate(new Date(endDateAdmin), timezone, 'yyyy-MM-dd HH:mm:ss');  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  sheet.getRange('G1').setValue(startDateInIndonesia); // Store the start date in cell A1
  sheet.getRange('H1').setValue(endDateInIndonesia);   // Store the end date in cell B1     
  
}

function tanggalLimitLineup() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    const startDate = sheet.getRange('G1').getValue().toLocaleString();  
    const endDate = sheet.getRange('H1').getValue().toLocaleString();   
    return { startDate, endDate }; // Return an object containing both dates
}

 
 
function getRegistrationDates() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  const startDates = sheet.getRange('G1').getValue(); // Get start date from cell G1
  const endDates = sheet.getRange('H1').getValue();   // Get end date from cell H1

  // Convert to Date objects if they are not already
  const startDateObj = new Date(startDates);
  const endDateObj = new Date(endDates);

  // Validate the start date
  if (!startDates || isNaN(startDateObj.getTime())) {
    throw new Error("Start date is either not set or is not a valid date in the Settings sheet.");
  }
  
  // Validate the end date
  if (!endDates || isNaN(endDateObj.getTime())) {
    throw new Error("End date is either not set or is not a valid date in the Settings sheet.");
  }
  
  // Return both dates as an object
  return {
 startDate: startDateObj.toISOString(), // Convert to ISO string for consistency
    endDate: endDateObj.toISOString()      // Convert to ISO string for consistency
  };
}


function registerTeam(teamName, imageData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Teams');
  const dateSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  const userEmail = Session.getActiveUser().getEmail(); 

  // Get registration dates
  const dateData = dateSheet.getDataRange().getValues();
  const startDate = new Date(dateData[0][3]);
  const endDate = new Date(dateData[0][4]);
  const currentDate = new Date();

  // Check if current date is within the registration period
  if (currentDate < startDate || currentDate > endDate) {
    throw new Error('Pendaftaran Tim Saat ini ditutup.');
  }

  const data = sheet.getDataRange().getValues();
  let lastTeamId = 0;
  let userAlreadyRegistered = false;

  for (let i = 1; i < data.length; i++) { 
    const currentId = parseInt(data[i][0], 10); 
    if (currentId > lastTeamId) {
      lastTeamId = currentId; 
    }
    
    // Check if the user has already registered
    if (data[i][2] === userEmail) { // Assuming email is in the second column
      userAlreadyRegistered = true;
      break;
    }
  }

  // If the user is already registered, return an error message
  if (userAlreadyRegistered) {
    throw new Error('Anda sudah mendaftarkan tim menggunakan Email ini');
  }

  // Register the new team
  const newTeamId = lastTeamId + 1;
  let imageUrl = '';

  // Save image to Google Drive only if imageData is provided
  if (imageData) {
      const blob = Utilities.newBlob(Utilities.base64Decode(imageData), 'image/jpeg', teamName + '.jpg');
      const file = DriveApp.createFile(blob);
      const fileId = file.getId(); // Get the file ID
      imageUrl = `https://drive.google.com/thumbnail?id=${fileId}`; // Construct the thumbnail URL
  } else {
      // If no image is uploaded, set a default value or leave it blank
      imageUrl = 'No image uploaded'; // or use an empty string ''
  }
  sheet.appendRow([newTeamId, teamName, userEmail, imageUrl]); // Assuming team name is in the third column
}


function registerPlayer(playerName, noKtp, posisi, noPunggung, teamName, register, imageData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Players');
  const userEmail = Session.getActiveUser().getEmail();
  
  // Retrieve registration deadlines
  const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  const startDeadline = new Date(settingsSheet.getRange('A1').getValue());
  const endDeadline = new Date(settingsSheet.getRange('B1').getValue());
  const currentDate = new Date();

  // Check if current date is within the registration period
  if (currentDate < startDeadline || currentDate > endDeadline) {
      throw new Error('Registrasi pemain sudah ditutup');
  }

  const data = sheet.getDataRange().getValues();
  let lastPlayerId = 0;

  for (let i = 1; i < data.length; i++) { 
      const currentId = parseInt(data[i][0], 10); 
      if (currentId > lastPlayerId) {
          lastPlayerId = currentId; 
      }
  }

  const playerId = lastPlayerId + 1;
  const waktu = currentDate.toLocaleString();
  let imageUrl = '';

  // Save image to Google Drive only if imageData is provided
  if (imageData) {
      const blob = Utilities.newBlob(Utilities.base64Decode(imageData), 'image/jpeg', playerName + '.jpg');
      const file = DriveApp.createFile(blob);
      const fileId = file.getId(); // Get the file ID
      imageUrl = `https://drive.google.com/thumbnail?id=${fileId}`; // Construct the thumbnail URL
  } else {
      // If no image is uploaded, set a default value or leave it blank
      imageUrl = 'No image uploaded'; // or use an empty string ''
  }

  sheet.appendRow([playerId, userEmail, playerName, noKtp, posisi, noPunggung, teamName, register, waktu, imageUrl]);
  return playerId;
}




    function fetchPlayers() {
      const players = getPlayersByUser();
     
      return players; // Return the filtered players
    }

      function fetchPlayerMatchday() {
      const players = getPlayersByMatchday();
      return players; // Return the filtered players
    }
 
    function getPlayersByUser() {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Players');
      const userEmail = Session.getActiveUser().getEmail();
      const data = sheet.getDataRange().getValues();               
      return data.filter(row => row[1] === userEmail); // Filter by user email
    }


function getPlayersByMatchday() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Players');
  const userEmail = Session.getActiveUser().getEmail();
  const data = sheet.getDataRange().getValues();  
  // Filter players based on their status and user email
  const activePlayers = data.filter(row => 
      (row[1] === userEmail && (row[7] === "Line Up" || row[7] === "Substitute"))
  );    
  // Sort players by status and then by the fifth column (index 4)
  activePlayers.sort((a, b) => {
    // Prioritize "Line Up" over "Subtitute"
    const statusA = a[7] === "Line Up" ? 0 : 1; // Assign 0 for "Line Up", 1 for "Subtitute"
    const statusB = b[7] === "Line Up" ? 0 : 1;
    // First sort by status
    if (statusA !== statusB) {
      return statusA - statusB; // Sort by status priority
    }
    // If statuses are the same, sort by the fifth column (index 4)
    const dateA = new Date(a[7]); // Convert to Date object
    const dateB = new Date(b[7]); // Convert to Date object
    return dateA - dateB; // Sort from oldest to latest
  });

  return activePlayers; // Return the filtered and sorted players
}

 

function updatePlayerStatus(playerId, newStatus) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Players');
  const data = sheet.getDataRange().getValues();
  
  

    const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');    
    const startDate = new Date(settingsSheet.getRange('G1').getValue());
    const endDate = new Date(settingsSheet.getRange('H1').getValue());
    const currentDate = new Date();
    
  if (currentDate < new Date(startDate) || currentDate > new Date(endDate)) {
    throw new Error('Update pemain sudah ditutup');
  }

  for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
    if (data[i][0] === playerId) { // Assuming player ID is at index 0
      sheet.getRange(i + 1, 8).setValue(newStatus); // Update status in column 4
      sheet.getRange(i + 1, 9).setValue(currentDate.toLocaleString()); // Set timestamp in column 5
      break;
    }
  }
}


 
