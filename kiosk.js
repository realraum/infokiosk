function min(a,b)
{
	if (a > b)
		return b;
	else
		return a;
}

function writeGooglePlusEvents(data, elem)
{
  var ghtml = "";
  //var gplusimgwidth = parseInt($('<table class="gplusimg" />').css("width"));
  var gplusimgwidth = 495;
  var minimgwidth=78;
  for (var i=0; i< data.items.length; i++)
  {
    var item = data.items[i];
    var noteobj = item.object;
    var attach = noteobj.attachments;
    var notetxt = noteobj.content;
    var noteimgs = new Array();
    if (attach)
    {
      for (var a=0; a<attach.length; a++)
      {
        if ( attach[a].objectType == "album")
        {
          for (var t=0; t<attach[a].thumbnails.length; t++)
          {
            noteimgs.push(attach[a].thumbnails[t].image.url);
          }
        }
        else if ( attach[a].objectType == "photo" || attach[a].objectType == "video")
        {
          noteimgs.push(attach[a].image.url);
        }
        else if (attach[a].objectType == "event")
        {
          notetxt = "<b>" + attach[a].displayName+"</b><br/>"+notetxt;
        }
      }
    }
    ghtml += '<div class="gpluspost">'
    ghtml += '<img class="gplusactor" src="'+item.actor.image.url+'"/><p class="gplustimestamp">'+item.updated.substring(0,16).replace("T"," ")+'</p>';
    ghtml += '<p class="gplustxt">'+notetxt+'</p>';
    if (noteimgs.length>0)
    {
      var bigimglimit;
      ghtml += '<table class="gplusimg" cellspacing="0"><tr>';
      if (noteimgs.length > 3)
      {
              var gplusimgmaxwidth = gplusimgwidth - (minimgwidth * ((noteimgs.length -1) / 3));
	      bigimglimit = "max-height:"+(minimgwidth*3)+"px; max-width:"+gplusimgmaxwidth+"px;"
	      ghtml += '<td><img class="gplusimg" style="'+bigimglimit+'" src="'+noteimgs[0]+'"/></td>';
	      for (var ni=1; ni<noteimgs.length; ni+=3)
	      {
		  ghtml += '<td>';
		  var niimax = min(noteimgs.length, ni+3);
		  for (var nii=ni; nii<niimax; nii++)
		  {
			ghtml += '<img class="gplusimg" style="max-width:'+minimgwidth+'px; max-height:'+minimgwidth+'px;" src="'+noteimgs[nii]+'"/><br/>';
		  }
	          ghtml += '</td>';
             }
      }
      else
      {
             var gplusimgmaxwidth = gplusimgwidth / noteimgs.length;
	     bigimglimit = "max-width:"+gplusimgmaxwidth+"px;"
             for (var ni=0; ni<noteimgs.length; ni++)
	     {
		ghtml += '<td><img class="gplusimg" style="'+bigimglimit+'" src="'+noteimgs[ni]+'"/></td>';
	     }
      }
      ghtml += '</tr></table>';
    }
    ghtml += '</div>';
  }
  elem.innerHTML=ghtml;
}


function loadGooglePlusEvents()
{
  var gpak = "AIzaSyD9xBFM-KWwSYBgZ8VzftJ5wYYvurOxEHg";
  var gplusuri = "https://www.googleapis.com/plus/v1/people/113737596421797426873/activities/public?maxResults=4&key="+gpak;
  var gpluscontainer=document.getElementById("gplusevents");
  $.getJSON(gplusuri, function(data){
    writeGooglePlusEvents(data, gpluscontainer);
  });
}

function weekday2str(dow)
{
    var weekday=new Array(7);
    weekday[0]="So";
    weekday[1]="Mo";
    weekday[2]="Di";
    weekday[3]="Mi";
    weekday[4]="Do";
    weekday[5]="Fr";
    weekday[6]="Sa";
    weekday[7]="So";
    if (dow >=0 && dow <=7)
        return weekday[dow];
    else
        return "";
}

