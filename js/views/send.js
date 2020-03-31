
/*global define */

/**
 * sending to FHIR module.
 *
 * @module views/send
 * @requires {@link helpers/page}
 * @namespace views/send
 */
define({
    name: 'views/send',
    requires: [
        'helpers/page'
    ],
    def: function send(pageHelper) {
        'use strict';

        /**
         * Page element.
         *
         * @memberof views/send
         * @private
         * @type {HTMLElement}
         */
        var page = null;
       
        
        /**
         * permission checker
         *
         * @memberof views/send
         * @private
         * @type {bool}
         */
        var permission = false;

        
        /**
         * Handles pagebeforeshow event page element.
         *
         * @memberof views/send
         * @private
         */
        function onPageBeforeShow() {
            pageHelper.resetScroll(page);
        }
        
        
        /**
         * counter for the heartrate monitor to stay on
         *
         * @memberof views/send
         * @private
         * @type {int}
         */
        var counter = 0;
        
        /**
         * timestamp for FHIR
         *
         * @memberof views/send
         * @private
         * @type {string}
         */
        var nowStr = "";
        
        /**
         * heartrate for FHIR
         *
         * @memberof views/send
         * @private
         * @type {int}
         */
        var heartrate = -20;
        
        /**
         * first name for FHIR
         *
         * @memberof views/send
         * @private
         * @type {string}
         */
        var firstname = "";
        
        /**
         * last name for FHIR
         *
         * @memberof views/send
         * @private
         * @type {string}
         */
        var lastname = "";
        
        /**
         * date of birth for FHIR
         *
         * @memberof views/send
         * @private
         * @type {string}
         */
        var birthdate = "";
        
        /**
         * patient ID for FHIR
         *
         * @memberof views/send
         * @private
         * @type {string}
         */
        var patID = "";
        
        /**
         * Checks and updates health data
         * 
         *  @memberof views/send
         * @private
         * */
        function onsuccessCB() {
        	
        	permission = true;
        	
        	function onchangedCB(hrmInfo) {  
          		//timestamp
        		var now = new tizen.TZDate();
        		var month = now.getMonth()+1;
        		if (month < 10){month = "0" + month;}
        		nowStr = now.getFullYear() + "-" + month + "-" + now.getDate() + "T" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + now.getTimezoneAbbreviation().slice(3);
        		var paraTime =  document.createElement("p");//creates new paragraph
	            var nodeTime = document.createTextNode("Timestamp: " + nowStr);//put this in FHIR Standard
	            paraTime.appendChild(nodeTime);
	            paraTime.setAttribute("id", "time");
        		var elementTime = document.getElementById("sendContent");
	            var childTime = document.getElementById("time");
	            elementTime.replaceChild(paraTime, childTime);
	            
        		//heartrate
        		heartrate = hrmInfo.heartRate;
        		if (heartrate <= 0){
        			heartrate = "couldn't be measured";
        			document.getElementById("sendtofhir").href = '#sendfail';}
	            var paraHeart = document.createElement("p");//creates new paragraph
	            var nodeHeart = document.createTextNode("Heartrate: " + heartrate);
	            paraHeart.appendChild(nodeHeart);
	            paraHeart.setAttribute("id", "heartrate");
	            var elementHeart = document.getElementById("sendContent");
	            var childHeart = document.getElementById("heartrate");//if -10 or -3 don't 
	            elementHeart.replaceChild(paraHeart, childHeart);
 
	        	//user info
	            firstname = document.getElementById("fname").value.charAt(0).toUpperCase() + document.getElementById("fname").value.slice(1);
	            lastname = document.getElementById("lname").value.charAt(0).toUpperCase() + document.getElementById("lname").value.slice(1);
	            birthdate = document.getElementById("dob").value;
        		var usrID = firstname + " " + lastname + " " +  birthdate;
        		if (usrID !== null && usrID !=="undefined undefined undefined" && usrID !== "  " && usrID !== "[HTML Element]"){
  	        		var paraUsr =  document.createElement("p");//creates new paragraph
		            var nodeUsr = document.createTextNode("User Info: " + usrID);//replace with user name and DOB
		            paraUsr.appendChild(nodeUsr);
		            paraUsr.setAttribute("id", "patient");
	        		var elementUsr = document.getElementById("sendContent");
		            var childUsr = document.getElementById("patient");
		            elementUsr.replaceChild(paraUsr, childUsr);
		            }
        		else{
        			document.getElementById("sendtofhir").href = '#sendfail';
        		}
        		
        		//send mode
        		var mode = "manual";
        		if (document.getElementById("sendhourly").checked){mode = "hourly";}
        		else if (document.getElementById("senddaily").checked){mode = "daily";}
        		else if (document.getElementById("sendweekly").checked){mode = "weekly";}
        		var paraMode = document.createElement("p");//creates new paragraph
	            var nodeMode = document.createTextNode("Your send mode is: " + mode);
	            paraMode.appendChild(nodeMode);
	            paraMode.setAttribute("id", "mode");
	            var elementMode = document.getElementById("sendContent");
	            var childMode = document.getElementById("mode");
	            elementMode.replaceChild(paraMode, childMode);     		
	   
	            counter++;
	            if (counter > 10) {
	                /* Stop the sensor after detecting a few changes */
	                tizen.humanactivitymonitor.stop('HRM');
	            }
            }//add respiratory rate, blood pressure when the samsung features become available
    	    tizen.humanactivitymonitor.start('HRM', onchangedCB);
        }

       
        /**
         * error handling for onsuccessCB
         *
         * @memberof views/send
         * @public
         */
        function onerrorCB(error) {
            console.error('Error occurred: ' + error.message);
        }
        
        /**
         * Reloads the information recorded on each "send data" click
         *
         * @memberof views/send
         * @public
         */
        function onClickSend(){
        	if (permission){
        		onsuccessCB();
        		console.error(firstname);
        		console.error(lastname);
        		console.error(birthdate);
        		
        		//run the fhir function
        		if(firstname == ""){
    	            firstname = document.getElementById("fname").value.charAt(0).toUpperCase() + document.getElementById("fname").value.slice(1);
    	            lastname = document.getElementById("lname").value.charAt(0).toUpperCase() + document.getElementById("lname").value.slice(1);
    	            birthdate = document.getElementById("dob").value;
        		}
        		patID = getPatientID(firstname, lastname, birthdate);
        		console.error(heartrate);
        		console.error(patID);
        		
            	if ((heartrate !== "couldn't be measured") && (heartrate > 0) && (patID !== "not gotten")){
            		//get and open the sendsuccess page
            		document.getElementById("sendtofhir").href = '#sendsuccess';
            		sendData();
            	}
            	else{
            		//get and open the sendfail page
            		document.getElementById("sendtofhir").href = '#sendfail';
            	}
        		}	
        }
        
        /**
         * gets patient ID from FHIR
         *
         * @memberof views/send
         * @public
         * @param {string} fname
         * @param {string} lname
         * @param {string} dob
         * @returns {string} patientID
         */
        function getPatientID(fname, lname, dob){
        	var gottenID = "not gotten";
        	var url = "https://fhirwearks.azurewebsites.net/getPatient?fname=" + fname + "&lname=" + lname + "&dob=" + dob;
        	$.ajax({url: url,
      			  type: 'GET',
    			  async : false,
    			  datatype: 'json',
    			  timeout: 30000,
    			  cache: false,
    			  success: function (response) {
        			  //console.error(response + " this is the get request log");
        			  gottenID = response;
        			  },
        		   error: function(xhr, status, error){
        			   var err = xhr.status + ': ' + xhr.statusText;
        			  console.error("oops " + err);
        		}});
        	//console.error(gottenID + " This is also request");
        	return gottenID;
        	
        }
        
        /**
         * posts patient observation to FHIR
         *
         * @memberof views/send
         * @public
         * @param {string} date
         * @param {string} heartrate
         * @param {string} patientID
         */
        function postObservation(date, heartrate, patientID){
        	/*var settings = {
        			  "url": "https://fhirwearks.azurewebsites.net/newObservation?date=" + date + "&heartrate=" + heartrate + "&patientID=" + patientID,
        			  "method": "POST",
        			  "async": false,
        			  "timeout": 0
        			};
        	//call it?
        	$.ajax(settings).done(function (response) {
        			  console.error(response);
        			});*/

          	$.post("https://fhirwearks.azurewebsites.net/newObservation", {"date":date, "heartrate":heartrate, "patientID":patientID});
        	        	
        }
        
        /**
         * Sends patient data to FHIR
         *
         * @memberof views/send
         * @public
         */
        function sendData(){
        		var para = document.createElement("p");//creates new paragraph
	            var node = document.createTextNode("ID: " + patID);
	            para.appendChild(node);
	            para.setAttribute("id", "patID");
	            var element = document.getElementById("IDcontent");
	            var child = document.getElementById("patID");
	            element.replaceChild(para, child);
	            
	            //display params
	            var paraID = document.createElement("p");//creates new paragraph
	            var nodeID = document.createTextNode("Data: " + firstname + " " + lastname + " " + birthdate);
	            paraID.appendChild(nodeID);
	            paraID.setAttribute("id", "patientName");
	            var elementID = document.getElementById("IDcontent");
	            var childID = document.getElementById("patientName");
	            elementID.replaceChild(paraID, childID);
	            
	            //send to fhir
	            postObservation(nowStr, heartrate, patID);
       
        }
        
        /**
         * Registers event listeners.
         *
         * @memberof views/send
         * @private
         */
        function bindEvents() {
            page.addEventListener('pagebeforeshow', onPageBeforeShow);

      	    document.getElementById('sendbutton').addEventListener('click', onClickSend);
      	   
        }
        
        /**
         * Initializes module.
         *
         * @memberof views/send
         * @public
         */
        function init() {

            tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo", onsuccessCB, onerrorCB);
        	
            page = document.getElementById('send');

            bindEvents();
        }

        return {
            init: init
        };
    }
});
