function writeGooglePlusEvents(data, elem)
{
  var ghtml = "";
  for (var i=0; i< data.items.length; i++)
  {
    var item = data.items[i];
    var noteobj = item.object;
    var attach = noteobj.attachments;
    var notetxt = noteobj.content;
    var noteimg = false;
    if (attach)
    {
      for (var a=0; a<attach.length; a++)
      {
        if ( attach[a].objectType == "photo")
        {
          noteimg = attach[a].image.url;
        }
        else if (attach[a].objectType == "event")
        {
          notetxt = "<b>" + attach[a].displayName+"</b><br/>"+notetxt;
        }
      }
    }
    ghtml += '<div class="gpluspost">'
    ghtml += '<img class="gplusactor" src="'+item.actor.image.url+'"/><p class="gplustimestamp">'+item.updated+'</p>';
    ghtml += '<p class="gplustxt">'+notetxt+'</p>';
    if (noteimg)
    {
      ghtml += '<p class="gplusimg"><img class="gplusimg" src="'+noteimg+'"/></p>';
    }
    ghtml += '</div>';
  }
  elem.innerHTML=ghtml;
}


function loadGooglePlusEvents()
{
  var gplusuri = "https://www.googleapis.com/plus/v1/people/113737596421797426873/activities/public?maxResults=3&key="+gplusapikey;
  var gpluscontainer=document.getElementById("gplusevents");
  gpluscontainer.innerHTML="Plus loading ...";
  $.getJSON(gplusuri, function(data){
    writeGooglePlusEvents(data, gpluscontainer);
  });
}


function writeCalendar(data, elem)
{
    var calhtml = "";
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
        var stime = data[s].starttime;
        while (stime.substring(stime.length-3,stime.length) == ":00")
        {
          stime=stime.substring(0,stime.length-3);
        }
        when = data[s].start +", "+stime+" Uhr";
      }
      calhtml += '<li class="level1"><span class="r3red">'+when+'</span> - '+data[s].title+'</li>'+"\n";
    }
    elem.innerHTML='<ul>'+calhtml+'</ul>';
}
function loadCalendar()
{
  //old URI: //grical.realraum.at/s/?query=!realraum&limit=9&view=json
  var calcontainer=document.getElementById("grical_upcoming");
  calcontainer.innerHTML="Calendar loading ...<br/>please wait a second or two";
  $.getJSON('/shmcache/grical_realraum.json', function(data){
    writeCalendar(data, calcontainer);
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
  html='<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100"><tr><td style="width:100px;"><img style="float:left;" src="'+iconuri+'" height="100" width="100"/></td><td style="width:4px;"></td><td class="anwesenheitsstatus" style="background-color:'+statuscolor+'; ">'+data.status+'</td></tr></table>';
  document.getElementById('anwesenheit_status').innerHTML=html;

  if (data.sensors)
  {
    for (var s=0; s<data.sensors.length;s++)
    {
      $.each( data.sensors[s], function(stype, std){
        $.each( std, function(swhere, svalue){
           sensorstd+='<td style="background-color:white; height:42px; text-align:center; vertical-align:middle; display:table-cell;"><b>'+stype+'</b><br/>'+swhere+': '+svalue+'</td>';
        });
      });
    }
  }
  if (sensorstd != "")
  {
    sensorshtml='<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>'+sensorstd+'</tr></table>';
    document.getElementById('sensor_status').innerHTML=sensorshtml;
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
var anwesenheit_timer = window.setInterval("updateAnwesenheitStatus()", 10000);

function updateSensors()
{
  reloadImg(document.getElementById("tempsensor"));
  reloadImg(document.getElementById("movementsensor"));
  reloadImg(document.getElementById("lightsensor"));
}

var timer;
var seconds = 0;
var schedule = Array()

$(document).ready(function()
{
  updateDateClock(new Date());
  setInterval("clock()", 500);
  updateAnwesenheitStatus();
  loadCalendar();
  loadGooglePlusEvents();
  setInterval("updateAnwesenheitStatus()", 10000);
  setInterval("loadCalendar()", 100000);
  setInterval("updateSensors()", 50000);
  setInterval("loadGooglePlusEvents()", 3600*1000);
});

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


function clock(now)
{
  var now = new Date(new Date().valueOf() + 300);
  updateDateClock(now);
  seconds++;
  if(seconds >= 20) {
    seconds = 0;
  }
}

//function updateSchedule()
//{
//  $.ajax({type: "GET", url: "/export/schedules.php", data: "days=3&start=-1", dataType: "xml", error: showError, success: parseXml});
//}

function showError(XMLHttpRequest, textStatus, errorThrown)
{
  alert("Error: " + textStatus);
}

function reloadImg(element)
{
    //var image = document.getElementById("theText");
    if(element.complete) {
        var new_image = new Image();
        //set up the new image
        new_image.id = element.id;
        new_image.className = element.className;
        new_image.src = element.src;
        element.parentNode.insertBefore(new_image,element);
        element.parentNode.removeChild(element);
    }
}