function calendarItemEnhancer(data)
{
    for (var s=0; s<data.length; s++)
    {
      var when = "";
      var dt = Date.parse(data[s].start+'T'+data[s].starttime);
      if (Date.now() > dt)
      {
        when = "JETZT";
      }
      else
      {
        var weekday = weekday2str((new Date(dt)).getDay());
        var stime = data[s].starttime;
        var month = data[s].start.substring(5,7);
        if (month[0] == '0')
          month = month[1];
        var dayofmonth = data[s].start.substring(8,10);
          if (dayofmonth[0] == '0')
          dayofmonth = dayofmonth[1];
        while (stime.substring(stime.length-3,stime.length) == ":00")
        {
          stime=stime.substring(0,stime.length-3);
        }
        if (stime.length <= 2) { stime+="h"; }
        when = weekday + " " + dayofmonth+"."+month +", "+stime;
      }
      data[s].when = when
    }
    return data
}

function loadCalendarKiosk()
{
  var calcontainer=document.getElementById("grical_upcoming_kiosk");
  $.getJSON('/shmcache/grical_realraum.json', function(data){
    var calhtml = "";
    $.each(calendarItemEnhancer(data), function(index, itm) {
      calhtml += '<li class="level1">'+itm.when+' - <span class="r3red">'+itm.title+'</span></li>'+"\n";
    });
    calcontainer.innerHTML='<ul>'+calhtml+'</ul>';
  });
}

function loadCalendarMainPage()
{
  //old URI: //grical.realraum.at/s/?query=!realraum&limit=9&view=json
  var calcontainer=document.getElementById("grical_upcoming");
  $.getJSON('/shmcache/grical_realraum.json', function(data){
    var calhtml = "";
    $.each(calendarItemEnhancer(data), function(index, itm) {
      calhtml += '<li class="level1"><div class="li">'+itm.when+' - <a href="'+itm.url+'" class="urlextern" title="'+itm.title+'"  rel="nofollow">'+itm.title+'</a></div></li>'+"\n";
    });
    calcontainer.innerHTML='<ul>'+calhtml+'</ul>';
  });
}


function drawGauge(targetelem, label, temp, options) {
    var data = google.visualization.arrayToDataTable([["Label", "Value"],[label,temp]]);
    // Create and draw the visualization.
    if (targetelem)
    {
        options["width"] = targetelem.getAttribute("width");
        options["height"] = targetelem.getAttribute("height");
        var chart = new google.visualization.Gauge(targetelem);
        chart.draw(data, options);
    }
}

function drawLineGraph(targetelem, dataarray, options) {
  if (dataarray) {
      var data = google.visualization.arrayToDataTable(dataarray);
      // Create and draw the visualization.
      if (targetelem)
      {
          options["width"]= targetelem.getAttribute("width");
          options["height"]=targetelem.getAttribute("height");
          new google.visualization.LineChart(targetelem).draw(data, options);
        }
    }
}

function loadAndDrawSensorData() {
  $.getJSON("https://realraum.at/shmcache/r3sensors.json", function(data){
    drawLineGraph(document.getElementById('tempgooglegraph'), data["TempSensorUpdate"],
      {curveType: "function", title: 'Temperature Sensors', colors: ['#FF0000','#CC0033','#660000','#CC3333'], chartArea:{left:32,top:20,width:"88%",height:"83%"}, legend: {position: "none"}}  );
    drawLineGraph(document.getElementById('lightgooglegraph'), data["IlluminationSensorUpdate"],
        {curveType: "none", title: 'Illumination Sensors', vAxis: {maxValue: 1024, minValue:5}, chartArea:{left:32,top:20,width:"88%",height:"83%"}, legend: {position: "none"}}  );
    drawLineGraph(document.getElementById('movementgooglegraph'), data["MovementSensorUpdate"],
        {curveType: "none", title: 'Movement Sensors', vAxis: {maxValue: 10, minValue:0}, chartArea:{left:32,top:20,width:"88%",height:"83%"}, legend: {position: "none"}}  );
    });
}

