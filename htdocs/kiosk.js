var $r3jq = jQuery.noConflict();

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
  //var gplusimgwidth = parseInt($r3jq('<table class="gplusimg" />').css("width"));
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
  $r3jq.getJSON(gplusuri, function(data){
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
      var stime = data[s].starttime;
      var dt;
      if (stime) {
        dt = Date.parse(data[s].start+'T'+data[s].starttime);
      } else {
        dt = Date.parse(data[s].start);
      }
      if (stime && Date.now() > dt)
      {
        when = "JETZT";
      }
      else
      {
        var weekday = weekday2str((new Date(dt)).getDay());
        var month = data[s].start.substring(5,7);
        if (month[0] == '0')
          month = month[1];
        var dayofmonth = data[s].start.substring(8,10);
          if (dayofmonth[0] == '0')
          dayofmonth = dayofmonth[1];
        if (stime) {
          while (stime.substring(stime.length-3,stime.length) == ":00")
          {
            stime=stime.substring(0,stime.length-3);
          }
          if (stime.length <= 2) { stime+="h"; }
          when = weekday + " " + dayofmonth+"."+month +", "+stime;
        } else {
          when = weekday + " " + dayofmonth+"."+month;
        }
      }
      data[s].when = when
    }
    return data
}

function loadCalendarKiosk()
{
  var calcontainer=document.getElementById("grical_upcoming_kiosk");
  $r3jq.getJSON('/shmcache/grical_realraum.json', function(data){
    var calhtml = "";
    $r3jq.each(calendarItemEnhancer(data), function(index, itm) {
      calhtml += '<li class="level1">'+itm.when+' - <span class="r3red">'+itm.title+'</span></li>'+"\n";
    });
    calcontainer.innerHTML='<ul>'+calhtml+'</ul>';
  });
}

function loadCalendarMainPage()
{
  //old URI: //grical.realraum.at/s/?query=!realraum&limit=9&view=json
  var calcontainer=document.getElementById("grical_upcoming");
  $r3jq.getJSON('/shmcache/grical_realraum.json', function(data){
    var calhtml = "";
    $r3jq.each(calendarItemEnhancer(data), function(index, itm) {
      calhtml += '<li class="level1"><div class="li">'+itm.when+' - <a href="'+itm.url+'" class="urlextern" title="'+itm.title+'"  rel="nofollow">'+itm.title+'</a></div></li>'+"\n";
    });
    calcontainer.innerHTML='<ul>'+calhtml+'</ul>';
  });
}

var gauges = {}
function drawGauge(targetelem, label, temp, options) {
    // Create and draw the visualization.
    if (targetelem)
    {
        var data = google.visualization.arrayToDataTable([["Label", "Value"],[label,temp]]);
        if (!gauges.hasOwnProperty(targetelem.id)) {
            gauges[targetelem] = new google.visualization.Gauge(targetelem);
        }
        gauges[targetelem].draw(data, options);
    }
}

var linecharts = {}
function drawLineGraph(targetelem, dataarray, options, x_is_epochdate) {
  if (dataarray && targetelem) {
    var data;
    if (x_is_epochdate) {
      data=new google.visualization.DataTable();
      data.addColumn('datetime',dataarray[0][0]);
      for (var c=1; c<dataarray[0].length; c++) {
        data.addColumn('number',dataarray[0][c]);
      }
      for (var r=1; r<dataarray.length; r++) {
        dataarray[r][0] = new Date(dataarray[r][0]*1000);
        data.addRow(dataarray[r]);
      }
    } else {
      data = google.visualization.arrayToDataTable(dataarray);
    }
    // Create and draw the visualization.
    options["width"]= targetelem.getAttribute("width");
    options["height"]=targetelem.getAttribute("height");
    if (!linecharts.hasOwnProperty(targetelem.id)) {
      linecharts[targetelem.id] = new google.visualization.LineChart(targetelem);
    }
    linecharts[targetelem.id].draw(data, options);
  }
}

function siNumberString(num,unit)
{
  var siid=""
  var sisize=new Array([1e9,"G"],[1e6,"M"],[1e3,"K"]);
  for (i=0; i<sisize.length; i++)
  {
    if (num >= sisize[i][0]) { siid=sisize[i][1]; num=num/sisize[i][0]; break;}

  }
  return (Math.round(num*10)/10)+siid+unit;
}

