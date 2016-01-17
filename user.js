// ==UserScript==
// @name         Deutsche Bahn (DB) Kalender Export
// @namespace    http://schllng.de/
// @version      0.1
// @description  Faster and easier export of calendar entries, also for Google Calendar.
// @author       Simon Schiling
// @match        http://reiseauskunft.bahn.de/bin/query2.exe/dn?*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function() {

var rows = document.getElementsByClassName('result')[0].children[0].children;
for(var i = 0; i < rows.length; i++) {

  var row = rows[i],a,url,connection,urlSegments,icsUrl,target,gcala;
  if(!row || !row.hasClassName('firstrow')) continue;

  a = row.getElementsByTagName('a')[0];
  url = a.href;
  connection = /\[id=([^\]]+)\]/.exec(a.rel)[1];
  urlSegments = {};
  url.substr(url.indexOf('?') + 1).split('&').forEach(function (val) {
    var elem = val.split('=');
    urlSegments[elem[0]] = elem[1];
  });
  icsUrl = "http://reiseauskunft.bahn.de/bin/query2.exe/dov?" + "&ld=" + urlSegments.ld + "&seqnr=" + urlSegments.seqnr + "&ident=" + urlSegments.ident + "&rt=" + urlSegments.rt + "&_setStatus_" + connection + "_textual=" + urlSegments.ld + "&calendarId=" + connection

  target = row.getElementsByClassName('returnJourney')[0].parentNode;

  a = document.createElement('a');
  a.innerText = 'Kalender-Download';
  a.addClassName('arrowlink');
  a.href = icsUrl;
  target.appendChild(a);

  gcala = document.createElement('a');
  gcala.innerText = 'GCal Eintrag';
  gcala.addClassName('arrowlink');
  gcala.href = "#";
  gcala.onclick = function () {
    var xhttp;

    if(window.XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    };

    xhttp.open("GET", icsUrl, true);

    xhttp.onreadystatechange = function () {
      if(xhttp.readyState == 4 && xhttp.status == 200) {

        var ics = {},a;

        xhttp.responseText.split('\n').forEach(function (val) {
          var i = val.indexOf(':');
          ics[val.substr(0, i).split(';')[0]] = val.substr(i + 1);
        });

        a = document.createElement('a');
        a.href = "http://www.google.com/calendar/event?action=TEMPLATE" + "&text=" + encodeURI(ics.SUMMARY) + "&details=" + encodeURI(ics.DESCRIPTION) + "&dates=" + ics.DTSTART + "/" + ics.DTEND + "&location=" + encodeURI(ics.SUMMARY.substr(0, ics.SUMMARY.indexOf('->') - 1)) + "&trp=false" + "&sprop=" + "&sprop=name:";
        a.target = "_new";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

      }
    };

    xhttp.send();
  };
  target.appendChild(gcala);

};

})();