function writeAnwesenheitStatus(data)
{
  var html="";
  var sensorshtml="";
  var sensorstd="";
  if (data.open)
  {
   iconuri=data.icon.open;
   statuscolor="lime";
  }
  else
  {
   iconuri=data.icon.closed;
   statuscolor="red";
  }
  var anwesenheit_status_kiosk = document.getElementById('anwesenheit_status_kiosk');
  var anwesenheit_status_frontpage = document.getElementById('anwesenheit_status');
  if (anwesenheit_status_kiosk)
  {
    anwesenheit_status_kiosk.innerHTML='<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100"><tr><td style="width:100px;"><img style="float:left;" src="'+iconuri+'" height="100" width="100"/></td><td style="width:4px;"></td><td class="anwesenheitsstatus" style="background-color:'+statuscolor+'; ">'+data.status+'</td></tr></table>';
  }
  if (anwesenheit_status_frontpage)
  {
    anwesenheit_status_frontpage.innerHTML='<table border="0" cellpadding="0" cellspacing="0" width="100%" height="42"><tr><td style="width:42px;"><img style="float:left;" src="'+iconuri+'" height="42" width="42"/></td><td style="width:4px;"></td><td style="background-color:'+statuscolor+'; height:42px; text-align:center; margin-left:48px; margin-right:auto; font-size:larger; font-weight:bold; vertical-align:middle; display:table-cell;">'+data.status+'</td></tr></table>';
  }

  if (data.sensors)
  {
    if (data.sensors.temperature)
    {
      sensorstd+='<td class="sensorstatus"><b>Temperatur</b>';
      $.each( data.sensors.temperature, function(s, sensorobj) {
        sensorstd+='<br/>'+sensorobj.location+': '+sensorobj.value.toFixed(2)+sensorobj.unit;
		drawGauge(document.getElementById('tempgauge'), "Temp "+sensorobj.location, sensorobj.value, {redFrom: 33, redTo: 40, yellowFrom:29, yellowTo: 33,  minorTicks: 4, min:0, max:40});
      });
      sensorstd+='</td>';
    }
    if (data.sensors.ext_illumination)
    {
      sensorstd+='<td class="sensorstatus"><b>Licht</b>';
      $.each( data.sensors.ext_illumination, function(s, sensorobj) {
        sensorstd+='<br/>'+sensorobj.location+': '+sensorobj.value;
        drawGauge(document.getElementById('lightgauge'), "Licht "+sensorobj.location, sensorobj.value, {redFrom: 950, redTo: 1024,yellowFrom:0, yellowTo: 200,minorTicks: 4, min:0, max:1024});
      });
      sensorstd+='</td>';
    }
    if (data.sensors.door_locked)
    {
      sensorstd+='<td class="sensorstatus"><b>Eingangstür</b>';
      $.each( data.sensors.door_locked, function(s, sensorobj)  {
        var lockstatus="Auf";
        if (sensorobj.value) { lockstatus = "Zu"; }
        sensorstd+='<br/>'+sensorobj.location+': '+lockstatus;
      });
      sensorstd+='</td>';
    }
    if (data.sensors.ext_door_ajar)
    {
      sensorstd+='<td class="sensorstatus"><b>Türkontakt</b>';
      $.each( data.sensors.ext_door_ajar, function(s, sensorobj)  {
        var lockstatus="Auf";
        if (sensorobj.value) { lockstatus = "Zu"; }
        sensorstd+='<br/>'+sensorobj.location+': '+lockstatus;
      });
      sensorstd+='</td>';
    }
    if (data.sensors.ext_dust)
    {
      sensorstd+='<td class="sensorstatus"><b>Staub</b>';
      $.each( data.sensors.ext_dust, function(s, sensorobj) {
        sensorstd+='<br/>'+sensorobj.location+': '+sensorobj.value+sensorobj.unit+'</td>';
      });
      sensorstd+='</td>';

    }
    if (sensorstd != "")
    {
      sensorshtml='<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>'+sensorstd+'</tr></table>';
      document.getElementById('sensor_status').innerHTML=sensorshtml;
    }
  }
}