function writeAnwesenheitStatus(data)
{
  var html="";
  var sensorshtml="";
  var sensorsdiv="";
  if (data.state.open)
  {
   iconuri=data.state.icon.open;
   statuscolor="lime";
  }
  else
  {
   iconuri=data.state.icon.closed;
   statuscolor="red";
  }
  var anwesenheit_status_kiosk = document.getElementById('anwesenheit_status_kiosk');
  var anwesenheit_status_frontpage = document.getElementById('anwesenheit_status');
  var statusage = parseInt((new Date()).getTime()/1000) - data.state.lastchange;
  var statusagestatus = "";
  if (statusage > 600)
  {
    //var statusagestatus = '<tr style="height:5px; overflow:hidden; "><td colspan="2"></td><td style="text-align:right; font-size:5%; background:red;">Status older than ' + siNumberString(statusage,"s") + '</td></tr>';
    var statusagestatus = '<br/><div style="text-align:right; float:right; margin:0; padding:1px; line-height:105%; font-size:65%; background:red;">Status older than ' + siNumberString(statusage,"s") + '</div>';
  }
  if (anwesenheit_status_kiosk)
  {
    anwesenheit_status_kiosk.innerHTML='<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100"><tr><td style="width:100px;"><img style="float:left;" src="'+iconuri+'" height="100" width="100"/></td><td style="width:4px;"></td><td class="anwesenheitsstatus" style="background-color:'+statuscolor+'; ">'+data.state.message+'</td></tr></table>';
  }
  if (anwesenheit_status_frontpage)
  {
    //anwesenheit_status_frontpage.innerHTML='<table border="0" cellpadding="0" cellspacing="0" width="100%" height="42"><tr><td style="width:42px;"><img style="float:left;" src="'+iconuri+'" height="42" width="42"/></td><td style="width:4px;"></td><td style="background-color:'+statuscolor+'; height:42px; text-align:center; margin-left:48px; margin-right:auto; font-size:larger; font-weight:bold; vertical-align:middle; display:table-cell;">'+data.status+'</td></tr>'+statusagestatus+'</table>';
    //anwesenheit_status_frontpage.innerHTML='<table border="0" cellpadding="0" cellspacing="0" style="padding:0; margin:0: height:42px; width:100%;"><tr><td style="width:42px;"><img style="float:left;" src="'+iconuri+'" height="42" width="42"/></td><td style="width:4px;"></td><td style="background-color:'+statuscolor+'; height:42px; text-align:center; margin-left:48px; margin-right:auto; font-size:larger; font-weight:bold; vertical-align:middle; display:table-cell;">'+data.status+statusagestatus+'</td></tr></table>';
    anwesenheit_status_frontpage.innerHTML='<div style="height:42px; width:100%;"><img style="float:left;" src="'+iconuri+'" height="42" width="42"/><div style="background-color:'+statuscolor+'; height:42px; line-height: 42px; text-align:center; vertical-align: middle; margin-left:48px; margin-right:auto; font-size:larger; font-weight:bold;">'+data.state.message+statusagestatus+'</div></div>';
  }

  var evtstatuselem = document.getElementById('event_status');
  if (evtstatuselem) {
    if (data.events)
    {

    } else {
      evtstatuselem.innerHTML="";
    }
  }

  if (data.sensors)
  {
    if (data.sensors.door_locked)
    {
      sensorsdiv+='<div class="sensorstatus"><b><u>Eingangstür</u></b>';
      $r3jq.each( data.sensors.door_locked, function(s, sensorobj)  {
        var lockstatus="Auf";
        if (sensorobj.value) { lockstatus = "Zu"; }
        sensorsdiv+='<br/>'+sensorobj.location+': '+lockstatus;
      });
      sensorsdiv+='</div>';
    }
    if (data.sensors.ext_door_ajar)
    {
      sensorsdiv+='<div class="sensorstatus"><b><u>Türkontakt</u></b>';
      $r3jq.each( data.sensors.ext_door_ajar, function(s, sensorobj)  {
        var lockstatus="Auf";
        if (sensorobj.value) { lockstatus = "Zu"; }
        sensorsdiv+='<br/>'+sensorobj.location+': '+lockstatus;
      });
      sensorsdiv+='</div>';
    }
    if (data.sensors.temperature)
    {
      sensorsdiv+='<div class="sensorstatus"><b><u>Temperatur</u></b>';
      $r3jq.each( data.sensors.temperature, function(s, sensorobj) {
        sensorsdiv+='<br/>'+sensorobj.location+': '+sensorobj.value.toFixed(2)+sensorobj.unit;
	if (temperature_graph2d) {
		addVisDatapoint(temperature_graph2d, temperature_dataset, {x: sensorobj.timestamp, y:sensorobj.value, group:s});
	}
        drawGauge($r3jq('.tempgauge[sensorlocation=\''+sensorobj.location+'\']').get()[0], "Temp "+sensorobj.location, sensorobj.value, {redFrom: 33, redTo: 40, yellowFrom:29, yellowTo: 33,  minorTicks: 4, min:0, max:40});
      });
      sensorsdiv+='</div>';
    }
    if (data.sensors.ext_illumination)
    {
      sensorsdiv+='<div class="sensorstatus"><b><u>Licht</u></b>';
      $r3jq.each( data.sensors.ext_illumination, function(s, sensorobj) {
        sensorsdiv+='<br/>'+sensorobj.location+': '+sensorobj.value;
        drawGauge($r3jq('.lightgauge[sensorlocation=\''+sensorobj.location+'\']').get()[0], "Temp "+sensorobj.location, sensorobj.value, {redFrom: 950, redTo: 1024,yellowFrom:0, yellowTo: 200,minorTicks: 4, min:0, max:1024});
      });
      sensorsdiv+='</div>';
    }
    if (data.sensors.ext_dust)
    {
      sensorsdiv+='<div class="sensorstatus"><b><u>Staub</u></b>';
      $r3jq.each( data.sensors.ext_dust, function(s, sensorobj) {
        sensorsdiv+='<br/>'+sensorobj.location+': '+sensorobj.value+sensorobj.unit;
      });
      sensorsdiv+='</div>';
    }
    if (data.sensors.humidity)
    {
      sensorsdiv+='<div class="sensorstatus"><b><u>Humidity</u></b>';
      $r3jq.each( data.sensors.humidity, function(s, sensorobj) {
        sensorsdiv+='<br/>'+sensorobj.location+': '+sensorobj.value+sensorobj.unit;
        drawGauge($r3jq('.humiditygauge[sensorlocation=\''+sensorobj.location+'\']').get()[0], "Humidity "+sensorobj.location, sensorobj.value, {redFrom: 90, redTo: 100,yellowFrom:0, yellowTo:10 ,minorTicks: 5, min:0, max:100});
      });
      sensorsdiv+='</div>';
    }
    if (data.sensors.power_consumption)
    {
      sensorsdiv+='<div class="sensorstatus"><b><u>Stromverbrauch</u></b>';
      $r3jq.each( data.sensors.power_consumption, function(s, sensorobj) {
        sensorsdiv+='<br/>'+sensorobj.location+': '+sensorobj.value+sensorobj.unit;
      });
      sensorsdiv+='</div>';
    }
    var battcharge = {};
    if (data.sensors.ext_batterycharge)
    {
      $r3jq.each( data.sensors.ext_batterycharge, function(s, sensorobj) {
        battcharge[sensorobj.location] = sensorobj.value+sensorobj.unit;
      });
    }
    if (data.sensors.ext_voltage)
    {
      sensorsdiv+='<div class="sensorstatus"><b><u>Spannung</u></b>';
      $r3jq.each( data.sensors.ext_voltage, function(s, sensorobj) {
        sensorsdiv+='<br/>'+sensorobj.location+': '+sensorobj.value+sensorobj.unit;
        if (battcharge[sensorobj.location]) {
          sensorsdiv+=' ('+battcharge[sensorobj.location]+')';
        }
      });
      sensorsdiv+='</div>';
    }
    if (data.sensors.ext_lasercutter_hot)
    {
      sensorsdiv+='<div class="sensorstatus"><b><u>Lasercutter</u></b>';
      $r3jq.each( data.sensors.ext_lasercutter_hot, function(s, sensorobj) {
        var use = "NotInUse";
        if (sensorobj.value) {use="InUse";}
        sensorsdiv+='<br/>'+sensorobj.location+': '+use+'</div>';
      });
      sensorsdiv+='</div>';
    }
    if (sensorsdiv != "")
    {
      sensorshtml='<div style="width:100%; display:inline-block;">'+sensorsdiv;
      var sensorstatuselem = document.getElementById('sensor_status');
      if (sensorstatuselem) {
       sensorstatuselem.innerHTML=sensorshtml;
      }
    }
  }
}

function updateAnwesenheitStatus()
{
 //var req = new XMLHttpRequest();
 //url = "/status.json";
 url = "//realraum.at/status.json";
 //req.open("GET", url ,false);
 //google chrome workaround
 //req.setRequestHeader("googlechromefix","");
 //req.send(null);
 var jqxhr = $r3jq.getJSON(url, writeAnwesenheitStatus);
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
  $r3jq('#dateclock').html(datetimestr);
}

function highlightEntry(idx, color, value)
{
  if(value == 0) {
    if(idx%2 == 0)
      $r3jq('#upnext' + idx).css('background-color', 'white');
    else
      $r3jq('#upnext' + idx).css('background-color', '#E0E0E0');
  } else {
    $r3jq('#upnext' + idx).css('background-color', color);
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

// function updateSensors()
// {
//   reloadImg(document.getElementById("tempsensor"));
//   reloadImg(document.getElementById("movementsensor"));
//   reloadImg(document.getElementById("lightsensor"));
// }

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

function addVisDatapoint(graph, dataset, data)
{
    var now = vis.moment();
    dataset.add(data);
    // remove all data points which are no longer visible
    var range = graph.getWindow();
    var interval = range.end - range.start;
    var oldIds = dataset.getIds({
      filter: function (item) {
        return item.x < range.start - interval;
      }
    });
    dataset.remove(oldIds);
    console.log(dataset);

    graph.setWindow(now - interval, now, {animation: false});
}

var temperature_graph2d = false;
var temperature_dataset = false;

$r3jq(document).ready(function()
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
  if (document.getElementById("gplusevents"))
  {
    loadGooglePlusEvents();
    setInterval("loadGooglePlusEvents()", 1207*1000);
  }
  if (document.getElementById("vistemperature"))
  {
// create a graph2d with an (currently empty) dataset
  var container = document.getElementById("vistemperature");
  temperature_dataset = new vis.DataSet();

  var options = {
    start: vis.moment().add(-30, 'seconds'), // changed so its faster
    end: vis.moment(),
    dataAxis: {
      left: {
        range: {
          min:-10, max: 10
        }
      }
    },
    drawPoints: {
      style: 'circle' // square, circle
    },
    shaded: {
      orientation: 'bottom' // top, bottom
    }
  };
  temperature_graph2d = new vis.Graph2d(container, temperature_dataset, options);
  }
  if (document.getElementById("dw__tagline"))
  {
	var additional_subtitles=new Array("Hackspace in Graz","Makerspace in Graz","DIYBioLab in Graz","Chaostreff in Graz");
	var additional_subtitle_interval=4200;
	//var the_subtitle_element=$r3jq("h2.site-description");
	var the_subtitle_element=$r3jq("#dw__tagline");

	var subdv = $r3jq('<div style="position:relative;">');
	$r3jq("<span/>").addClass("sitesubdescr").css("position","absolute").text(the_subtitle_element.text()).appendTo(subdv);
	$r3jq.each(additional_subtitles, function(i,t){ $r3jq("<span/>").addClass("sitesubdescr").css("position","absolute").hide().text(t).appendTo(subdv); })
	the_subtitle_element.text("").append(subdv);

	var ssdidx=0;
	setInterval(function () {
	    $r3jq(document.getElementsByClassName("sitesubdescr")[ssdidx]).fadeOut(600);
	    ssdidx=(ssdidx+1) % document.getElementsByClassName("sitesubdescr").length;
	    $r3jq(document.getElementsByClassName("sitesubdescr")[ssdidx]).css("display","inline").fadeIn(600);
	}, additional_subtitle_interval);
}
});