function updateAnwesenheitStatus()
{
 //var req = new XMLHttpRequest();
 url = "/status.json";
 //req.open("GET", url ,false);
 //google chrome workaround
 //req.setRequestHeader("googlechromefix","");
 //req.send(null);
 var jqxhr = $.getJSON(url, writeAnwesenheitStatus);
}

function updateDateClock(now)
{
  var daynames = new Array('So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa');
  var datetimestr = daynames[now.getDay()];
  datetimestr += ' ' + now.getDate();
  datetimestr += '.' + (now.getMonth() + 1);
  datetimestr += '.' + now.getFullYear();
  datetimestr += (now.getHours() > 9 ? ' ' : ' 0') + now.getHours();
  datetimestr += (now.getMinutes() > 9 ? ':' : ':0') + now.getMinutes();
  datetimestr += (now.getSeconds() > 9 ? ':' : ':0') + now.getSeconds();
  $('#dateclock').html(datetimestr);
}

function highlightEntry(idx, color, value)
{
  if(value == 0) {
    if(idx%2 == 0)
      $('#upnext' + idx).css('background-color', 'white');
    else
      $('#upnext' + idx).css('background-color', '#E0E0E0');
  } else {
    $('#upnext' + idx).css('background-color', color);
  }
}

var seconds = 0;
function clock(now)
{
  var now = new Date(new Date().valueOf() + 300);
  updateDateClock(now);
  seconds++;
  if(seconds >= 20) {
    seconds = 0;
  }
}

function showError(XMLHttpRequest, textStatus, errorThrown)
{
  alert("Error: " + textStatus);
}

function updateSensors()
{
  reloadImg(document.getElementById("tempsensor"));
  reloadImg(document.getElementById("movementsensor"));
  reloadImg(document.getElementById("lightsensor"));
}

function IsImageOk(img) {
    if (!img.complete)
    {
        return false;
    }
    if (typeof img.naturalWidth == "undefined" || (typeof img.naturalWidth == "number" && img.naturalWidth == 0))
    {
        return false;
    }
    return true;
}

var img_orig_src = {};
function reloadImgAlt(element)
{
    if(element.complete)
    {
      var new_image = new Image();
      //set up the new image
      new_image.id = element.id;
      new_image.className = element.className;
      if (! img_orig_src[element.id])
      {
        img_orig_src[element.id] = element.src;
      }
      new_image.src = img_orig_src[element.id] + "?dt="+Math.floor(new Date().getTime() / 1000).toString();
      if (IsImageOk(new_image))
      {
        element.parentNode.insertBefore(new_image,element);
        element.parentNode.removeChild(element);
      }
    }
}
function reloadImg(element)
{
    if (! img_orig_src[element.id])
    {
      img_orig_src[element.id] = element.src;
    }
    element.src = img_orig_src[element.id] + "?dt="+Math.floor(new Date().getTime() / 1000).toString();
}

$(document).ready(function()
{
  updateAnwesenheitStatus();
  setInterval("updateAnwesenheitStatus()", 10*1000);
  if (document.getElementById("dateclock"))
  {
    updateDateClock(new Date());
    setInterval("clock()", 500);
  }
  if (document.getElementById("grical_upcoming_kiosk"))
  {
    loadCalendarKiosk();
    setInterval("loadCalendarKiosk()", 123*1000);
  }
  if (document.getElementById("grical_upcoming"))
  {
    loadCalendarMainPage();
    setInterval("loadCalendarMainPage()", 123*1000);
  }
  if (document.getElementById("sensorgraphs"))
  {
    setInterval("updateSensors()",145*1000);
  }
  if (document.getElementById("tempgooglegraph") || document.getElementById("lightgooglegraph"))
  {
    loadAndDrawSensorData();
    setInterval("loadAndDrawSensorData()",145*1000);
  }
  if (document.getElementById("gplusevents"))
  {
    loadGooglePlusEvents();
    setInterval("loadGooglePlusEvents()", 1207*1000);
  }
});
